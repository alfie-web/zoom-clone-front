import api from './api';

const roomsAPI = {
	getAll: () => api.get('/rooms'),
	getById: (roomId) => api.get(`/rooms/${roomId}`),
}

export default roomsAPI;