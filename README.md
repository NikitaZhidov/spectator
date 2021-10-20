<b>Для запуска проекта с конфигурацией по умолчанию - пункты 4-7 можно пропустить</b>

  <h2>1. Скачать проект из репозитория (https://github.com/NikitaZhidov/spectator)</h2>
  git clone https://github.com/NikitaZhidov/spectator

  <h2>2. Установить Node.js и Docker</h2>
	 <ul>
		 <li>Docker - https://docs.docker.com/get-docker/</li>
		 <li>Node.js - https://nodejs.org/en/ </li>
	 </ul>

  <h2>3. Установить необходимые зависимости в проекте. В корневой директории проекта необходимо в терминале ввести:</h2>
  	<pre>npm i</pre>

  <h2>4. Настроить конфигурацию баз данных.</h2>
  <ul>
    <li>Clickhouse - настройки базы данных в <b>databases/clickhouse/config</b> (users.xml - данные для входа, config.xml - остальное)</li>
    <li>
       MongoDB - настройки базы данных в <b>databases/mongo/config/mongodb.conf</b>. Данные для входа можно изменить в <b>docker-compose.yml</b>: переменные <i>MONGO_INITDB_ROOT_*</i> 
<pre>
environment:
  MONGO_INITDB_ROOT_USERNAME: default
  MONGO_INITDB_ROOT_PASSWORD: qwerty
</pre> 
   </li>
   <li>
     Порты для подключения к базам данных находятся в <b>docker-compose.yml</b> <br/>
     Clickhouse по умолчанию - <b>8123</b> <br/>
     MongoDB - <b>27017</b>
<pre>
ports:
  - '8123:8123'
ports:
  - '27017:27017'
</pre>
   </li>
  </ul>
<strong>По умолчанию в проекте для MongoDB и Clickhouse имя пользователя: <i>default</i>, пароль: <i>qwerty</i></strong>

<h2>5. Настроить подключение к базам данных на сервере. Настройки хранятся в <b>apps/api/src/app/config/db.ts</b></h2>
<pre>
export const mongoConfig: IMongoConfig = {
	hostname: 'localhost',
	port: 27017,
	username: 'default',
	password: 'qwerty',
	database: 'spectator',
};
</pre>

<h2>6. Настроить порт сервера в <b>apps/api/src/main.ts</b> (По умолчанию - 3333).</h2>
<pre>
const PORT = process.env.port || 3333;
</pre>


<h2>7. Настроить proxy.config.json (необходимо указать hostname и port сервера) в <b>apps/spectator/proxy.conf.json</b> (По умолчанию - "http://localhost:3333").</h2>

<pre>
{
  "/api": {
    "target": "http://localhost:3333",
    "secure": false
  }
}
</pre>

<h2>8. В корне проекта из терминала запустить необходимые докер контейнеры:</h2>
<pre>docker-compose up</pre>

<h2>9. Запуск самого приложения (клиент и сервер):</h2>
<pre>npm run dev</pre>
