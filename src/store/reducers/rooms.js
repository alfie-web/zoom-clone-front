const initialState = {
	items: [],
	currentRoom: null,
	currentRoomUsers: [],
	isFetching: false,
	isLastPage: false
}

const roomsReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case 'ROOMS:SET_IS_FETCHING':
			return {
				...state,
				isFetching: payload
			}

		case 'ROOMS:SET_CURRENT_ROOM':
			return {
				...state,
				currentRoom: payload
			}

		case 'ROOMS:SET_CURRENT_ROOM_USERS':
			return {
				...state,
				currentRoomUsers: payload
			}

		case 'ROOMS:SET_ITEMS':
			return {
				...state,
				items: payload
			}

		default: return state;
	}
}

export default roomsReducer;