export const SAVE_DEVICETOKEN = 'SAVE_DEVICETOKEN';

export const savetoken = (deviceToken) => {
	return {
		type: SAVE_DEVICETOKEN,
		payload: {
			deviceToken,
		}
	}
};
export const saveDeviceToken = (token) => {
	return dispatch => {dispatch(loginStart());
		return dispatch(savetoken(token));
	};
};