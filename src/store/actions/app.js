import { usersActions } from './../actions';

const appActions = {
	setIsFetching: isFetching => ({
		type: 'APP:SET_IS_FETCHING',
		payload: isFetching
	}),

	setInitialized: () => ({
		type: 'APP:SET_INITIALIZED',
		payload: true
	}),

	initializeApp: () => dispatch => {
		dispatch(appActions.setIsFetching(true));

		const authPromise = dispatch(usersActions.getMe());

		Promise.all([authPromise])
			.then(() => {
				dispatch(appActions.setInitialized());
				dispatch(appActions.setIsFetching(false));
			})
			.catch(() => dispatch(appActions.setIsFetching(false)))
	}
}

export default appActions;