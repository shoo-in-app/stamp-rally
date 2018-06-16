const initialState = {
  chosenRallies: [],
  notChosenRallies: [],
  userID: null
};

const LOAD_CHOSEN_RALLIES = "LOAD_CHOSEN_RALLIES";
const LOAD_NOT_CHOSEN_RALLIES = "LOAD_NOT_CHOSEN_RALLIES";
const SET_USER_ID = "SET_USER_ID";
const CLEAR_CACHE_ON_LOGOUT = "CLEAR_CACHE_ON_LOGOUT";

const loadChosenRallies = (rallies) => ({
  type: LOAD_CHOSEN_RALLIES,
  rallies
});
const loadNotChosenRallies = (rallies) => ({
  type: LOAD_NOT_CHOSEN_RALLIES,
  rallies
});

const setUserID = (userID) => ({
  type: SET_USER_ID,
  userID
});

const clearCacheOnLogout = () => ({
  type: CLEAR_CACHE_ON_LOGOUT
});

const reducer = (previousState = initialState, action) => {
  switch (action.type) {
    case LOAD_CHOSEN_RALLIES:
      return { ...previousState, chosenRallies: action.rallies };
    case LOAD_NOT_CHOSEN_RALLIES:
      return { ...previousState, notChosenRallies: action.rallies };
    case SET_USER_ID:
      return { ...previousState, userID: action.userID };
    case CLEAR_CACHE_ON_LOGOUT:
      return initialState;
    default:
      return previousState;
  }
};

export {
  reducer,
  loadChosenRallies,
  loadNotChosenRallies,
  setUserID,
  clearCacheOnLogout
};
