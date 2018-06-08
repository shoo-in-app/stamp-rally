const initialState = {
  rallies: [],
  userID: null
};

const LOAD_RALLIES = "LOAD_RALLIES";
const SET_USER_ID = "SET_USER_ID";

const loadRallies = (rallies) => ({
  type: LOAD_RALLIES,
  rallies
});

const setUserID = (userID) => ({
  type: SET_USER_ID,
  userID
});

const reducer = (previousState = initialState, action) => {
  switch (action.type) {
    case LOAD_RALLIES:
      return { ...previousState, rallies: action.rallies };
    case SET_USER_ID:
      return { ...previousState, userID: action.userID };
    default:
      return previousState;
  }
};

export { reducer, loadRallies, setUserID };
