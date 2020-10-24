import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { usersAPI } from '../../../api';

import { roomsActions } from '../../../store/actions';

const RoomInfo = ({ roomId, fetchCurrentRoom }) => {
	const { currentRoom } = useSelector(state => state.rooms);
	// const { curUser } = useSelector(state => state.users);

	useEffect(() => {
		!currentRoom && roomId && fetchCurrentRoom(roomId)
			// .then(() => {
			// 	if (currentRoom.users.find(curUser._id)) {
			// 		console.log('finded')
			// 	} else {
			// 		console.log('not finded')
			// 	}
			// })
	}, [currentRoom, roomId, fetchCurrentRoom])

	return (
		<div className="Room__info">
			<div className="box">
				{currentRoom && <h1 className="title title--big">{currentRoom.title}</h1> }
			</div>
		</div>
	)
}

export default connect(
	null,
	{
		fetchCurrentRoom: roomsActions.fetchCurrentRoom,
	}
)(RoomInfo);