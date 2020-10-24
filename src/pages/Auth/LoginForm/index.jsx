import React from 'react';
import { connect } from 'react-redux';
import { Formik, Field, Form } from 'formik';
import classNames from 'classnames';

import { Button } from '../../../components';
import { usersActions } from '../../../store/actions';
import { validateEmail, requiredPassword } from '../../../helpers/validators';

import './LoginForm.sass';

function LoginForm({ signin }) {
	return (
		<div className="Auth__form">
			<h1 className="title title--big">Вход</h1>

			<Formik
				initialValues={{ email: "", password: "" }}
				onSubmit={(values, actions) => {
					setTimeout(() => {
						signin(values, actions.setFieldError);
						actions.setSubmitting(false);
						actions.resetForm();
						// в actions есть ещё методы, например setErrors для ошибот полей
						console.log(actions)
					}, 1000);
				}}
			>
				{ props => {
					const {
						touched,
						errors,
						isSubmitting,
					} = props;

					return ( 
					<Form>
						<div className={classNames('Input', 
								{
									"Input--error": errors.email && touched.email,
									"Input--success": !errors.email && touched.email
								}
							)}
						>
							<Field 
								name="email" validate={validateEmail}
								className="Input__element"
								placeholder="Электропочта"
							/>

							{errors.email && touched.email && <div className="Input__error-msg">{errors.email}</div>}
							
							<div className="Input__line"></div>
						</div>

				
						<div className={classNames('Input', 
							{
								"Input--error": errors.password && touched.password,
								"Input--success": !errors.password && touched.password
							}
						)}>
							<Field 
								name="password" 
								type="password" 
								validate={requiredPassword}
								className="Input__element"
								placeholder="Пароль"
							/>

							{errors.password && touched.password && <div className="Input__error-msg">{errors.password}</div>}
							
							{/* <label>Ваш пароль</label> */}
							<div className="Input__line"></div>
							
						</div>

						{/* Общая серверная ошибка */}
						{errors.commonMessage && <div className="Auth__form-error">{errors.commonMessage}</div>}


						<Button 
							className="Auth__form-btn"
							disabled={isSubmitting}
							variant="violet"
							type="submit"
							text="Войти"
						/>
					</Form>
				)}
			}
			</Formik>
		</div>
	)
}

export default connect(
	null, 
	{ signin: usersActions.signin 
})(LoginForm);

