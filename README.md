<h2>Установка проекта для разработки</h2>
  <p>1. Скачать проект из репозитория (https://github.com/NikitaZhidov/spectator)</p>

```shell
git clone https://github.com/NikitaZhidov/spectator
```

  <p>2. Установить Node.js и Docker</p>
	 <ul>
		 <li>Docker - https://docs.docker.com/get-docker/</li>
		 <li>Node.js - https://nodejs.org/en/ </li>
	 </ul>

  <p>3. Установить необходимые зависимости в проекте. В корневой директории проекта необходимо в терминале ввести:</p>

```shell
npm i
```

  <p> 4. Переименовать .env.sample в .env и задать свои настройки для приложения (или оставить по умолчанию):</p>

```env
MONGODB_HOST=localhost
MONGODB_PORT=27017

#Данные администратора(задаются только при первой инициализации данных)
MONGO_INITDB_ROOT_USERNAME=default
MONGO_INITDB_ROOT_PASSWORD=qwerty
MONGO_INITDB_DATABASE=spectator

CLICKHOUSE_HOST=localhost
CLICKHOUSE_PORT=8123
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=qwerty
#Имя используемой базы данных (создается, если не существует)
CLICKHOUSE_DB=spectator
#Имя таблицы в используемой базе данных (создается, если не существует)
CLICKHOUSE_TABLE=sensorData

SERVER_HOST=localhost
SERVER_PORT=3333
```


<p>5. Конфиги серверов баз данных находятся в:</p>
<ul>
  <li>
    databases/clickhouse/config/config.xml
  </li>
  <li>
    databases/mongo/config/mongod.conf
  </li>
</ul>

<p>6. Отредактировать скрипт для инициализации необходимой таблицы в ClickHouse (Для Mongo автоматически создаются необходимые в приложении таблицы) можно в файле <i>databases/clickhouse/clickhouse-files/init-db.sh</i>:</p>

```shell
#!/bin/bash
set -e

clickhouse client -n --password $CLICKHOUSE_PASSWORD --user $CLICKHOUSE_USER <<-EOSQL
    CREATE TABLE IF NOT EXISTS $CLICKHOUSE_DB.$CLICKHOUSE_TABLE (x Int32) ENGINE = Log;
EOSQL
```

<p> 7. При необходимости можно отредактировать конфиг подключения к базам данных в файле apps/api/src/app/config/db.ts</p>

```typescript
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

```

<p>8. В корне проекта из терминала запустить необходимые докер контейнеры:</p>

```shell
docker-compose up
```

<p>9. Запуск самого приложения (клиент и сервер):</p>

```shell
npm run dev
```
