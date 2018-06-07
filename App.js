import React from "react";
import { createStackNavigator } from "react-navigation";
import { createStore } from "redux";
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
const store = createStore(persistedReducer);
const persistor = persistStore(store);

import HomeScreen from "./containers/HomeScreen";
import DetailsScreen from "./components/DetailsScreen";
import LoginScreen from "./containers/LoginScreen";

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
        <PersistGate loading={null} persistor={persistor}>
          <RootStack />
        </PersistGate>
      </Provider>
    );
  }
}
