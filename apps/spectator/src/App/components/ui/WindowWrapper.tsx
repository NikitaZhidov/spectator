import { Box, useTheme } from '@material-ui/core';
import React from 'react';

export interface WindowWrapperProps {
	children?: React.ReactNode;
	className?: string;
}

export const WindowWrapper: React.FC<WindowWrapperProps> = ({
	children,
	className,
}: WindowWrapperProps) => {
	const theme = useTheme();

	return (
		<Box
			className={className}
			sx={{
				width: '100%',
				height: '100%',
				borderRadius: '15px',
				bgcolor: theme.palette.primary.main,
				color: theme.palette.secondary.light,
				padding: '20px',
			}}
			boxShadow={3}
		>
			{children}
		</Box>
	);
};
