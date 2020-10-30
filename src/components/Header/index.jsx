import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
	return (
		<header className="Header">
			<div className="Header__left">
				<NavLink to="/rooms">Конференции</NavLink>
			</div>

			<div className="Header__right"></div>
		</header>
	)
}

export default Header;