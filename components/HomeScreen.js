import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, FlatList } from "react-native";
import { ListItem } from "react-native-elements";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Stamp Rallies"
  };

  componentDidMount() {
    return fetch("https://cc4-flower-dev.herokuapp.com/rallies")
      .then((response) => response.json())
      .then((rallies) => {
        this.props.loadRallies(rallies);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          keyExtractor={(_, index) => {
            return index.toString();
          }}
          data={this.props.rallies}
          renderItem={({ item }) => {
            return (
              <ListItem
                title={item.title}
                button
                onPress={() =>
                  this.props.navigation.navigate("Details", {
                    title: item.title,
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

HomeScreen.propTypes = {
  loadRallies: PropTypes.func.isRequired,
  rallies: PropTypes.array.isRequired
};
