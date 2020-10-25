import React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './Auth.sass';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import RegisterCheckEmail from './RegisterCheckEmail';

const Auth = () => {
	const isAuth = useSelector(state => state.users.isAuth);
	if(isAuth) return <Redirect to="/rooms" />

	return (
		<main className="Auth">
			<section>
				<div className="container">
					<Switch>
						<Route exact path={['/', '/login']} component={LoginForm} />
						<Route exact path="/register" component={RegisterForm} />
						<Route exact path="/register/verify" component={RegisterCheckEmail} />
					</Switch>

					{/* <LoginForm /> */}

				</div>
			</section>
		</main>
	)
}

export default Auth;
