import api from './api';

const usersAPI = {
	getMe: () => api.get('/users/me'),
	signin: (postData) => api.post('/users/login', postData),
	removeToken: () => api.delete(`/users/remove-token`),

	signup: (postData) => api.post('/users/register', postData),
	verify: (hash, user) => api.post('/users/register/verify', {hash, user}),
}

export default usersAPI;