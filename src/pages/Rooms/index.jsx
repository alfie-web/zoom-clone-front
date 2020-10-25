import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { roomsActions } from '../../store/actions';
import { Button, RoomCard } from '../../components';



import './Rooms.sass';


const Rooms = ({ items, fetchRooms, isLastPage }) => {

	useEffect(() => {
		!items.length && !isLastPage && fetchRooms();
	}, [items, fetchRooms, isLastPage])


	return (
		<main className="Page Rooms">
			<div className="container">
				<div className="box">
					<h1 className="title title--big">Конференции <sup className="title--count">{items.length}</sup></h1>
					
					<Button 
						// text={!isFullscreen ? "Новая конференция" : 'fff'}
						text="Новая конференция"
						variant="violet"
						// onClick={handleFullscreen}
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
	({ rooms }) => ({ items: rooms.items, isLastPage: rooms.isLastPage }),
	{
		fetchRooms: roomsActions.fetchRooms
	}
)(Rooms);