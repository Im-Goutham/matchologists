import * as types from "./deviceTokenAction";
export const INITIAL_STATE = { deviceToken: null };

export default  devicetoken = (state = INITIAL_STATE, action)=> {
	switch (action.type) {		
		case types.SAVE_DEVICETOKEN:
			return {
				...state,
				deviceToken: action.payload.deviceToken,
			};
		default:
			return state;
	}
}