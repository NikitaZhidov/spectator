import { Box, makeStyles, useTheme } from '@material-ui/core';
import { FigureType } from '@spectator/api-interfaces';
import React from 'react';
import { Figure } from '../figure';

export interface FigureToolProps {
	figure: FigureType;
	id: string | number;
	isActive?: boolean;
	select(type: FigureType): void;
}

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '70px',
		borderRadius: '10px',
		marginBottom: '12px',
		cursor: 'pointer',
		backgroundColor: theme.palette.background.default,
		border: `1px solid ${theme.palette.secondary.dark}`,
		'&:hover': {
			border: `1px solid ${theme.palette.secondary.main}`,
		},
		'&:active': {
			backgroundColor: theme.palette.secondary.light,
		},
	},
}));

export const FigureTool: React.FC<FigureToolProps> = ({
	figure,
	isActive,
	select,
	id,
}: FigureToolProps) => {
	const classes = useStyles();
	const theme = useTheme();
	return (
		<Box
			className={classes.root}
			display="flex"
			justifyContent="center"
			alignItems="center"
			style={{
				border: isActive ? `1px solid ${theme.palette.secondary.dark}` : '',
			}}
			onClick={() => select(figure)}
		>
			<Box height={60} width={60}>
				<svg style={{ maxHeight: '100%', maxWidth: '100%' }}>
					<Figure
						title=""
						id={id}
						color={theme.palette.primary.dark}
						begin={{ x: 10, y: 10 }}
						end={{ x: 50, y: 50 }}
						type={figure}
					/>
				</svg>
			</Box>
		</Box>
	);
};
