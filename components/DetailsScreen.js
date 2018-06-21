import React from "react";
import PropTypes from "prop-types";
import { MapView } from "expo";
import {
  Button,
  StyleSheet,
  View,
  Alert,
  Dimensions,
  Image,
  Platform
} from "react-native";
import { Location, Permissions } from "expo";
import axios from "axios";
import { Header } from "react-navigation";

import uncollectedStampImg from "../assets/markers/stamp-uncollected-small.png";
import collectedStampImg from "../assets/markers/stamp-collected-small.png";

import RallyDetails from "./RallyDetails";
let timeoutID;

const { height } = Dimensions.get("window");

class DetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = null;

    this.rallyID = this.props.navigation.getParam("rallyID", null);
    this.locations = this.props.navigation.getParam("locations", []);
    this.reloadData = this.props.navigation.getParam("reloadData");

    this.markerIDs = [];
    this.markers = this.locations.map((location, index) => {
      this.markerIDs.push(location.id.toString());
      return (
        <MapView.Marker
          identifier={location.id.toString()}
          key={location.id.toString()}
          coordinate={{
            latitude: location.lat,
            longitude: location.lng
          }}
          title={location.title}
          description={location.description}
          image={
            Platform.OS === "android"
              ? location.visited
                ? collectedStampImg
                : uncollectedStampImg
              : undefined
          }
          onPress={() => {
            this.setState({
              selectedLocation: location,
              isWithinRange: this.isWithinRange(location),
              selectedLocationIndex: index
            });
          }}
        >
          {Platform.OS === "ios" ? (
            location.visited ? (
              <Image source={collectedStampImg} style={styles.mapMarkerImage} />
            ) : (
              <Image
                source={uncollectedStampImg}
                style={styles.mapMarkerImage}
              />
            )
          ) : null}
        </MapView.Marker>
      );
    });

    this.state = {
      markers: this.markers,
      selectedLocation: null,
      selectedLocationIndex: -1,
      isWithinRange: true,
      userLocation: null,
      isRallyChosen: this.locations[0].visited !== undefined,
      distanceToSelectedLocation: null
    };

    this.collectStamp = this.collectStamp.bind(this);
  }

  collectStamp(locationId) {
    axios
      .patch(
        `https://cc4-flower.herokuapp.com/mobile-api/location/${
          this.props.userID
        }/${locationId}`,
        {
          visited: true
        }
      )
      .then(() => {
        this.reloadData();
        this.setState((oldState) => {
          const thisLocation = this.state.selectedLocation;

          const newMarker = (
            <MapView.Marker
              identifier={this.state.selectedLocation.id.toString()}
              key={this.state.selectedLocation.id.toString()}
              coordinate={{
                latitude: this.state.selectedLocation.lat,
                longitude: this.state.selectedLocation.lng
              }}
              title={this.state.selectedLocation.title}
              description={this.state.selectedLocation.description}
              image={Platform.OS === "android" ? collectedStampImg : undefined}
              onPress={() => {
                this.setState({
                  selectedLocation: thisLocation
                });
              }}
            >
              {Platform.OS === "ios" ? (
                <Image
                  source={collectedStampImg}
                  style={styles.mapMarkerImage}
                />
              ) : null}
            </MapView.Marker>
          );
          const newState = {
            ...oldState,
            markers: [
              ...oldState.markers.slice(0, oldState.selectedLocationIndex),
              newMarker,
              ...oldState.markers.slice(oldState.selectedLocationIndex + 1)
            ],
            selectedLocation: {
              ...oldState.selectedLocation,
              visited: true
            }
          };

          return newState;
        });
      })
      .catch(() => {
        Alert.alert(
          "Connection error",
          "There is a problem with the internet connection. Please try again later.",
          [{ text: "OK", onPress: () => {} }]
        );
      });
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title", "Rally Details"),
      headerTitleStyle: {
        fontFamily: "edo",
        fontSize: 18
      }
    };
  };

  componentDidMount() {
    this._getLocationAsync();
    timeoutID = setTimeout(() => {
      this.mapRef.fitToSuppliedMarkers(this.markerIDs, false);
    }, 50);
  }

  componentWillUnmount() {
    if (timeoutID) clearTimeout(timeoutID);
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      Alert.alert(
        "Location Permissions Denied",
        "You must grant location permission to this app in order to collect stamps.",
        [
          {
            text: "OK",
            onPress: () => {
              this.props.navigation.navigate("Home");
            }
          }
        ]
      );
      return;
    }

    await Location.watchPositionAsync(
      {
        enableHighAccuracy: true,
        distanceInterval: 1,
        timeInterval: 200
      },
      (location) => {
        const userLocation = (
          <MapView.Marker
            key={"userLocation"}
            identifier={location.identifier}
            coordinate={location.coords}
            title="Your location"
            description="This is your current location"
            pinColor="blue"
          />
        );
        this.setState({ userLocation });
      }
    );
  };

  distanceToStamp(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d * 1000; // Distance in m
  }

  isWithinRange(location) {
    const COLLECTION_RANGE = 5000;

    if (this.isRallyChosen) return;
    // user location marker
    const userCoords = this.state.userLocation.props.coordinate;
    // the other location markers
    const distanceToStamp = this.distanceToStamp(
      location.lat,
      location.lng,
      userCoords.latitude,
      userCoords.longitude
    );

    this.setState({ distanceToSelectedLocation: distanceToStamp });

    return distanceToStamp < COLLECTION_RANGE;
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <MapView
          style={styles.map}
          ref={(ref) => {
            this.mapRef = ref;
          }}
        >
          {this.state.markers}
          {this.state.userLocation}
        </MapView>
        {this.state.isRallyChosen ? (
          <RallyDetails
            selectedLocation={this.state.selectedLocation}
            isWithinRange={this.state.isWithinRange}
            collectStamp={this.collectStamp}
            distanceToStamp={this.state.distanceToSelectedLocation}
          />
        ) : (
          <View style={styles.chooseContainer}>
            <Button
              title="Choose this Rally"
              color="#A61414"
              onPress={() => {
                axios
                  .patch(
                    `https://cc4-flower.herokuapp.com/mobile-api/rally/${
                      this.props.userID
                    }/${this.rallyID}`,
                    {
                      chosen: true
                    }
                  )
                  .then(() => {
                    this.reloadData();
                    this.setState({ isRallyChosen: true });
                  });
              }}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: { height: height - Header.HEIGHT - 120 },
  chooseContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  mapMarkerImage: {
    height: 48,
    width: 48
  }
});

export default DetailsScreen;

DetailsScreen.propTypes = {
  userID: PropTypes.string
};
