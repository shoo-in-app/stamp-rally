import React from "react";
import { StyleSheet, Text, View, Button, FlatList } from "react-native";
import { ListItem } from "react-native-elements";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
  }
  componentDidMount() {
    return fetch("https://cc4-flower-dev.herokuapp.com/rallies")
      .then((response) => response.json())
      .then((list) => this.setState({ list }));
  }
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
        <Text>Welcome to Stamp Rally!!!!</Text>
        <FlatList
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          data={this.state.list}
          renderItem={({ item }) => {
            return (
              <ListItem
                title={item.title}
                TitleStyle={{ color: "blue", width: "100%" }}
                button
                onPress={() =>
                  this.props.navigation.navigate("Details", {
                    locations: item.locations
                  })
                }
                subtitle={item.description}
              />
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  }
});
