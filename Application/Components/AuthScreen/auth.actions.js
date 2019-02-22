/* 
auth actions 
author : abhishek kalia
 */
export const AUTH_LOGIN_START = 'AUTH_LOGIN_START';
export const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
export const AUTH_LOGIN_FAIL = 'AUTH_LOGIN_FAIL';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const PROFILE_VISIT = 'PROFILE_VISIT';
export const PROFILE_PIC_SAVE = 'PROFILE_PIC_SAVE';

export const login = (email, password, token, data) => {
	return dispatch => {dispatch(loginStart());

		return dispatch(loginSuccess(email, password, token, data));

		// setTimeout(() => {
		// 	if (email.length && password.length) {
		// 		return dispatch(loginSuccess(email, password, token, data));
		// 	}
		// 	return dispatch(loginFail(new Error('email and password fields are required')));
		// }, Math.random() * 1000 + 500)
	};
};
const loginStart = () => {
	return {
		type: AUTH_LOGIN_START
	}
};
export const loginSuccess = (email, password, token, data) => {
	return {
		type: AUTH_LOGIN_SUCCESS,
		payload: {
			token,
			email,
			password,
			data
		}
	}
};
const loginFail = error => {
	return {
		type: AUTH_LOGIN_FAIL,
		payload: error,
		error: true
	}
};
export const logout = () => {
	return dispatch => {
		dispatch({
			type: AUTH_LOGOUT
		});
	};
};

export const visitprofile = () => {
	return dispatch => {
		dispatch({
			type: PROFILE_VISIT
		});
	};
};
export const saveprofileimage = (profilepic) => {
	return {
		type: PROFILE_PIC_SAVE,
		payload: {
			profilepic
		}
	}
};

export const savelocalimage = (profilepic) => {
	return dispatch => {return dispatch(saveprofileimage(profilepic))};
};