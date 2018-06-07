import { createStore } from "redux";

const initialState = {
  rallies: [],
  selectedRally: null,
  userID: ""
};

const LOAD_RALLIES = "LOAD_RALLIES";
const SET_USER_ID = "SET_USER_ID";
const SELECT_RALLY = "SELECT_RALLY";

const loadRallies = (rallies) => ({
  type: LOAD_RALLIES,
  rallies
});

const setUserID = (userID) => ({
  type: SET_USER_ID,
  userID
});

const selectRally = (selectedRally) => ({
  type: SELECT_RALLY,
  selectedRally
});

const reducer = (previousState = initialState, action) => {
  switch (action.type) {
    case LOAD_RALLIES:
      return { ...previousState, rallies: action.rallies };
    case SET_USER_ID:
      return { ...previousState, userID: action.userID };
    case SELECT_RALLY:
      return { ...previousState, selectedRally: action.selectedRally };
    default:
      return previousState;
  }
};

const store = createStore(reducer);

export { store, reducer, loadRallies, setUserID, selectRally };
