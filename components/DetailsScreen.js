import React from "react";
import { MapView } from "expo";
<<<<<<< HEAD
import { Platform, StyleSheet, Text, View, Button, Alert } from "react-native";
import { Constants, Location, Permissions } from 'expo';
=======
import { StyleSheet, View, Alert } from "react-native";
>>>>>>> 018bfabbceafbe191c8c691c9d9c3d8b25c2ecdd
import axios from "axios";

import RallyDetails from "./RallyDetails";

let timeoutID;

class DetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = null;
    this.locations = this.props.navigation.getParam("locations", []);
    this.markerIDs = [];
    console.log('this.locations: ', this.locations);
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
      selectedMarker: null
    };
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
  };

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
        <RallyDetails selectedMarker={this.state.selectedMarker} />
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
