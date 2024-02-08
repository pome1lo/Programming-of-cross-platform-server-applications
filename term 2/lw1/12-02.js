const redis = require('redis');
const client = redis.createClient("redis://127.0.0.1:6379");

client.connect();

let timeStart, timeEnd;

client.on('error', function(error) {
    console.error('❌ Ошибка:', error);
});

client.on('connect', async function() {
    console.log('✅ Подключено к серверу Redis');


    timeStart = Date.now();
    for(let i = 0; i < 10000; i++) {
        await client.set(`key${i}`, `value${i}`);
    }
    timeEnd = Date.now();
    console.log(`# Время выполнения 10к запросов SET: ${timeEnd - timeStart} мс`);

    
    timeStart = Date.now();
    for(let i = 0; i < 10000; i++) {
        await client.get(`key${i}`);
    }
    timeEnd = Date.now();
    console.log(`# Время выполнения 10к запросов GET: ${timeEnd - timeStart} мс`);

    
    timeStart = Date.now();
    for(let i = 0; i < 10000; i++) {
        await client.del(`key${i}`);
    }
    timeEnd = Date.now();
    console.log(`# Время выполнения 10к запросов DEL: ${timeEnd - timeStart} мс`);

    client.quit();
});
