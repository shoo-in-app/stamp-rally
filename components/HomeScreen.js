import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, FlatList, Button } from "react-native";
import { ListItem } from "react-native-elements";

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    const logoutButton = (
      <Button
        title="Logout"
        onPress={() => {
          params.setUserID(null);
          params.navigate("Login");
        }}
      />
    );
    return {
      title: "Stamp Rallies",
      headerLeft: null,
      headerRight: logoutButton
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      setUserID: this.props.setUserID,
      navigate: this.props.navigation.navigate.bind(this)
    });
    const mockID =
      "3qYFuJsxZSUupuCLQmxwjUDV5TSbhzB7kwNr2mpB2YNuMW3CPSGe8CK3hPcZDErDVu5eM83EcT6DmugqmpRFD5tQCped6geXgXYUfZwfQKmUcZ8qtPnQ7ssppVvQaHKX";
    fetch(`https://cc4-flower-dev.herokuapp.com/rallies/${mockID}`)
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
  setUserID: PropTypes.func.isRequired,
  loadRallies: PropTypes.func.isRequired,
  rallies: PropTypes.array.isRequired
};
