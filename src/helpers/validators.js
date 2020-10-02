
export function validateEmail(value) {
	let error;
	if (!value) {
		error = 'Введите E-Mail';
	} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
		error = 'Неверный E-Mail';
	}
	return error;
}

export function validatePassword(value) {
	let error;
	if (!value) {
		error = "Введите пароль";
	} else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(value)) {
		error = "Слишком лёгкий пароль";
	}
	return error;
}

export function requiredPassword(value) {
	let error;
	if (!value) {
		error = "Введите пароль";
	}
	return error;
}
