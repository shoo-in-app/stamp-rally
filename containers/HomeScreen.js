import { connect } from "react-redux";
import HomeScreen from "../components/HomeScreen";
import { loadRallies } from "../reducer.js";

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
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
