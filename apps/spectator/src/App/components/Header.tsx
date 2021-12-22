import React, { ChangeEvent } from 'react';
import { AppBar, Button, ButtonGroup, Tab, Tabs } from '@material-ui/core';
import { useLocation, useHistory } from 'react-router-dom';
import { AppRoutes } from '../constants';

export const Header: React.FC = () => {
	const location = useLocation();
	const history = useHistory();

	const handleChangeRoute = (event: ChangeEvent<{}>, value: string) => {
		history.push(value);
	};

	const handleClick = (typeLog: string) => {
		history.push({
			pathname: AppRoutes.Login,
			state: typeLog,
		});
	};

	return (
		<AppBar position="static" style={{ marginBottom: '20px' }}>
			<Tabs
				value={AppRoutes.isMainAppRoute(location.pathname) && location.pathname}
				onChange={handleChangeRoute}
				centered
			>
				<Tab label="Создать план помещения" value={AppRoutes.PlanCreate} />
				<Tab label="Просмотреть планы" value={AppRoutes.Plan} />
				<ButtonGroup variant="contained">
					<Button onClick={() => handleClick('reg')}>Регистрация</Button>
					<Button onClick={() => handleClick('auth')}>Авторизация</Button>
				</ButtonGroup>
			</Tabs>
		</AppBar>
	);
};
