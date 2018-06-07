import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import Expo from "expo";
import { config } from "dotenv";
config();

async function signInWithGoogleAsync() {
  try {
    const result = await Expo.Google.logInAsync({
      androidClientId: process.env.ANDROID_CLIENT_ID,
      // iosClientId: YOUR_CLIENT_ID_HERE,
      scopes: ["profile", "email"]
    });

    if (result.type === "success") {
      return result.accessToken;
    } else {
      return { cancelled: true };
    }
  } catch (e) {
    return { error: true };
  }
}
function login() {
  console.log("Hello world!");
  signInWithGoogleAsync()
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
}

export default class LoginScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Login!</Text>
        <Button title="Login!" onPress={login} />
        <Button
          title="Go Home!"
          onPress={() => {
            console.log("move to home");
            return this.props.navigation.navigate("Home");
          }}
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
