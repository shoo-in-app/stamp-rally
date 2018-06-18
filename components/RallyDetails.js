import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableHighlight,
  Image
} from "react-native";
import { Header } from "react-navigation";

import stampCollectedImgBig from "../assets/markers/stamp-collected-big.png";

import SlidingUpPanel from "rn-sliding-up-panel";

const { height, width } = Dimensions.get("window");

const MAX_PANEL = height - 120;
const MIN_PANEL = 185;

let slideDownTimeoutId;

export default class RallyDetails extends React.Component {
  constructor(props) {
    super(props);
    this._panel = null;
    this.state = {
      draggableRange: {
        top: MIN_PANEL,
        bottom: MIN_PANEL
      },
      bigStampStyle: {
        height: 0,
        width: 0
      },
      isStampPadEnabled: false
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

  componentWillUnmount() {
    clearTimeout(slideDownTimeoutId);
  }

  render() {
    return (
      <SlidingUpPanel
        visible
        showBackdrop={false}
        allowDragging={false}
        draggableRange={this.state.draggableRange}
        startCollapsed={true}
        ref={(panel) => (this._panel = panel)}
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
                        this._panel.transitionTo(MAX_PANEL);
                        this.setState({ isStampPadEnabled: true });
                      }}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.title}>Select a location!</Text>
              </View>
            )}
          </View>
          <View style={styles.panelBody}>
            {this.props.selectedLocation ? (
              <TouchableHighlight
                style={styles.stampPad}
                onPress={(event) => {
                  if (!this.state.isStampPadEnabled) return;
                  const SIZE = 200;
                  this.setState({
                    bigStampStyle: {
                      height: SIZE,
                      width: SIZE,
                      left: event.nativeEvent.locationX - SIZE / 2,
                      top: event.nativeEvent.locationY - SIZE / 2,
                      zIndex: -50
                    },
                    isStampPadEnabled: false
                  });
                  this.props.collectStamp(this.props.selectedLocation.id);
                  slideDownTimeoutId = setTimeout(() => {
                    this._panel.transitionTo(MIN_PANEL);
                    this.setState({
                      bigStampStyle: {
                        height: 0,
                        width: 0
                      }
                    });
                  }, 2000);
                }}
                underlayColor={"white"}
              >
                <Image
                  source={stampCollectedImgBig}
                  style={this.state.bigStampStyle}
                />
              </TouchableHighlight>
            ) : (
              <View />
            )}
          </View>
        </View>
      </SlidingUpPanel>
    );
  }
}

const styles = StyleSheet.create({
  panelBody: {
    height: height - Header.HEIGHT - 240,
    backgroundColor: "green",
    zIndex: 20
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  panelHeader: {
    height: 120,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200
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
  },
  stampPad: {
    flex: 1,
    width: width - 20,
    margin: 10,
    backgroundColor: "white",
    zIndex: -20
  },
  title: {
    fontSize: 20
  }
});

RallyDetails.propTypes = {
  isWithinRange: PropTypes.bool,
  selectedLocation: PropTypes.object,
  collectStamp: PropTypes.func
};
