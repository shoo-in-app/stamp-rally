import React from "react";
import PropTypes from "prop-types";
import { Button, StyleSheet, Text, View, Dimensions } from "react-native";
import { Header } from "react-navigation";

import SlidingUpPanel from "rn-sliding-up-panel";

const { height } = Dimensions.get("window");

const MAX_PANEL = height - 120;
const MIN_PANEL = 185;

export default class RallyDetails extends React.Component {
  constructor(props) {
    super(props);
    this._panel = null;
    this.state = {
      draggableRange: {
        top: MIN_PANEL,
        bottom: MIN_PANEL
      }
    };
  }

  componentDidMount() {
    this.setState({
      draggableRange: {
        top: MAX_PANEL,
        bottom: MIN_PANEL
      }
    });
  }

  render() {
    return (
      <SlidingUpPanel
        visible
        showBackdrop={false}
        allowDragging={false}
        draggableRange={this.state.draggableRange}
        startCollapsed={true}
        ref={(c) => (this._panel = c)}
      >
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            {this.props.selectedLocation ? (
              <View style={styles.stampInfo}>
                <Text style={styles.title}>
                  {this.props.selectedLocation.name}
                </Text>
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
                        this.props.selectedLocation.visited
                          ? "COLLECTED"
                          : "COLLECT"
                      }
                      onPress={() => {
                        // this.props.collectStamp(this.props.selectedLocation.id)
                        this._panel.transitionTo(MAX_PANEL);
                      }}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <Text style={styles.placeholder}>Select a location!</Text>
            )}
          </View>
          <View style={styles.container}>
            <Text>Stamps!</Text>
          </View>
        </View>
      </SlidingUpPanel>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: height - Header.HEIGHT - 240,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center"
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
  },
  panelHeader: {
    height: 120,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center"
  },
  panel: {
    flex: 1,
    backgroundColor: "white",
    position: "relative"
  },
  stampInfo: {
    flex: 0,
    justifyContent: "flex-start",
    alignItems: "flex-start"
  }
});

RallyDetails.propTypes = {
  isWithinRange: PropTypes.bool,
  selectedLocation: PropTypes.object,
  collectStamp: PropTypes.func
};
