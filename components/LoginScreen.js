import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import Expo from "expo";

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
      iosClientId:
        "309418440628-t2gt9pl1cbtu4jr5crbb836fqj4nsa13.apps.googleusercontent.com",
      scopes: ["profile", "email"]
    })
      .then((result) => {
        if (result.type === "success") {
          this.props.setUserID(result.idToken);
          this.props.navigation.navigate("Home");
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
        <Text>{this.state.cancelled ? "Login failed" : "Please Login!"}</Text>
        <Button title="Login with Google" onPress={() => this.login()} />
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
