import React from "react";
import PropTypes from "prop-types";
import { Button, StyleSheet, Text, View } from "react-native";

export default class RallyDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.selectedLocation) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>{this.props.selectedLocation.name}</Text>
          <View style={styles.inlineContainer}>
            <View style={styles.col1}>
              <Text style={styles.description}>
                {this.props.selectedLocation.description}
              </Text>
            </View>
            <View style={styles.col2}>
              <Button
                key={this.props.selectedLocation.id.toString()}
                disabled={
                  this.props.selectedLocation.visited ||
                  !this.props.isWithinRange
                }
                style={styles.button}
                title={
                  this.props.selectedLocation.visited ? "COLLECTED" : "COLLECT"
                }
                onPress={() =>
                  this.props.collectStamp(this.props.selectedLocation.id)
                }
              />
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
    alignItems: "flex-start"
  },
  inlineContainer: {
    flexDirection: "row"
  },
  col1: {
    flex: 0.6
  },
  col2: {
    flex: 0.4
  },
  description: {
    fontSize: 15
  },
  placeholder: {
    flex: 0,
    height: 100,
    fontSize: 20,
    textAlign: "center"
  }
});

RallyDetails.propTypes = {
  isWithinRange: PropTypes.bool,
  selectedLocation: PropTypes.object,
  collectStamp: PropTypes.func
};
