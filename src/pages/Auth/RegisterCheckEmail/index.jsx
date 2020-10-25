import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../../api';
import getQueryParams from '../../../helpers/getQueryParams';

const RegisterCheckEmail = () => {
	const [verified, setVerified] = useState(false);

	const { hash, user } = getQueryParams();

	

	useEffect(() => {
		if (hash && user && !verified) {
			usersAPI.verify(hash, user)
			.then(data => {
				if (data.data.status === 'success') {
					setVerified(true);
				}
			})
		}

		if (verified) {
			setTimeout(() => {
				window.location = '/login'
			}, 3000)
		}
	}, [hash, user, verified])

	return (
		<div>
			<h1 className="title title--big">
				{ !verified 
					? 'Подтвердите почту!'
					: 'Вы успешно зарегистрированы!'
				}
			</h1>
		</div>
	)
}

export default RegisterCheckEmail;