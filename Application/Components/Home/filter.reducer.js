import * as types from "./filter.actions";
export const INITIAL_STATE = { filters: {}};

export default  devicetoken = (state = INITIAL_STATE, action)=> {
	switch (action.type) {		
		case types.SAVE_DEFAULT_FILTER:
			return {
				...state,
				filters: action.payload.filters
			};
		default:
			return state;
	}
}