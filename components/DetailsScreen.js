import React from "react";
import PropTypes from "prop-types";
import { MapView } from "expo";
import { Button, Platform, StyleSheet, View, Alert } from "react-native";
import { Constants, Location, Permissions } from "expo";
import axios from "axios";

import uncollectedStamp from "../assets/markers/stamp-uncollected.png";
import collectedStamp from "../assets/markers/stamp-collected.png";

import RallyDetails from "./RallyDetails";
let timeoutID;

class DetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = null;
    this.rallyID = this.props.navigation.getParam("rallyID", null);
    this.locations = this.props.navigation.getParam("locations", []);
    this.notChosenRally = this.locations[0].visited === undefined;
    this.markerIDs = [];
    this.markers = this.locations.map((location) => {
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
          image={location.visited ? collectedStamp : uncollectedStamp}
          onPress={() => {
            this.setState({ selectedLocation: location });
            if (!location.visited) {
              this.isCloseToMarker(location);
            }
          }}
        />
      );
    });
    this.state = {
      markers: this.markers,
      selectedMarker: null,
      disabled: true,
      userLocation: null
    };
    this.distance = this.distance.bind(this);
    this.isCloseToMarker = this.isCloseToMarker.bind(this);
    this.sendPatch = this.sendPatch.bind(this);
  }
  sendPatch(id) {
    axios
      .patch(
        `https://cc4-flower-dev.herokuapp.com/location/${
          this.props.userID
        }/${id}`,
        {
          visited: true
        }
      )
      .then(() => {
        this.setState((oldState) => {
          const newState = { ...oldState };
          newState.markers[id - 1].props.image = collectedStamp;
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
      title: navigation.getParam("title", "Rally Details")
    };
  };

  componentDidMount() {
      this._getLocationAsync();
    timeoutID = setTimeout(() => {
      this.mapRef.fitToSuppliedMarkers(this.markerIDs, false);
    }, 1);
  }

  componentWillUnmount() {
    if (timeoutID) clearTimeout(timeoutID);
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
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

  distance(lat1, lon1, lat2, lon2) {
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
    return d; //Distance in meter
  }

  isCloseToMarker(markerInfo) {
    if (this.notChosenRally) return;
    // user location marker
    const userCoords = this.state.userLocation.props.coordinate;
    // the other location markers
    const distance = this.distance(
      markerInfo.lat,
      markerInfo.lng,
      userCoords.latitude,
      userCoords.longitude
    );
    if (distance < 5) {
      this.setState({ disabled: false });
    }
  }

  get confirmView() {
    if (this.notChosenRally)
      return (
        <View>
          <Button
            title="Choose this Rally"
            onPress={() => {
              axios.patch(
                `https://cc4-flower-dev.herokuapp.com/rally/${
                  this.props.userID
                }/${this.rallyID}`,
                {
                  chosen: true
                }
              );
            }}
          />
        </View>
      );
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
          {[...this.state.markers, this.state.userLocation]}
        </MapView>
        <RallyDetails
          selectedMarker={
            this.locations.find((location) => {
              if (!this.selectedMarker) return false;
              return location.id === this.state.selectedMarker.key;
            }) || null
          }
          disabled={this.state.disabled}
          sendPatch={this.sendPatch}
        />
        {this.confirmView}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  details: {
    flex: 0,
    flexBasis: 100,
    height: 100
  }
});

export default DetailsScreen;

DetailsScreen.propTypes = {
  userID: PropTypes.string
};
