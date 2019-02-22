/* 
auth reducers 
author : abhishek kalia
 */

import * as types from "./auth.actions";
export const INITIAL_STATE = { token: null, errorStatus: '', is_visitProfile: false, profileimage:'' };

export default auth = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case types.AUTH_LOGIN_START:
			return {
				...state,
				loading: true,
				errorStatus: ''
			};
		case types.AUTH_LOGIN_SUCCESS:
			return {
				...state,
				loading: false,
				token: action.payload.token,
				email: action.payload.email,
				data: action.payload.data
			};
		case types.AUTH_LOGIN_FAIL:
			return {
				...state,
				loading: false,
				token: null,
				data: null,
				errorStatus: action.payload.message
			};
		case types.AUTH_LOGOUT:
			return {
				...state,
				token: null,
				data: null,
				email: null
			};
		case types.PROFILE_VISIT:
			return {
				...state,
				is_visitProfile: true
			};
		case types.PROFILE_PIC_SAVE:
			return {
				...state,
				profileimage: action.payload.profilepic
			};
		default:
			return state;
	}
}