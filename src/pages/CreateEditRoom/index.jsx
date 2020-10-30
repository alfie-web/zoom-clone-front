import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';

import { roomsActions } from '../../store/actions';
import Form from './Form';
import './CreateEditRoom.sass';

const CreateEditRoom = ({ createRoom }) => {
	const { roomId } = useParams();

	const onCreateRoom = (formData) => {
		console.log('onCreate', formData)
		createRoom(formData)
	}

	const onEditRoom = (formData) => {
		console.log('onEdit', formData)
	}


	return (
		<main className="CreateEditRoom">
			<section>
				<div className="container">
					<div className="box">
						<h1 className="title title--big">Новая конференция</h1>
					</div>

					<Form 
						isEdit={roomId}
						onCreateRoom={onCreateRoom}
						onEditRoom={onEditRoom}
					/>
				</div>
			</section>
		</main>
	)
}

export default connect(
	null,
	{
		createRoom: roomsActions.createRoom
	}
)(CreateEditRoom);