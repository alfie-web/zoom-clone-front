import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './Auth.sass';
import LoginForm from './LoginForm';

const Auth = () => {
	const isAuth = useSelector(state => state.users.isAuth);
	if(isAuth) return <Redirect to="/rooms" />

	return (
		<main className="Auth Page">
			<section>
				<div className="container">

					<LoginForm />

				</div>
			</section>
		</main>
	)
}

export default Auth;
