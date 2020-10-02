const initialState = {
	initialized: false,
	isFetching: false
}

const appReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case 'APP:SET_INITIALIZED':
			return {
				...state,
				initialized: payload
			}

		case 'APP:SET_IS_FETCHING':
			return {
				...state,
				isFetching: payload
			}

		default: return state;
	}
}

export default appReducer;