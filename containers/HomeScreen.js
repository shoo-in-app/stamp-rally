import { connect } from "react-redux";
import HomeScreen from "../components/HomeScreen";
import {
  loadChosenRallies,
  loadNotChosenRallies,
  setUserID
} from "../reducer.js";

const mapStateToProps = (state) => {
  return {
    chosenRallies: state.chosenRallies,
    notChosenRallies: state.notChosenRallies,
    userID: state.userID
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadChosenRallies: (rallies) => {
      const action = loadChosenRallies(rallies);
      dispatch(action);
    },
    loadNotChosenRallies: (rallies) => {
      const action = loadNotChosenRallies(rallies);
      dispatch(action);
    },
    setUserID: (userID) => {
      const action = setUserID(userID);
      dispatch(action);
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
