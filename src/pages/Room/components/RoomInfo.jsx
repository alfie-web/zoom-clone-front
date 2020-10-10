import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';

import { roomsActions } from '../../../store/actions';

const RoomInfo = ({ roomId, fetchCurrentRoom }) => {
	const { currentRoom } = useSelector(state => state.rooms);
	
	useEffect(() => {
		!currentRoom && roomId && fetchCurrentRoom(roomId);
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