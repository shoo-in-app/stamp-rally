import React from "react";
import { MapView } from "expo";
import { StyleSheet, Text, View, Button } from "react-native";

import RallyDetails from "./RallyDetails";

class DetailsScreen extends React.Component {
  render() {
    const { navigation } = this.props;
    const locations = navigation.getParam("locations", [
      {
        latlng: {
          latitude: 37.78825,
          longitude: -122.4324
        },
        title: "San Francisco!",
        description: "A city in America."
      }
    ]);

    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        >
          {locations.map((location) => (
            <MapView.Marker
              key={location.id}
              coordinate={location.latlng}
              title={location.title}
              description={location.description}
            />
          ))}
        </MapView>
        <RallyDetails style={styles.details} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: { flex: 0.8 },
  details: {
    flex: 0.2
  }
});

export default DetailsScreen;
