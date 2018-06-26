import { connect } from "react-redux";
import DetailsScreen from "../components/DetailsScreen";
import { addUserExp } from "../reducer.js";

const mapStateToProps = (state) => {
  return {
    userID: state.userID
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addUserExp: (rewardPoints) => {
      const action = addUserExp(rewardPoints);
      dispatch(action);
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailsScreen);
