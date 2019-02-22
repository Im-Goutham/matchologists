import { combineReducers } from "redux";
import auth from "./Components/AuthScreen/auth.reducer";
import storage from "./storage/storage.reducer";
import language from './i18n/language.reducers';
import question from './Components/Questionnaire/question.reducers.js';
import filter from './Components/Home/filter.reducer.js';

const rootReducer = combineReducers({
	auth,
	language,
	question,
	filter,
	storage
});

export default rootReducer;