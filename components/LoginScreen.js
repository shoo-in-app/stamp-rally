import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, Button, Alert, Image } from "react-native";
import Expo from "expo";
import axios from "axios";

import logo from "../assets/icon.png";

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { cancelled: false };
  }

  componentDidMount() {
    if (this.props.userID) {
      this.props.navigation.navigate("Home");
    }
  }

  login() {
    Expo.Google.logInAsync({
      androidClientId:
        "309418440628-lchfubsqb1q49q9h4ghqrjia4tlrfenj.apps.googleusercontent.com",
      androidStandaloneAppClientId:
        "309418440628-l8icujmhl4sl3nigbr47tkmvqng5gavf.apps.googleusercontent.com",
      iosClientId:
        "309418440628-t2gt9pl1cbtu4jr5crbb836fqj4nsa13.apps.googleusercontent.com",
      iosStandaloneAppClientId:
        "309418440628-ugqaajesnefhkjt4h6e5o308144jecgc.apps.googleusercontent.com",
      scopes: ["profile", "email"]
    })
      .then((result) => {
        if (result.type === "success") {
          const body = {
            email: result.user.email
          };
          axios
            .post("https://cc4-flower.herokuapp.com/mobile-api/user", body)
            .then((res) => {
              this.props.setUserID(res.data.userId);
              this.props.navigation.navigate("Home");
            })
            .catch(() => {
              Alert.alert(
                "Connection error",
                "There seems to be a problem with the connection to our server. Please try again later.",
                [{ text: "OK", onPress: () => {} }]
              );
              this.setState({ cancelled: true });
            });
        } else {
          this.setState({ cancelled: true });
        }
      })
      .catch(() => {
        this.setState({ cancelled: true });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />
        <Text>{this.state.cancelled ? "Login failed." : ""}</Text>
        <Button
          title="Login with Google"
          color="#A61414"
          onPress={() => this.login()}
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
  },
  logo: {
    height: 200,
    width: 200,
    margin: 20
  }
});

LoginScreen.propTypes = {
  userID: PropTypes.string,
  setUserID: PropTypes.func.isRequired
};
