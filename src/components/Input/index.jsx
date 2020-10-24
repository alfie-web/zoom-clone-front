import React from 'react';
import classNames from 'classnames';

export default function Input({ 
	value, 
	onChange,  
	onFocus,  
	onBlur,  
	onKeyPress,
	required = false,
	className,
	type,
	name,
	placeholder
}) {
	return (
		<div className={classNames('Input', className)}>
			<input 
				type={type} 
				className="Input__element" 
				autoComplete="off" 
				required={required}
				value={value}
				name={name}
				placeholder={placeholder}
				onChange={onChange}
				onFocus={onFocus}
				onBlur={onBlur}
				onKeyPress={onKeyPress}
			/>
			{/* <label className="focused">{label}</label> */}
			<div className="Input__line"></div>
		</div>
	)
}
