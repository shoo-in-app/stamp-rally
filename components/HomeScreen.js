import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import Lists from "./Lists";

export default class HomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to Stamp Rally!!!!</Text>
        <Button
          title="Open details!"
          onPress={() => this.props.navigation.navigate("Details")}
        />
        <Lists />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
