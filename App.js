import React from "react";
import { View } from "react-native";
import { createStackNavigator } from "react-navigation";
import { Font } from "expo";

import edo from "./assets/fonts/edo.ttf";

import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { reducer } from "./reducer";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage
};
const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer, composeWithDevTools());
const persistor = persistStore(store);

import HomeScreen from "./containers/HomeScreen";
import DetailsScreen from "./containers/DetailsScreen";
import LoginScreen from "./containers/LoginScreen";

const RootStack = createStackNavigator(
  {
    Login: LoginScreen,
    Home: HomeScreen,
    Details: DetailsScreen
  },
  {
    initialRouteName: "Login",
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#A61414"
      },
      headerTintColor: "white",
      headerTitleStyle: {
        fontFamily: "edo",
        fontSize: 22
      }
    }
  }
);

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      edo
    });
    this.setState({ fontLoaded: true });
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {this.state.fontLoaded ? <RootStack /> : <View />}
        </PersistGate>
      </Provider>
    );
  }
}
