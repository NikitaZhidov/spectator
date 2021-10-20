import { ClickHouse } from 'clickhouse';
import { injectable } from 'inversify';
import { clickHouseConfig, clickHouseSensorDataTable } from '../config/db';
import { ISensorDataRepository } from '../interfaces';

@injectable()
class SensorDataRepository implements ISensorDataRepository {
	private readonly _ch: ClickHouse;

	constructor() {
		this._ch = new ClickHouse(clickHouseConfig);
	}

	async FindAll(): Promise<any> {
		const result = await this._ch
			.query(`SELECT * from ${clickHouseSensorDataTable}`)
			.toPromise();

		return result;
	}
}

export default SensorDataRepository;
