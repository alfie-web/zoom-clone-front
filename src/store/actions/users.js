import axios from '../../api/api';
import { usersAPI } from '../../api';

const usersActions = {
	setIsAuth: isAuth => ({
		type: 'AUTH:SET_IS_AUTH',
		payload: isAuth
	}),

	setCurUser: user => ({
		type: 'AUTH:SET_ME',
		payload: user
	}),

	getMe: () => dispatch => {
		if (!window.localStorage['tokens']) return;
	
		return usersAPI.getMe()
			.then(({ data }) => {
				dispatch(usersActions.setCurUser(data));
				dispatch(usersActions.setIsAuth(true));
			})
			.catch(err => console.log(err))
	},

	signin: ({ email, password }, setFieldError ) => dispatch => {
		usersAPI.signin({ email, password })
			.then(({ data }) => {
				if (data.status !== 'success') return;

				console.log(data)

				localStorage.setItem('tokens', JSON.stringify(data.tokens));
				axios.defaults.headers.common['token'] =  data.tokens.accessToken;

				dispatch(usersActions.getMe())
			})
			.catch(({ response }) => {
				setFieldError('commonMessage', response.data.message)		// Вывожу в formik ошибку авторизации с сервера
			})
	},

	// TODO: Ещё удалять токен в БД
	signOut: () => async (dispatch, getState) => {
		// const { users } = getState();
		// await usersAPI.removeToken(users.user._id);
		await usersAPI.removeToken();

		dispatch(usersActions.setIsAuth(false));
		dispatch(usersActions.setCurUser(null));

		localStorage.removeItem('tokens');
		axios.defaults.headers.common['token'] = '';
	},
}

export default usersActions;
