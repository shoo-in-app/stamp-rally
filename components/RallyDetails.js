import React from "react";
import PropTypes from "prop-types";
import { Button, StyleSheet, Text, View } from "react-native";

export default class RallyDetails extends React.Component {
  render() {
    if (this.props.selectedMarker) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>{this.props.selectedMarker.name}</Text>
          <View style={styles.inlineContainer}>
            <View style={styles.col1}>
              <Text style={styles.description}>
                {this.props.selectedMarker.description}
              </Text>
            </View>
            <View style={styles.col2}>
              <Button style={styles.button} title="Collect" />
            </View>
          </View>
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
    alignItems: "flex-start",
  },
  inlineContainer: {
    flexDirection: 'row'
  },
  col1: {
    flex: 0.6,
  },
  col2: {
    flex: 0.4,
  },
  description: {
    fontSize: 15,
  }
});

RallyDetails.propTypes = {
  selectedMarker: PropTypes.object
};
