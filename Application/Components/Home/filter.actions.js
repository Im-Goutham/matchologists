export const SAVE_DEFAULT_FILTER = 'SAVE_DEFAULT_FILTER';

export const savelocal_Filters = (filters) => {
	return {
		type: SAVE_DEFAULT_FILTER,
		payload: {
			filters
		}
	}
};
export const saveCurrentFilter = (filters) => {
	return dispatch => {dispatch(savelocal_Filters(filters));
	};
};