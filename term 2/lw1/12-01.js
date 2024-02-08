const redis = require('redis');
const client = redis.createClient("redis://127.0.0.1:6379");

client.connect();

client.on('error', function(error) {
    console.error('❌ Ошибка:', error);
});

client.on('connect', async function() {
    console.log('✅ Подключено к серверу Redis');
});