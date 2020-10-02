import React from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import './Button.sass';

export default function Button({ 
	className, 
	text = '', 
	onClick = () => {}, 
	type = 'button',
	variant,
	icon,
	active = false,
	disabled,
	urlRedirect,	// если хотим использовать как ссылку
	title = ''
}) {
	const history = useHistory();

	return (
		<button 
			className={classNames('Button', {
				'Button--gray': variant && variant === 'gray',
				'Button--red': variant && variant === 'red',
				'Button--violet': variant && variant === 'violet',
				'Button--icon': icon,
				'Button--active': active,
				'Button--disabled': disabled,
			}, className)}
			onClick={
				// !disabled ? onClick : () => {}
				urlRedirect && !disabled ? () => history.push(urlRedirect)
				: !disabled ? onClick : () => {}
			}
			type={type}
			disabled={disabled}
			title={title}
		>
			{
				icon ?
					<div className="Button__icon">
						{icon}
					</div>
				: <span>{text}</span>
			}
		</button>
	)
}

