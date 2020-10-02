const initialState = {
	curUser: null,
	isAuth: false
}

const usersReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case 'AUTH:SET_IS_AUTH':
			return {
				...state,
				isAuth: payload
			}
		case 'AUTH:SET_ME':
			return {
				...state,
				curUser: payload
			}
		default: return state;
	}
}

export default usersReducer;