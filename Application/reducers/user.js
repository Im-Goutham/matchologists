import {
  SAVE_USER
} from '../actions/types.js';

const INITIAL_STATE = {
  user: {},
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_USER:
      return { user: action.payload };
    default:
      return state;
  }
}
