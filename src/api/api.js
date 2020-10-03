import axios from 'axios';

// const baseURL = 'http://localhost:8080';
const baseURL = 'http://localhost:3000';

const api = axios.create({
	baseURL,
	withCredentials: true
});


// api.defaults.headers.common['token'] = tokens ? JSON.parse(tokens).accessToken : '';

// Интерсепторы - что-то типо middleware в express. Только тут я могу как до каждого запроса, так и после сделать
api.interceptors.request.use(async function (config) {
	const tokens = localStorage.getItem('tokens');
	// Do something before request is sent
	// console.log('AXIOS_CONFIG', config)

	// TODO: Вынести работу с localStorage в хелпер функцию
	// Теперь просто нужно проверять здесь, если текущая дата больше времени жизни accessToken-а
	// Тогда делаем запрос на refresh-token, получаем новую пару токенов
	// Конфигурируем axios новым accessToken-ом
	if (tokens) {
		const { exp, refreshToken, accessToken } = JSON.parse(tokens);

		// api.defaults.headers.common['token'] = accessToken || '';
		config.headers.token = accessToken || '';
		
		if (Date.now() >= exp * 1000) {
			try {
				const response = await fetch(`${baseURL}/users/refresh-tokens`, { 
					method: 'POST', 
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ refreshToken }) 
				});

				const data = await response.json();

				if (data.status === 'success') {
					// console.log(config)
					localStorage.setItem('tokens', JSON.stringify(data.data));
					// api.defaults.headers.common['token'] = data.data.accessToken || '';		// Это не сработает
					config.headers.token = data.data.accessToken || '';
				}
				
			} catch(e) {
				console.log('e', e)
			}
		}
	}

	return config;
}, function (error) {
	return Promise.reject(error);
});

export default api;
