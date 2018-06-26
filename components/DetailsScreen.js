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
  Platform,
  Text,
  Modal
} from "react-native";
import axios from "axios";
import { Header } from "react-navigation";

import moment from "moment";

import uncollectedStampImg from "../assets/markers/stamp-uncollected-small.png";
import collectedStampImg from "../assets/markers/stamp-collected-small.png";

import RallyDetails from "./RallyDetails";
let timeoutID;

const { height } = Dimensions.get("window");

const PANEL_DELAY = 1800;

class DetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = null;

    this.rallyID = this.props.navigation.getParam("rallyID", null);
    this.expiryTime = this.props.navigation.getParam("expiryTime");
    this.rewardPoints = this.props.navigation.getParam("rewardPoints");
    this.locations = this.props.navigation.getParam("locations", []);
    this.reloadData = this.props.navigation.getParam("reloadData");
    this.userLocation = this.props.navigation.getParam("userLocation");
    this.isLocationPermissionGranted = this.props.navigation.getParam(
      "isLocationPermissionGranted"
    );

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
      distanceToSelectedLocation: null,
      isModalVisible: false,
      totalVisited: this.locations.filter((location) => location.visited).length
    };

    this.collectStamp = this.collectStamp.bind(this);
    this.deleteRally = this.deleteRally.bind(this);
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
            },
            totalVisited: oldState.totalVisited + 1
          };

          return newState;
        });
      })
      .then(() => {
        if (this.state.totalVisited >= this.locations.length) {
          new Promise((resolve) => {
            setTimeout(resolve, 1800);
          }).then(() => {
            this.setState({ isModalVisible: true });
          });
        }
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
    if (!this.isLocationPermissionGranted) {
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
    timeoutID = setTimeout(() => {
      this.mapRef.fitToSuppliedMarkers(this.markerIDs, false);
    }, 50);
  }

  componentWillUnmount() {
    if (timeoutID) clearTimeout(timeoutID);
  }

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
    const userCoords = this.userLocation.props.coordinate;
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

  deleteRally() {
    axios
      .patch(
        `https://cc4-flower.herokuapp.com/mobile-api/rally/${
          this.props.userID
        }/${this.rallyID}`,
        {
          chosen: false
        }
      )
      .then(() => {
        this.reloadData();
        this.props.navigation.navigate("Home");
      })
      .catch((err) => {
        console.log(err);
        Alert.alert(
          "Connection error",
          "There is a problem with the internet connection. Please try again later.",
          [{ text: "OK", onPress: () => {} }]
        );
      });
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <Modal
          animationType="fade"
          visible={this.state.isModalVisible}
          transparent={true}
        >
          <View
            style={{
              backgroundColor: "white",
              width: "80%",
              alignSelf: "center",
              marginTop: height / 2,
              padding: 10,
              borderRadius: 5
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 5
              }}
            >
              Rally complete!
            </Text>
            <Text>You got {this.rewardPoints} points!</Text>
            <Button
              title="Dismiss"
              onPress={() => {
                this.props.addUserExp(this.rewardPoints);
                this.setState({ isModalVisible: false });
                axios
                  .patch(
                    `https://cc4-flower.herokuapp.com/mobile-api/exp/${
                      this.props.userID
                    }`,
                    {
                      exp: this.rewardPoints
                    }
                  )
                  .catch((err) => {
                    console.log(err);
                    Alert.alert(
                      "Connection error",
                      "There is a problem with the internet connection. Please try again later.",
                      [{ text: "OK", onPress: () => {} }]
                    );
                  });
                this.props.navigation.navigate("Home");
              }}
            />
          </View>
        </Modal>
        <MapView
          style={styles.map}
          ref={(ref) => {
            this.mapRef = ref;
          }}
        >
          {this.state.markers}
          {this.userLocation}
        </MapView>
        {this.state.isRallyChosen ? (
          <RallyDetails
            selectedLocation={this.state.selectedLocation}
            isWithinRange={this.state.isWithinRange}
            collectStamp={this.collectStamp}
            distanceToStamp={this.state.distanceToSelectedLocation}
            expiryTime={this.expiryTime}
            PANEL_DELAY={PANEL_DELAY}
            isCompleted={this.state.totalVisited >= this.locations.length}
            deleteRally={this.deleteRally}
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
            <Text>Expires {moment(this.expiryTime).fromNow()}</Text>
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
  userID: PropTypes.string,
  addUserExp: PropTypes.func.isRequired
};
