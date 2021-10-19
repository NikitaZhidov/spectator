import { ThemeProvider } from '@material-ui/core';
import React from 'react';
import { Switch as RouterSwitch, Route } from 'react-router-dom';
import { Header } from './components';
import { AppRoutes } from './constants';
import { MainTheme } from './material-theme/Themes';
import { CreatePlanPage, MainPage } from './pages';

import './styles/styles.scss';

export const App: React.FC = () => {
	return (
		<>
			<ThemeProvider theme={MainTheme}>
				<Header />
				<RouterSwitch>
					<Route path={AppRoutes.Main} exact>
						<MainPage />
					</Route>
				</RouterSwitch>
				<RouterSwitch>
					<Route path={AppRoutes.CreatePlan} exact>
						<CreatePlanPage />
					</Route>
				</RouterSwitch>
			</ThemeProvider>
		</>
	);
};
