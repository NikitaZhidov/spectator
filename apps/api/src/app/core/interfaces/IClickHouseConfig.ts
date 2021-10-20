export interface IClickHouseConfig {
	url: string;
	port: number;
	debug: boolean;
	inUseGzip?: boolean;
	basicAuth?: {
		username: string;
		password: string;
	};
	format: 'json' | 'csv' | 'tsv';
	raw: boolean;
	config: {
		session_id?: 'session_id if neeed';
		session_timeout?: 60;
		output_format_json_quote_64bit_integers?: 0;
		enable_http_compression?: 0;
		database: string;
	};
}
