import React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  ListView,
  FlatList,
  Button,
  RefreshControl,
  SectionList
} from "react-native";
import { Text, ListItem } from "react-native-elements";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

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
    fetch(`https://cc4-flower-dev.herokuapp.com/rallies/${this.props.userID}`)
      .then((response) => response.json())
      .then((data) => {
        this.props.loadChosenRallies(data.chosen);
        this.props.loadNotChosenRallies(data.notChosen);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getRallies(rallies) {
    if (rallies.length === 0) {
      return <Text>You have no rallies.</Text>;
    } else {
      // return (
      //   <FlatList
      //     keyExtractor={(_, index) => {
      //       return index.toString();
      //     }}
      //     data={rallies}
      //     renderItem={({ item }) => {
      //       const total = item.locations.length;
      //       const progress = item.locations.filter((l) => l.visited).length;
      //       return (
      //         <ListItem
      //           title={item.title}
      //           button
      //           onPress={() =>
      //             this.props.navigation.navigate("Details", {
      //               rallyID: item.id,
      //               title: item.title,
      //               locations: item.locations
      //             })
      //           }
      //           subtitle={item.description}
      //           badge={{
      //             value: `${progress}/${total}`,
      //             containerStyle: {
      //               marginTop: 0,
      //               backgroundColor: total === progress ? "dodgerblue" : "gray"
      //             }
      //           }}
      //         />
      //       );
      //     }}
      //   />
      // );

      return rallies.map((item) => {
        const total = item.locations.length;
        const progress = item.locations.filter((l) => l.visited).length;
        return (
          <ListItem
            key={item.id}
            title={item.title}
            button
            onPress={() =>
              this.props.navigation.navigate("Details", {
                rallyID: item.id,
                title: item.title,
                locations: item.locations
              })
            }
            subtitle={item.description}
            badge={{
              value: `${progress}/${total}`,
              containerStyle: {
                marginTop: 0,
                backgroundColor: total === progress ? "dodgerblue" : "gray"
              }
            }}
          />
        );
      });
    }
  }

  getRally(data) {
    const total = data.item.locations.length;
    const progress = data.item.locations.filter((location) => location.visited)
      .length;
    return (
      <ListItem
        key={data.item.id}
        title={data.item.title}
        button
        onPress={() =>
          this.props.navigation.navigate("Details", {
            rallyID: data.item.id,
            title: data.item.title,
            locations: data.item.locations
          })
        }
        subtitle={data.item.description}
        badge={{
          value: `${progress}/${total}`,
          containerStyle: {
            marginTop: 0,
            backgroundColor: total === progress ? "dodgerblue" : "gray"
          }
        }}
      />
    );
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    fetch(`https://cc4-flower-dev.herokuapp.com/rallies/${this.props.userID}`)
      .then((response) => response.json())
      .then((data) => {
        this.props.loadChosenRallies(data.chosen);
        this.props.loadNotChosenRallies(data.notChosen);
      })
      .then(() => {
        this.setState({ refreshing: false });
      });
  }

  render() {
    return (
      // <ListView
      //   refreshControl={
      //     <RefreshControl
      //       refreshing={this.state.refreshing}
      //       onRefresh={this._onRefresh.bind(this)}
      //     />
      //   }
      //   style={styles.container}
      // >
      //   <Text h3>Your Rallies</Text>
      //   {this.getRallies(this.props.chosenRallies)}
      //   <Text h3>Find Other Rallies</Text>
      //   {this.getRallies(this.props.notChosenRallies)}
      // </ListView>
      <SectionList
        renderSectionHeader={({ section: { title } }) => (
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              backgroundColor: "white"
            }}
          >
            {title}
          </Text>
        )}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        // keyExtractor={(item) => item.id}
        renderItem={(data) => this.getRally(data)}
        sections={[
          {
            title: "Your Rallies",
            data: this.props.chosenRallies
          },
          {
            title: "Find Other Rallies",
            data: this.props.notChosenRallies
          }
        ]}
      />
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
  userID: PropTypes.string.isRequired,
  setUserID: PropTypes.func.isRequired,
  loadChosenRallies: PropTypes.func.isRequired,
  loadNotChosenRallies: PropTypes.func.isRequired,
  chosenRallies: PropTypes.array.isRequired,
  notChosenRallies: PropTypes.array.isRequired
};
