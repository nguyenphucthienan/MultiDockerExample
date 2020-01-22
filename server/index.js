const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const redis = require('redis');
const keys = require('./keys');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

const pgClient = new Pool({
  host: keys.pgHost,
  port: keys.pgPort,
  user: keys.pgUser,
  password: keys.pgPassword,
  database: keys.pgDatabase
});

pgClient.on('error', () => console.log('Lost PostgreSQL connection'));
pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch(err => console.log(err));

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  return res.send({ hi: 'there' })
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * FROM values');
  return res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/values', async (req, res) => {
  const { index } = req.body;
  if (parseInt(index) > 40) {
    return res.status(422).send('Index is too high');
  }

  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
  return res.send({ message: 'Done' });
});

app.listen(5000, () => {
  console.log('Listening on port 5000');
});
