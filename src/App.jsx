import React, { useEffect } from 'react';
import{ Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { appActions } from './store/actions';
import { Header } from './components';
import { AuthPage, RoomsPage, RoomPage, CreateEditRoomPage } from './pages';

function App({ initialized, initializeApp, curUser, isAuth }) {

	useEffect(() => {
		initializeApp()
	}, [initializeApp])

	if (!initialized) return <div className="App__loader">Loading</div>;

	return (
		<div className="App">
			<Header />

			{ isAuth ?
				<Switch>
					<Route exact path={['/', '/login']} component={AuthPage} />
					<Route exact path="/rooms" component={RoomsPage} />
					<Route exact path={["/rooms/create", "/rooms/edit/:roomId"]} component={CreateEditRoomPage} />
					<Route exact path="/rooms/:roomId" component={RoomPage} />
					<Redirect from="*" to="/" />
				</Switch>
				:
				<Switch>
					<Route exact path={['/', '/login', '/register', '/register/verify']} component={AuthPage} />
					<Redirect from="*" to="/" />
				</Switch>
			}
		</div>
	);
}

export default connect(
	({ app, users }) => ({ initialized: app.initialized, isAuth: users.isAuth, curUser: users.curUser }),
	appActions
)(App);
