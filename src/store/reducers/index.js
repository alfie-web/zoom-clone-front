import { combineReducers } from 'redux';
import appReducer from './app';
import usersReducer from './users';

const rootReducer = combineReducers({
	app: appReducer,
	users: usersReducer,
});

export default rootReducer;