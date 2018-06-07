import React from "react";
import { createStackNavigator } from "react-navigation";
import { store } from "./reducer";

import HomeScreen from "./components/HomeScreen";
import DetailsScreen from "./components/DetailsScreen";
import LoginScreen from "./components/LoginScreen";

const RootStack = createStackNavigator(
  {
    Login: LoginScreen,
    Home: HomeScreen,
    Details: DetailsScreen
  },
  {
    initialRouteName: "Login"
  }
);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <RootStack />;
      </Provider>
    );
  }
}
