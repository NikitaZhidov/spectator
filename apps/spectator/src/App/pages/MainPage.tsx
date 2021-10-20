import axios from 'axios';
import React, { useEffect } from 'react';

export const MainPage: React.FC = () => {
	useEffect(() => {
		axios.get('/api/auth/test').then((res) => console.log(res.data));
	});

	return <div>MainPage</div>;
};
