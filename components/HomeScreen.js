import React from "react";
import PropTypes from "prop-types";
import { Button, RefreshControl, SectionList, Alert } from "react-native";
import { Text, ListItem } from "react-native-elements";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };

    this.reloadData = this.reloadData.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    const logoutButton = (
      <Button
        title="Logout"
        onPress={() => {
          params.navigate("Login");
          params.clearCacheOnLogout();
        }}
        color="#fff"
      />
    );
    return {
      title: "Stamp Rallies",
      headerLeft: null,
      headerRight: logoutButton
    };
  };

  componentDidMount() {
    this.reloadData();
  }

  reloadData() {
    this.props.navigation.setParams({
      clearCacheOnLogout: this.props.clearCacheOnLogout,
      navigate: this.props.navigation.navigate.bind(this)
    });
    fetch(
      `https://cc4-flower.herokuapp.com/mobile-api/rallies/${this.props.userID}`
    )
      .then((response) => response.json())
      .then((data) => {
        this.props.loadChosenRallies(data.chosen);
        this.props.loadNotChosenRallies(data.notChosen);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getRally(data) {
    const total = data.item.locations.length;
    const progress = data.item.locations.filter((location) => location.visited)
      .length;
    let backgroundColor;
    if (total === progress) {
      backgroundColor = "dodgerblue";
    } else if (progress > 0) {
      backgroundColor = "green";
    } else {
      backgroundColor = "gray";
    }
    return (
      <ListItem
        key={data.item.id}
        title={data.item.title}
        button
        onPress={() =>
          this.props.navigation.navigate("Details", {
            rallyID: data.item.id,
            title: data.item.title,
            locations: data.item.locations,
            reloadData: this.reloadData
          })
        }
        subtitle={data.item.description}
        badge={{
          value: `${progress}/${total}`,
          containerStyle: {
            marginTop: 0,
            backgroundColor
          }
        }}
        containerStyle={{ backgroundColor: "white" }}
      />
    );
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    fetch(
      `https://cc4-flower.herokuapp.com/mobile-api/rallies/${this.props.userID}`
    )
      .then((response) => response.json())
      .then((data) => {
        this.props.loadChosenRallies(data.chosen);
        this.props.loadNotChosenRallies(data.notChosen);
      })
      .then(() => {
        this.setState({ refreshing: false });
      })
      .catch(() => {
        Alert.alert(
          "Connection error",
          "There is a problem with the internet connection. Please try again later.",
          [{ text: "OK", onPress: () => {} }]
        );
        this.setState({ refreshing: false });
      });
  }

  render() {
    return (
      <SectionList
        renderSectionHeader={({ section: { title, data } }) => {
          if (data.length > 0) {
            return (
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                  color: "#fff",
                  backgroundColor: "#A61414"
                }}
              >
                {title}
              </Text>
            );
          } else {
            return <Text style={{ height: 0 }} />;
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        keyExtractor={(item) => item.id}
        renderItem={(data) => this.getRally(data)}
        sections={[
          {
            title: "Your Rallies",
            data: this.props.chosenRallies.filter((rally) => !rally.completed)
          },
          {
            title: "Available Rallies",
            data: this.props.notChosenRallies
          },
          {
            title: "Completed Rallies",
            data: this.props.chosenRallies.filter((rally) => rally.completed)
          }
        ]}
        style={{ backgroundColor: "white" }}
      />
    );
  }
}

HomeScreen.propTypes = {
  userID: PropTypes.string.isRequired,
  setUserID: PropTypes.func.isRequired,
  loadChosenRallies: PropTypes.func.isRequired,
  loadNotChosenRallies: PropTypes.func.isRequired,
  chosenRallies: PropTypes.array.isRequired,
  notChosenRallies: PropTypes.array.isRequired,
  clearCacheOnLogout: PropTypes.func.isRequired
};
