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
        <View style={styles.buttonContainer}>
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
  buttonContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center"
  },
  description: {
    fontSize: 15,
    margin: 5
  },
  stampDescription: {
    justifyContent: "space-around"
  },
  stampDetails: {
    justifyContent: "flex-start"
  },
  stampInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 5
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 5
  },
  titleInfo: {
    flexDirection: "column",
    justifyContent: "space-around"
  }
});

LocationDetails.propTypes = {
  isWithinRange: PropTypes.bool.isRequired,
  selectedLocation: PropTypes.object.isRequired,
  distanceToStamp: PropTypes.number.isRequired,
  maximiseStampPad: PropTypes.func.isRequired
};
