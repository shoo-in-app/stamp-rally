import React from "react";
import PropTypes from "prop-types";
import { View, Text, Button, StyleSheet } from "react-native";

export default class LocationDetails extends React.Component {
  render() {
    return (
      <View style={styles.stampInfo}>
        <View style={styles.titleInfo}>
          <Text style={styles.title}>{this.props.selectedLocation.name}</Text>
          <Text style={styles.description}>
            {this.props.selectedLocation.description}
          </Text>
          <Text style={styles.description}>
            {this.props.distanceToStamp > 1000
              ? (this.props.distanceToStamp / 1000).toFixed(1) + " km "
              : this.props.distanceToStamp.toFixed(0) + " m "}
            away.
          </Text>
        </View>
        <View style={styles.inlineContainer}>
          <Button
            key={this.props.selectedLocation.id.toString()}
            disabled={
              this.props.selectedLocation.visited || !this.props.isWithinRange
            }
            color="#A61414"
            textStyle={{
              fontFamily: "edo"
            }}
            title={
              this.props.selectedLocation.visited ? "COLLECTED!" : "COLLECT"
            }
            onPress={this.props.maximiseStampPad}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inlineContainer: {
    flexDirection: "row"
  },
  description: {
    flex: 1,
    fontSize: 15,
    margin: 5
  },
  stampInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    margin: 5
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 5
  },
  titleInfo: {
    flex: 1,
    flexDirection: "column"
  }
});

LocationDetails.propTypes = {
  isWithinRange: PropTypes.bool.isRequired,
  selectedLocation: PropTypes.object.isRequired,
  distanceToStamp: PropTypes.number.isRequired,
  maximiseStampPad: PropTypes.func.isRequired
};
