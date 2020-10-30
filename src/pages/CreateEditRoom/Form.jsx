import React, { useState } from 'react';
import { DatePicker, TimePicker } from 'antd';
// import locale from 'antd/es/date-picker/locale/ru_RU';
import ru_RU from 'antd/lib/locale/ru_RU';
import { Input, Textarea, Button } from '../../components';

// console.log(ru_RU)

const Form = ({ onCreateRoom, onEditRoom, isEdit }) => {
	const [formData, setFormData] = useState({
		title: '',
		date: '',
		time: '',
		description: ''
	})

	const onChangeHandler = (prop, value) => {
		setFormData({
			...formData,
			[prop]: value
		})
	}

	return (
		<form className="CreateEditRoom__form Form">
			<Input 
				type="text"
				placeholder="Название конференции"
				value={formData.title}
				onChange={(e) => onChangeHandler('title', e.target.value)} 
			/>
			<div className="Form__cols">
				<div className="Form__left">
					{/* <ConfigProvider
						locale={ru_RU}
					> */}
					<DatePicker 
						placeholder="Дата проведения"
						format="DD-MM-YYYY"
						// locale={locale}
						showToday={false}
						defaultValue={formData.date}
						onChange={(date, dateString) => onChangeHandler('date', dateString)} 
					/>
					{/* </ConfigProvider> */}
					
				</div>
				<div className="Form__right">
					<TimePicker 
						placeholder="Время проведения"
						format="HH:mm"
						defaultValue={formData.time}
						onChange={(time, timeString) => onChangeHandler('time', timeString)} 
					/>
				</div>
			</div>

			<Textarea 
				placeholder="Описание"
				value={formData.description}
				onChange={(e) => onChangeHandler('description', e.target.value)} 
			/>

			<div className="Form__bottom">
				<Button 
					text="Создать конференцию"
					variant="violet"
					className="CreateEditRoom__btn"
					onClick={ isEdit
						? () => onEditRoom(formData)
						: () => onCreateRoom(formData)
					}
				/>
			</div>
		</form>
	)
}

export default Form;