import * as types from "./question.action";
export const INITIAL_STATE = { number: '' };

export default  devicetoken = (state = INITIAL_STATE, action)=> {

	switch (action.type) {		
		case types.SAVE_QUESTIONNUMBER:
			return {
				...state,
				number: action.payload.number,
			};
		default:
			return state;
	}
}