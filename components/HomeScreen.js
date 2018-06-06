import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

export default class HomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to Stamp Rally!</Text>
        <Button
          title="Show me the map!"
          onPress={() =>
            this.props.navigation.navigate("Details", {
              locations: [
                {
                  latlng: {
                    latitude: 37.78825,
                    longitude: -122.4324
                  },
                  title: "San Francisco!",
                  description: "A city in America.",
                  id: 0
                },
                {
                  latlng: {
                    latitude: 37.6,
                    longitude: -122.5
                  },
                  title: "San Francisco!",
                  description: "A city in America.",
                  id: 1
                }
              ]
            })
          }
        />
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
