import { connect } from "react-redux";
import LoginScreen from "../components/LoginScreen";
import { setUserID } from "../reducer.js";

const mapStateToProps = (state) => {
  return {
    userID: state.userID
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserID: (userID) => {
      const action = setUserID(userID);
      dispatch(action);
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
