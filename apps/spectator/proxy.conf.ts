const getProxyTarget = () => {
	const DEFAULT_TARGET = 'http://localhost:3333';

	if (process.env.SERVER_PORT && process.env.SERVER_HOST) {
		return `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`;
	}

	return DEFAULT_TARGET;
};

const PROXY_CONFIG = {
	'/api': {
		target: getProxyTarget(),
		secure: false,
	},
};

module.exports = PROXY_CONFIG;
