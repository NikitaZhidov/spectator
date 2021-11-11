import { createTheme, ThemeOptions } from '@material-ui/core';
import { red, green } from '@material-ui/core/colors';

export const themeOptions: ThemeOptions = {
	palette: {
		primary: {
			light: '#69696a',
			main: '#28282a',
			dark: '#1e1e1f',
		},
		secondary: {
			light: '#fff5f8',
			main: '#ff3366',
			dark: '#e62958',
		},
		warning: {
			main: '#ffc071',
			dark: '#ffb25e',
		},
		error: {
			light: red[50],
			main: red[500],
			dark: red[700],
		},
		success: {
			light: green[50],
			main: green[500],
			dark: green[700],
		},
		background: {
			default: '#1e1e1f',
		},
	},
	typography: {
		fontFamily: "'Work Sans', sans-serif",
		fontSize: 14,
		fontWeightLight: 300, // Work Sans
		fontWeightRegular: 400, // Work Sans
		fontWeightMedium: 700, // Roboto Condensed
	},
};

export const MainTheme = createTheme(themeOptions);
