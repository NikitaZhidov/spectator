import { IClickHouseConfig, IMongoConfig } from '../core';

export const mongoConfig: IMongoConfig = {
	hostname: process.env.MONGODB_HOST || 'localhost',
	port: Number(process.env.MONGODB_PORT) || 27017,
	username: process.env.MONGO_INITDB_ROOT_USERNAME || 'default',
	password: process.env.MONGO_INITDB_ROOT_PASSWORD || 'qwerty',
	database: process.env.MONGO_INITDB_DATABASE || 'spectator',
};

export const clickHouseConfig: IClickHouseConfig = {
	url: process.env.CLICKHOUSE_HOST || 'localhost',
	port: Number(process.env.CLICKHOUSE_PORT) || 8123,
	debug: false,
	basicAuth: {
		username: process.env.CLICKHOUSE_USER || 'default',
		password: process.env.CLICKHOUSE_PASSWORD || '',
	},
	format: 'json',
	raw: false,
	config: {
		database: process.env.CLICKHOUSE_DB || 'spectator',
	},
};

export const clickHouseSensorDataTable: string =
	process.env.CLICKHOUSE_TABLE || 'sensorData';
