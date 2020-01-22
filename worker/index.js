const redis = require('redis');
const keys = require('./keys');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: parseInt(keys.redisPort),
  retry_strategy: () => 1000
});
const redisSubscriber = redisClient.duplicate();

function fibonacci(index) {
  if (index < 2) return 1;
  return fibonacci(index - 1) + fibonacci(index - 2);
}

redisSubscriber.on('message', (channel, message) => {
  redisClient.hset('values', message, fibonacci(parseInt(message)));
});
redisSubscriber.subscribe('insert');
