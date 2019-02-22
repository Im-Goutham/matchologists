export const SAVE_QUESTIONNUMBER = 'SAVE_QUESTIONNUMBER';

const saveNumber = (number) => {
	return {
		type: SAVE_QUESTIONNUMBER,
		payload: {
			number,
		}
	}
};
export const savegivenanswerNumber = (number) => {
	return dispatch => {dispatch(saveNumber(number));
	};
};