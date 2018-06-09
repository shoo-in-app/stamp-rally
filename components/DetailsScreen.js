import React from "react";
import { MapView } from "expo";
import { Platform, StyleSheet, Text, View, Button, Alert } from "react-native";
import { Constants, Location, Permissions } from 'expo';
import axios from "axios";

import RallyDetails from "./RallyDetails";

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
                // PATCH change to API
                // Update marker

                if (markerInfo.visited) return;
                axios
                  .patch(
                    `https://cc4-flower-dev.herokuapp.com/location/${
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

    let loc = await Location.watchPositionAsync({
      enableHighAccuracy: true,
      distanceInterval: 1,
      timeInterval: 2000
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
      this.isCloseToMarker();
    });
    console.log('165: ', loc);
  };

  distance(lat1, lon1, lat2, lon2, unit) {
    const radlat1 = Math.PI * lat1 / 180
    const radlat2 = Math.PI * lat2 / 180
    const theta = lon1 - lon2
    const radtheta = Math.PI * theta / 180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;;
    alert('distance: ', dist);
    return dist;
  }

  isCloseToMarker() {
    // get all markers except user's
    const targetMarkers = this.state.markers.slice(0, -1);
    for (let i = 0; i < targetMarkers.length; i++) {
      console.log('188: ', this.state.markers.slice(-1));
      // user location marker
      const userCoords = this.state.markers.slice(-1)[0].props.coordinate;
      // the other location markers
      const coords = targetMarkers[i].props.coordinate;
      const distance = this.distance(coords.latitude, coords.longitude, 35.6549, 139.726);// userCoords.latitude, userCoords.longitude);
      console.log('194 ', i, targetMarkers[i]);
      console.log('195 ', this.state.selectedMarker);
      if (distance < 5) {
        this.setState({ disabled: false });
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
