export const patternkeyReducer = (state = {}, action) => {
    switch (action.type) {
  
    case "PATTERN_KEY":
      return {
        ...state,
        patternkey: action.patternkey
      };
      case "ON_ERROR":
      return {
        ...state,
        error: action.error
      };
      case "ON_REGISTERED":
      return {
        ...state,
        isRegistered: action.isRegistered
      };
  
    default:
      return state;
    }
  
  };
  
  export default patternkeyReducer;
  