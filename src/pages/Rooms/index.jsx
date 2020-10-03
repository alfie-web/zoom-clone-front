import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { roomsActions } from '../../store/actions';
import { Button, RoomCard } from '../../components';

// import socket from '../../api/socket';

import './Rooms.sass';


const Rooms = ({ items, fetchRooms }) => {

	useEffect(() => {
		!items.length && fetchRooms();
	}, [items, fetchRooms])

	// useEffect(() => {
	// 	console.log('ХУЙ ЗНАЕТ НО ПЕРЗАПУСКАЕТСЯ')
	// 	socket.on('ROOM:USERS_INFO', data => {
	// 		console.log('Пользователей в комнате', data)
	// 		// setCurrentRoomUsers(data.users)
	// 	})

	// 	// return () => socket.emit("ROOM:LEAVE");
	// }, [])

	return (
		<main className="Page Rooms">
			<div className="container">
				<div className="box">
					<h1 className="title title--big">Конференции <sup className="title--count">{items.length}</sup></h1>

					<Button 
						text="Новая конференция"
						variant="violet"
					/>
				</div>

				<div className="Rooms__items">
					{
						items && items.map(item => (
							<RoomCard 
								key={item._id}
								_id={item._id}
								title={item.title}
								usersCount={item.users.length}
								date={item.date}
							/>
						))
					}
					
				</div>
			</div>
		</main>
	)
}

export default connect(
	({ rooms }) => ({ items: rooms.items }),
	{
		fetchRooms: roomsActions.fetchRooms
	}
)(Rooms);