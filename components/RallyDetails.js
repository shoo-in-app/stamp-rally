import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

export default class RallyDetails extends React.Component {
  render() {
    if (this.props.selectedMarker) {
      return (
        <View>
          <Text>{this.props.selectedMarker.name}</Text>
          <Text>{this.props.selectedMarker.description}</Text>
        </View>
      );
    } else {
      return <Text>Select a location!</Text>;
    }
  }
}

const styles = StyleSheet.create({});
