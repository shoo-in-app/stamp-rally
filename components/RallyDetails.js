import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default class RallyDetails extends React.Component {
  render() {
    if (this.props.selectedMarker) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>{this.props.selectedMarker.name}</Text>
          <Text style={styles.description}>
            {this.props.selectedMarker.description}
          </Text>
        </View>
      );
    } else {
      return <Text style={styles.placeholder}>Select a location!</Text>;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    height: 100,
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  placeholder: {
    flex: 0,
    height: 100,
    fontSize: 20,
    textAlign: "center"
  },
  title: {
    fontSize: 20,
    margin: 10
  },
  description: {
    fontSize: 15,
    margin: 10
  }
});
