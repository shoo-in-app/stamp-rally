import React from "react";
import { MapView } from "expo";
import { StyleSheet, Text, View, Button } from "react-native";

import RallyDetails from "./RallyDetails";

let timeoutID;

class DetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = null;
    this.locations = this.props.navigation.getParam("locations", []);
    this.markerIDs = [];
  }

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
          {this.locations.map((location) => {
            this.markerIDs.push(location.id.toString());
            return (
              <MapView.Marker
                identifier={location.id.toString()}
                key={location.id}
                coordinate={{
                  latitude: location.lat,
                  longitude: location.lng
                }}
                title={location.title}
                description={location.description}
              />
            );
          })}
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
