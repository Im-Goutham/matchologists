export const SAVE_MYDEFAULTLANGUAGE = 'SAVE_MYDEFAULTLANGUAGE';

export const savelocal = (language) => {
	return {
		type: SAVE_MYDEFAULTLANGUAGE,
		payload: {
			language,
		}
	}
};
export const savelocallanguage = (language) => {
	return dispatch => {dispatch(savelocal(language));
	};
};