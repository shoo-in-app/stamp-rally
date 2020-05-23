import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  RefreshControl,
  SectionList,
  Alert,
  Platform,
  Text,
  View,
} from "react-native";
import { ListItem } from "react-native-elements";
import { Location, Permissions, MapView } from "expo";

import moment from "moment";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      userLocation: null,
      isLocationPermissionGranted: true,
      isReady: false,
    };

    this.reloadData = this.reloadData.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    const logoutButton = (
      <Button
        title="Logout"
        titleStyle={{ color: Platform.OS === "ios" ? "#fff" : "#D41919" }}
        onPress={() => {
          params.navigate("Login");
          params.clearCacheOnLogout();
        }}
      />
    );
    return {
      title: "Stamp Rallies",
      headerLeft: null,
      headerRight: logoutButton,
    };
  };

  async componentDidMount() {
    await this._getLocationAsync();
    this.reloadData();
  }

  reloadData() {
    this.props.navigation.setParams({
      clearCacheOnLogout: this.props.clearCacheOnLogout,
      navigate: this.props.navigation.navigate.bind(this),
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
            expiryTime: data.item.end_datetime,
            rewardPoints: data.item.reward_points,
            reloadData: this.reloadData,
            userLocation: this.state.userLocation,
            isLocationPermissionGranted: this.state.isLocationPermissionGranted,
          })
        }
        subtitle={data.item.description}
        badge={{
          value: `${progress}/${total}`,
          containerStyle: {
            marginTop: 0,
            backgroundColor,
          },
        }}
        containerStyle={{ backgroundColor: "white" }}
      />
    );
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({ isLocationPermissionGranted: false, isReady: true });
      return;
    }

    await Location.watchPositionAsync(
      {
        enableHighAccuracy: true,
        distanceInterval: 1,
        timeInterval: 200,
      },
      (location) => {
        const userLocation = (
          <MapView.Marker
            key={"userLocation"}
            identifier={location.identifier}
            coordinate={location.coords}
            title="Your location"
            description="This is your current location"
            pinColor="blue"
          />
        );
        this.setState({ userLocation });
      }
    );

    this.setState({ isReady: true });
  };

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

  distanceToUser(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d * 1000; // Distance in m
  }

  render() {
    return this.state.isReady ? (
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <Text
          style={{
            backgroundColor: "#A61414",
            color: "white",
            textAlign: "center",
            fontSize: 16,
            padding: 5,
          }}
        >
          You have {this.props.userExp} points!
        </Text>
        <SectionList
          renderSectionHeader={({ section: { title, data } }) => {
            if (data.length > 0) {
              return (
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    color: "#fff",
                    backgroundColor: "#A61414",
                    paddingLeft: 10,
                    paddingTop: 5,
                    paddingBottom: 5,
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
              data: this.props.chosenRallies
                .filter((rally) => !rally.complete)
                .filter((rally) => moment(rally.end_datetime).isAfter())
                .sort((a, b) => {
                  if (a.end_datetime < b.end_datetime) return -1;
                  if (a.end_datetime > b.end_datetime) return 1;
                  else return 0;
                }),
            },
            {
              title: "Available Rallies",
              data: this.props.notChosenRallies
                .filter((rally) => moment(rally.end_datetime).isAfter())
                .sort((a, b) => {
                  if (!this.state.userLocation) return 0;
                  if (
                    this.distanceToUser(
                      a.lat,
                      a.lng,
                      this.state.userLocation.props.coordinate.latitude,
                      this.state.userLocation.props.coordinate.longitude
                    ) <
                    this.distanceToUser(
                      b.lat,
                      b.lng,
                      this.state.userLocation.props.coordinate.latitude,
                      this.state.userLocation.props.coordinate.longitude
                    )
                  )
                    return -1;
                  else return 1;
                }),
            },
            {
              title: "Completed Rallies",
              data: this.props.chosenRallies.filter((rally) => rally.complete),
            },
            {
              title: "Expired Rallies",
              data: this.props.chosenRallies.filter(
                (rally) =>
                  moment(rally.end_datetime).isBefore() && !rally.complete
              ),
            },
          ]}
          style={{ backgroundColor: "white" }}
        />
      </View>
    ) : (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "grey", fontSize: 20 }}>Updating Rallies...</Text>
      </View>
    );
  }
}

HomeScreen.propTypes = {
  userID: PropTypes.string.isRequired,
  userExp: PropTypes.number.isRequired,
  setUserID: PropTypes.func.isRequired,
  loadChosenRallies: PropTypes.func.isRequired,
  loadNotChosenRallies: PropTypes.func.isRequired,
  chosenRallies: PropTypes.array.isRequired,
  notChosenRallies: PropTypes.array.isRequired,
  clearCacheOnLogout: PropTypes.func.isRequired,
};
