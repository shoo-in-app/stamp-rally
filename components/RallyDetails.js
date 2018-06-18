import React from "react";
import PropTypes from "prop-types";
import { Button, StyleSheet, Text, View, Dimensions } from "react-native";

import SlidingUpPanel from "rn-sliding-up-panel";

const { height } = Dimensions.get("window");

export default class RallyDetails extends React.Component {
  constructor(props) {
    super(props);
    this._panel = null;
    this.state = {
      draggableRange: {
        top: 185,
        bottom: 185
      }
    };
  }

  componentDidMount() {
    this.setState({
      draggableRange: {
        top: height - 120,
        bottom: 185
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
            <Text>Bottom Sheet Peek!</Text>
          </View>
          <View style={styles.container}>
            <Text>Bottom Sheet Content!</Text>
          </View>
        </View>
      </SlidingUpPanel>
    );
  }

  // render() {
  //   if (this.props.selectedLocation) {
  //     return (
  // <View style={styles.container}>
  //   <Text style={styles.title}>{this.props.selectedLocation.name}</Text>
  //   <View style={styles.inlineContainer}>
  //     <View style={styles.col1}>
  //       <Text style={styles.description}>
  //         {this.props.selectedLocation.description}
  //       </Text>
  //     </View>
  //     <View style={styles.col2}>
  //       <Button
  //         key={this.props.selectedLocation.id.toString()}
  //         disabled={
  //           this.props.selectedLocation.visited ||
  //           !this.props.isWithinRange
  //         }
  //         style={styles.button}
  //         title={
  //           this.props.selectedLocation.visited ? "COLLECTED" : "COLLECT"
  //         }
  //         onPress={() =>
  //           this.props.collectStamp(this.props.selectedLocation.id)
  //         }
  //       />
  //     </View>
  //   </View>
  // </View>
  //     );
  //   } else {
  //     return <Text style={styles.placeholder}>Select a location!</Text>;
  //   }
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center"
  },
  panel: {
    flex: 1,
    backgroundColor: "white",
    position: "relative"
  }
});

RallyDetails.propTypes = {
  isWithinRange: PropTypes.bool,
  selectedLocation: PropTypes.object,
  collectStamp: PropTypes.func
};
