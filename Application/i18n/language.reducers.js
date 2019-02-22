import * as types from "./language.action";
export const INITIAL_STATE = { defaultlanguage: 'en', islanguageChange: false};

export default  devicetoken = (state = INITIAL_STATE, action)=> {
	switch (action.type) {		
		case types.SAVE_MYDEFAULTLANGUAGE:
			return {
				...state,
				defaultlanguage: action.payload.language,
				islanguageChange: true
			};
		default:
			return state;
	}
}