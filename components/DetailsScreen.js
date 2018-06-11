import React from "react";
import { MapView } from "expo";
import PropTypes from "prop-types";
import { Platform, StyleSheet, Text, View, Button, Alert } from "react-native";
import { Constants, Location, Permissions } from 'expo';
import axios from "axios";

import RallyDetails from "./RallyDetails";
import LoginScreen from "./LoginScreen";
let timeoutID;

class DetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = null;
    this.locations = this.props.navigation.getParam("locations", []);
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
          pinColor={location.visited ? "green" : "red"}
          onPress={
            /*eslint-disable */
            location.visited
              ? () => {
                this.setState((oldState) => {
                  const newState = { ...oldState };
                  newState.selectedMarker = this.locations[index];
                  return newState;
                });
              }
              : () => {
                this.setState((oldState) => {
                  const newState = { ...oldState };
                  newState.selectedMarker = this.locations[index];
                  return newState;
                });
                const markerInfo = this.locations[index];
                console.log('makerInfo: ', markerInfo);
                this.isCloseToMarker(markerInfo);
                // PATCH change to API
                // Update marker

                if (markerInfo.visited) return;
                axios
                  .patch(
                    `http://localhost:8000/location/${
                    markerInfo.user_id
                    }/${markerInfo.location_id}`,
                    {
                      visited: true
                    }
                  )
                  .then(() => {
                    this.setState((oldState) => {
                      const newState = { ...oldState };
                      const newMarker = newState.markers[index].props;
                      newState.markers[index] = (
                        <MapView.Marker
                          key={newMarker.identifier}
                          identifier={newMarker.identifier}
                          coordinate={newMarker.coordinate}
                          description={newMarker.description}
                          pinColor="green"
                          onPress={() => {
                            this.setState((oldState) => {
                              const newState = { ...oldState };
                              newState.selectedMarker = this.locations[index];
                              return newState;
                            });
                          }}
                        />
                      );
                      return newState;
                    });
                  })
                  .catch(() => {
                    Alert.alert(
                      "Connection error",
                      "There is a problem with the internet connection. Please try again later.",
                      [{ text: "OK", onPress: () => { } }]
                    );
                  });
              }
          }
        /*eslint-enable */
        />
      );
    });
    this.state = {
      markers: this.markers,
      selectedMarker: null,
      disabled: true
    };
    this.distance = this.distance.bind(this);
    this.isCloseToMarker = this.isCloseToMarker.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title", "Rally Details")
    };
  };

  componentDidMount() {
    timeoutID = setTimeout(() => {
      this.mapRef.fitToSuppliedMarkers(this.markerIDs, false);
    }, 1);
  }

  componentWillUnmount() {
    if (timeoutID) clearTimeout(timeoutID);
  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    const userLocation = <MapView.Marker
      key={location.identifier}
      identifier={location.identifier}
      coordinate={location.coords}
      title="Your location"
      description="This is your current location"
      pinColor="blue"
    />;
    let markers = this.state.markers.slice();
    markers.push(userLocation);
    this.setState({ markers });

    await Location.watchPositionAsync({
      enableHighAccuracy: true,
      distanceInterval: 1,
      timeInterval: 200
    }, (loccation) => {
      alert("updated!!");
      const updateLocation = <MapView.Marker
        key={location.identifier}
        identifier={location.identifier}
        coordinate={location.coords}
        title="Your location"
        description="This is your current location"
        pinColor="blue"
      />;
      let markers = this.state.markers.slice();
      markers.splice(-1, 1, updateLocation);
      this.setState({ markers });
    });
  };

  distance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1) * (Math.PI / 180)) * Math.cos((lat2) * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d * 1000;//Distance in meter
  }

  isCloseToMarker(markerInfo) {
    // user location marker
    const userCoords = this.state.markers.slice(-1)[0].props.coordinate;
    // the other location markers
    const distance = this.distance(markerInfo.lat, markerInfo.lng, userCoords.latitude, userCoords.longitude);
    if (distance < 5) {
      if (this.state.selectedMarker === null) {
        return this.setState({ disabled: true });
      }
      else {
        if (this.state.selectedMarker
          && this.state.selectedMarker.id === markerInfo.id) {
          return this.setState({ disabled: false });
        }
      }
    }
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
        </MapView>
        <RallyDetails selectedMarker={this.state.selectedMarker} disabled={this.state.disabled} />
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

// DetailsScreen.propTypes = {
//   userID: PropTypes.string,
// };
