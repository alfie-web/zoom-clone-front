import React from 'react';
import classNames from 'classnames';

export default function Textarea({ 
	value, 
	onChange,  
	onFocus,  
	onBlur,  
	onKeyPress,
	required = false,
	className,
	name,
	placeholder
}) {
	return (
		<div className={classNames('Textarea', className)}>
			<textarea 
				className="Textarea__element" 
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
			<div className="Textarea__line"></div>
		</div>
	)
}
