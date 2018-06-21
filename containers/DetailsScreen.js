import { connect } from "react-redux";
import DetailsScreen from "../components/DetailsScreen";

const mapStateToProps = (state) => {
  return {
    userID: state.userID
  };
};

export default connect(
  mapStateToProps,
  null
)(DetailsScreen);
