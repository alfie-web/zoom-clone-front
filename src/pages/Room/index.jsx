import React, { useEffect, memo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, connect } from 'react-redux';

import socket from '../../api/socket';
import { roomsActions } from '../../store/actions';

const Room = memo(({ fetchCurrentRoom, setCurrentRoomUsers }) => {
	const { roomId } = useParams();
	const { curUser } = useSelector(state => state.users);
	const { currentRoom } = useSelector(state => state.rooms);

	console.log('ROOM RENDER')

	// useEffect(() => {
	// 	!currentRoom && roomId && fetchCurrentRoom(roomId);
	// }, [currentRoom, roomId, fetchCurrentRoom])

	useEffect(() => {
		// Входим в комнату roomId
		if (roomId) {
			// socket.emit("DIALOGS:LEAVE", curUser._id);
			// socket.emit("ROOM:LEAVE");
			socket.emit("ROOM:JOIN", { room: roomId, userId: curUser._id, fullname: curUser.fullname }, (data) => console.log(data))
		} else {
			// console.log(roomId)
			// socket.emit("DIALOGS:LEAVE", curUser._id);
			// socket.emit("ROOM:LEAVE");
		}


		// socket.on("ROOM:USERS_INFO", data => {
		// 	console.log('Пользователей в комнате', data)
		// })

		// return () => socket.emit("ROOM:LEAVE");
		// return () => socket.emit("disconnect");

		// setCurrentDialog(roomId, curUser._id);
	}, [roomId, curUser])

	useEffect(() => {
		socket.on('ROOM:USERS_INFO', data => {
			console.log('Пользователей в комнате', data)
			// setCurrentRoomUsers(data.users)
		})

		// return () => socket.emit("ROOM:LEAVE");
	}, [setCurrentRoomUsers])

	useEffect(() => {
		// return () => console.log('демотируемся')

		return () => {
			socket.emit("ROOM:LEAVE", curUser._id);
			socket.off('ROOM:USERS_INFO');		// ВАЖНО: отключаю обработчик (иначе каждый раз будет всё больше и больше)
		}
	}, [curUser])

	return (
		<main className="Page Room">
			<div className="container">
				<div className="box">
					<h1 className="title title--big">Название конференции</h1>
				</div>


			</div>
		</main>
	)
})

export default connect(
	null,
	{
		fetchCurrentRoom: roomsActions.fetchCurrentRoom,
		setCurrentRoomUsers: roomsActions.setCurrentRoomUsers,
	}
)(Room);