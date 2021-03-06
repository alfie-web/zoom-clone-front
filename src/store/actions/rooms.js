import { roomsAPI } from '../../api';

let page = 0;

const roomsActions = {
	setRoomItems: items => ({
		type: 'ROOMS:SET_ITEMS',
		payload: items
	}),

	setIsLastPage: isLastPage => ({
		type: 'ROOMS:SET_IS_LAST_PAGE',
		payload: isLastPage
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

	fetchRooms: () => async (dispatch, getState) => {
		const { rooms } = getState();

		// if (isSearchChange) page = 0;
		if (rooms.isLastPage) return;

		dispatch(roomsActions.setIsFetching(true));

		try {
			const { data } = await roomsAPI.getAll(page);

			if (data.status === 'success') {
				dispatch(roomsActions.setRoomItems(data.data.items));

				page += 1;

				dispatch(roomsActions.setIsLastPage(data.data.isLastPage));
			}
			dispatch(roomsActions.setIsFetching(false));

		} catch (e) {
			console.log(e);
			dispatch(roomsActions.setIsLastPage(true));
			dispatch(roomsActions.setIsFetching(false));
		}
	},


	// fetchRooms: () => async dispatch => {
	// 	dispatch(roomsActions.setIsFetching(true));

	// 	try {
	// 		const { data } = await roomsAPI.getAll();

	// 		if (data.status === 'success') {
	// 			dispatch(roomsActions.setRoomItems(data.data.items));
	// 			dispatch(roomsActions.setIsLastPage(data.data.isLastPage));
	// 		}

	// 		dispatch(roomsActions.setIsFetching(false));

	// 	} catch (e) {
	// 		dispatch(roomsActions.setIsFetching(false));
	// 	}
	// },

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

	// setCurrentRoomUsers: (users) => dispatch => {
	// 	dispatch(roomsActions.setCurrentRoomUsersAC(users));
	// },

	// addNewUserToRoom: (user) => dispatch => {
	// 	dispatch(roomsActions.setNewUser(user));
	// },

	// removeUserFromRoom: (user) => dispatch => {
	// 	dispatch(roomsActions.removeUser(user));
	// }



	// TODO: Оповещать участников о том что их пригласили в конференцию (сокетами)
	createRoom: (formData) => async dispatch => {
		try {
			const { data } = roomsAPI.create(formData);

			if (data.status === 'success') {
				console.log(data.data)

				dispatch(roomsActions.fetchRooms());
			}

		} catch (e) {

		}
	}
}

export default roomsActions;