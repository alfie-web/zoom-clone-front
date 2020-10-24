import { roomsAPI } from '../../api';

const roomsActions = {
	setRoomItems: items => ({
		type: 'ROOMS:SET_ITEMS',
		payload: items
	}),

	setIsFetching: isFetching => ({
		type: 'ROOMS:SET_IS_FETCHING',
		payload: isFetching
	}),

	setCurrentRoom: data => ({
		type: 'ROOMS:SET_CURRENT_ROOM',
		payload: data
	}),

	setCurrentRoomUsersAC: data => ({
		type: 'ROOMS:SET_CURRENT_ROOM_USERS',
		payload: data
	}),

	setNewUser: user => ({
		type: 'ROOMS:SET_NEW_USER',
		payload: user
	}),

	removeUser: user => ({
		type: 'ROOMS:REMOVE_USER',
		payload: user
	}),


	fetchRooms: () => async dispatch => {
		dispatch(roomsActions.setIsFetching(true));

		try {
			const { data } = await roomsAPI.getAll();

			if (data.status === 'success') {
				dispatch(roomsActions.setRoomItems(data.data));
			}

			dispatch(roomsActions.setIsFetching(false));

		} catch (e) {
			dispatch(roomsActions.setIsFetching(false));
		}
	},

	fetchCurrentRoom: roomId => async (dispatch, getState) => {
		const { users } = getState();
		console.log('curUser', users.curUser)
		dispatch(roomsActions.setIsFetching(true));

		try {
			const { data } = await roomsAPI.getById(roomId);

			if (data.status === 'success') {
				if (data.data.users.includes(users.curUser._id)) {
					console.log('Есть')
				} else {
					console.log('НЕТУ')
					window.location.href = '/'
				}

				dispatch(roomsActions.setCurrentRoom(data.data));
			}

			return dispatch(roomsActions.setIsFetching(false));

		} catch (e) {
			return dispatch(roomsActions.setIsFetching(false));
		}
	},

	setCurrentRoomUsers: (users) => dispatch => {
		dispatch(roomsActions.setCurrentRoomUsersAC(users));
	},

	addNewUserToRoom: (user) => dispatch => {
		dispatch(roomsActions.setNewUser(user));
	},

	removeUserFromRoom: (user) => dispatch => {
		dispatch(roomsActions.removeUser(user));
	}
}

export default roomsActions;