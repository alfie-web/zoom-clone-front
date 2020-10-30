import api from './api';

const roomsAPI = {
	getAll: (page) => api.get(`/rooms?page=${page}`),
	getById: (roomId) => api.get(`/rooms/${roomId}`),

	create: (formData) => api.post(`rooms/create`, formData),
}

export default roomsAPI;