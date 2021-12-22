import React, { useState } from 'react';
import { Paper, Grid, TextField, Button } from '@material-ui/core';
import { AccountCircle, Lock } from '@material-ui/icons';
import { useLocation } from 'react-router-dom';
// import { render } from 'react-dom';
import { User } from '@spectator/api-interfaces';
import { accountApi } from '../api/accountApi';

export const LoginPage: React.FC = () => {
	const location = useLocation();
	const typeLog = location.state;
	const [login, setLogin] = useState('');
	const [loginTHelper, setloginTHelper] = useState('');
	const [password1, setPassword1] = useState('');
	const [passTHelper, setPassTHelper] = useState('');
	const [password2, setPassword2] = useState('');
	const [pass2THelper, setPass2THelper] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const showErrorMessage = (message: string) => {
		setErrorMessage(message);
		setTimeout(() => setErrorMessage(''), 1200);
	};

	const regAcc = async (log: string, pass: string) => {
		let res: null | User = null;
		try {
			res = await accountApi.addAccount({
				login: log,
				password: pass,
			});
		} catch (error) {
			showErrorMessage('Ошибка регистрации');
		}

		return res;
	};

	const authAcc = async (log: string, pass: string) => {
		let res: null | User = null;
		try {
			res = await accountApi.authUser({
				login: log,
				password: pass,
			});
		} catch (error) {
			showErrorMessage('Ошибка авторизации');
		}

		return res;
	};

	const handleSubmitReg = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		setloginTHelper('');
		setPassTHelper('');
		setPass2THelper('');
		if (login.length > 10 || login.length < 5) {
			setloginTHelper('Длина логина должна быть от 5 до 10 символов');
			return;
		}

		if (password1.length < 6) {
			setPassTHelper('Длина пароля должна быть минимум 6 символов');
			return;
		}

		for (let i: number = 0; i < password1.length; i += 1) {
			const check = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
			if (!password1.match(check)) {
				setPassTHelper(
					'Пароль должен содержать строчные и заглавные буквы и цифры!'
				);
				return;
			}
		}

		if (password1 !== password2) {
			setPass2THelper('Пароли не совпадают!');
			return;
		}

		regAcc(login, password1);
	};

	const handleSubmitAuth = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		authAcc(login, password1);
	};

	if (errorMessage.length > 0) {
		return <div style={{ color: 'red' }}>{errorMessage}</div>;
	}
	if (typeLog === 'reg') {
		return (
			<>
				<form onSubmit={handleSubmitReg}>
					<Paper>
						<div>
							<Grid container spacing={3} alignItems="flex-end">
								<Grid item>
									<AccountCircle fontSize="large" />
								</Grid>
								<Grid item md sm xs>
									<TextField
										id="username"
										label="Логин"
										type="text"
										fullWidth
										autoFocus
										required
										value={login}
										onChange={(e) => setLogin(e.target.value)}
										helperText={loginTHelper}
									/>
								</Grid>
							</Grid>
							<Grid container spacing={3} alignItems="flex-end">
								<Grid item>
									<Lock fontSize="large" />
								</Grid>
								<Grid item md sm xs>
									<TextField
										id="password1"
										label="Пароль"
										type="password"
										fullWidth
										required
										value={password1}
										onChange={(e) => setPassword1(e.target.value)}
										helperText={passTHelper}
									/>
								</Grid>
							</Grid>
							<Grid container spacing={3} alignItems="flex-end">
								<Grid item>
									<Lock fontSize="large" />
								</Grid>
								<Grid item md sm xs>
									<TextField
										id="password2"
										label="Повторно пароль"
										type="password"
										fullWidth
										required
										value={password2}
										onChange={(e) => setPassword2(e.target.value)}
										helperText={pass2THelper}
									/>
								</Grid>
							</Grid>
							<Grid container justify="center" style={{ marginTop: '10px' }}>
								<Button
									variant="outlined"
									color="primary"
									style={{ textTransform: 'none' }}
									type="submit"
								>
									Register
								</Button>
							</Grid>
						</div>
					</Paper>
				</form>
			</>
		);
	}
	if (typeLog === 'auth') {
		return (
			<>
				<form onSubmit={handleSubmitAuth}>
					<Paper>
						<div>
							<Grid container spacing={3} alignItems="flex-end">
								<Grid item>
									<AccountCircle fontSize="large" />
								</Grid>
								<Grid item md sm xs>
									<TextField
										id="username"
										label="Username"
										type="text"
										fullWidth
										autoFocus
										required
									/>
								</Grid>
							</Grid>
							<Grid container spacing={3} alignItems="flex-end">
								<Grid item>
									<Lock fontSize="large" />
								</Grid>
								<Grid item md sm xs>
									<TextField
										id="password"
										label="Password"
										type="password"
										fullWidth
										required
									/>
								</Grid>
							</Grid>
							<Grid container justify="center" style={{ marginTop: '10px' }}>
								<Button
									variant="outlined"
									color="primary"
									style={{ textTransform: 'none' }}
									type="submit"
								>
									Login
								</Button>
							</Grid>
						</div>
					</Paper>
				</form>
			</>
		);
	}
	return <div>Something Wrong...</div>;
};
