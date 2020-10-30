import React, { useRef } from 'react';
import { connect } from 'react-redux';

import { roomsActions } from '../../store/actions';
import useLazyLoading from '../../helpers/useLazyLoading';
import { Button, RoomCard } from '../../components';



import './Rooms.sass';


const Rooms = ({ items, fetchRooms, isFetching }) => {
	const observableRef = useRef();

	// useEffect(() => {
	// 	!items.length && !isLastPage && fetchRooms();
	// }, [items, fetchRooms, isLastPage])

	useLazyLoading(observableRef, () => fetchRooms(), isFetching);


	return (
		<main className="Page Rooms">
			<div className="container">
				<div className="box">
					<h1 className="title title--big">Конференции <sup className="title--count">{items.length}</sup></h1>
					
					<Button 
						text="Новая конференция"
						variant="violet"
						urlRedirect="/rooms/create"
					/>
				</div>

				<div className="Rooms__items">
					{ items.length 
						? items.map(item => (
							<RoomCard 
								key={item._id}
								_id={item._id}
								title={item.title}
								usersCount={item.users.length}
								date={item.date}
								time={item.time}
							/>
						))
						: <div>Конференций нет</div>
					}
				</div>

				<div ref={observableRef} className="Lazy Rooms__lazy"></div>
			</div>
		</main>
	)
}

export default connect(
	({ rooms }) => ({ items: rooms.items, isFetching: rooms.isFetching }),
	{
		fetchRooms: roomsActions.fetchRooms
	}
)(Rooms);