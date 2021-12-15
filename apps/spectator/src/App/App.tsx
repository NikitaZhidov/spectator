import { ThemeProvider, Container, CssBaseline } from '@material-ui/core';
import React from 'react';
import { Switch as RouterSwitch, Route } from 'react-router-dom';
import { Header } from './components';
import { AppRoutes } from './constants';
import { MainTheme } from './material-theme/Themes';
import { CreatePlanPage, EditPlanPage, WatchPlanPage } from './pages';

import './styles/styles.scss';

export const App: React.FC = () => {
	return (
		<ThemeProvider theme={MainTheme}>
			<Header />
			<Container>
				<CssBaseline />
				<RouterSwitch>
					<Route path={AppRoutes.PlanCreate} exact>
						<CreatePlanPage />
					</Route>

					<Route path={AppRoutes.Plan} exact>
						<WatchPlanPage />
					</Route>

					<Route path={AppRoutes.PlanEdit} exact>
						<EditPlanPage />
					</Route>

					<Route path={AppRoutes.PlanWithId} exact>
						<WatchPlanPage />
					</Route>
				</RouterSwitch>
			</Container>
		</ThemeProvider>
	);
};
