import React from 'react';
import { CircularProgress } from '@material-ui/core';

export const PreloaderOverlay = () => {
	return (
		<div
			style={{
				position: 'fixed',
				left: '0',
				top: '0',
				bottom: '0',
				right: '0',
				backgroundColor: 'rgba(0, 0, 0, 0.6)',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				zIndex: 10000,
			}}
		>
			<CircularProgress size={100} />
		</div>
	);
};
