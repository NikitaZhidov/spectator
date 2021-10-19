import React, { ChangeEvent } from 'react';
import { AppBar, Tab, Tabs } from '@material-ui/core';
import { useLocation, useHistory } from 'react-router-dom';
import { AppRoutes } from '../constants';

export const Header: React.FC = () => {
	const location = useLocation();
	const history = useHistory();

	const handleChangeRoute = (event: ChangeEvent<{}>, value: string) => {
		history.push(value);
	};

	return (
		<AppBar position="static">
			<Tabs value={location.pathname} onChange={handleChangeRoute} centered>
				<Tab label="Главная" value={AppRoutes.Main} />
				<Tab label="Создать план помещения" value={AppRoutes.CreatePlan} />
			</Tabs>
		</AppBar>
	);
};
