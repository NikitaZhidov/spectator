import { Box, makeStyles, useTheme } from '@material-ui/core';
import { FigureType } from '@spectator/api-interfaces';
import React from 'react';
import { Figure } from '../../hoc';

export interface FigureToolProps {
	figure: FigureType;
	isActive?: boolean;
	select(type: FigureType): void;
	id: string | number;
}

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '70px',
		borderRadius: '10px',
		marginBottom: '12px',
		cursor: 'pointer',
		backgroundColor: theme.palette.primary.dark,
		'&:hover': {
			backgroundColor: theme.palette.primary.main,
			border: `1px solid ${theme.palette.secondary.main}`,
		},
		'&:active': {
			backgroundColor: theme.palette.primary.dark,
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
						id={id}
						color={theme.palette.primary.light}
						begin={{ x: 10, y: 10 }}
						end={{ x: 50, y: 50 }}
						type={figure}
					/>
				</svg>
			</Box>
		</Box>
	);
};
