import { combineReducers } from 'redux';
import appReducer from './app';
import usersReducer from './users';
import roomsReducer from './rooms';

const rootReducer = combineReducers({
	app: appReducer,
	users: usersReducer,
	rooms: roomsReducer,
});

export default rootReducer;