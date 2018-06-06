import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

export default class HomeScreen extends React.Component {
  render() {
    const mockLocationData = [
      {
        id: 4,
        name: "Motoazabu Sanchoume",
        lat: 35.659,
        lng: 139.722,
        description: "nearest famima to cc",
        rally_id: 1,
        user_id: 2,
        location_id: 1,
        visited: false
      },
      {
        id: 5,
        name: "Motoazabu",
        lat: 35.6549,
        lng: 139.726,
        description: "second nearest famima to cc",
        rally_id: 1,
        user_id: 2,
        location_id: 2,
        visited: true
      },
      {
        id: 6,
        name: "Nishiazabu Sanchoume",
        lat: 35.6594,
        lng: 139.723,
        description: "third nearest famima to cc",
        rally_id: 1,
        user_id: 2,
        location_id: 3,
        visited: false
      }
    ];

    return (
      <View style={styles.container}>
        <Text>Welcome to Stamp Rally!</Text>
        <Button
          title="Show me the map!"
          onPress={() =>
            this.props.navigation.navigate("Details", {
              locations: mockLocationData
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
