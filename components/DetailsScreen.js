import React from "react";
import { MapView } from "expo";
import { StyleSheet, View, Alert } from "react-native";
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
                        [{ text: "OK", onPress: () => {} }]
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
