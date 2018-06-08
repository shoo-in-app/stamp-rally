import { connect } from "react-redux";
import HomeScreen from "../components/HomeScreen";
import { loadRallies, setUserID } from "../reducer.js";

const mapStateToProps = (state) => {
  return {
    rallies: state.rallies
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadRallies: (rallies) => {
      const action = loadRallies(rallies);
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
