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

		case 'ROOMS:SET_NEW_USER':
			return {
				...state,
				currentRoomUsers: [
					...state.currentRoomUsers,
					payload
				]
			}

		case 'ROOMS:REMOVE_USER':
			return {
				...state,
				currentRoomUsers: state.currentRoomUsers.filter(u => u.userId !== payload.userId)
			}

		case 'ROOMS:SET_ITEMS':
			return {
				...state,
				items: payload
			}

		case 'ROOMS:SET_IS_LAST_PAGE':
			return {
				...state,
				isLastPage: payload
			}

		default: return state;
	}
}

export default roomsReducer;