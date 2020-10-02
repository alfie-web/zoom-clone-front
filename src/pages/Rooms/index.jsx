import React from 'react';

import { Button, RoomCard } from '../../components';

import './Rooms.sass';


const MOCK_DATA = [
	{
		_id: 1,
		title: 'Front-end митап',
		usersCount: 12,
		date: "2020-10-01T20:39:46.000Z"
	},
	{
		_id: 2,
		title: 'Native-speacker по английскому',
		usersCount: 2,
		date: "2020-10-02T14:39:46.000Z"
	},
	{
		_id: 3,
		title: 'Пишпек балбесы',
		usersCount: 5,
		date: "2020-10-03T12:39:46.000Z"
	},
]

export default function Rooms() {
	return (
		<main className="Page Rooms">
			<div className="container">
				<div className="box">
					<h1 className="title title--big">Конференции <sup className="title--count">{MOCK_DATA.length}</sup></h1>

					<Button 
						text="Новая конференция"
						variant="violet"
					/>
				</div>

				<div className="Rooms__items">
					{
						MOCK_DATA && MOCK_DATA.map(item => (
							<RoomCard 
								key={item._id}
								_id={item._id}
								title={item.title}
								usersCount={item.usersCount}
								date={item.date}
							/>
						))
					}
					
				</div>
			</div>
		</main>
	)
}
