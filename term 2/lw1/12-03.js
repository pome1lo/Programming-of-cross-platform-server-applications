const redis = require('redis');
const client = redis.createClient("redis://127.0.0.1:6379");

client.connect();

let timeStart, timeEnd;

client.on('connect', async function() {
    console.log('✅ Подключено к серверу Redis');


    timeStart = Date.now();
    for(let i = 0; i < 10000; i++) {
        client.incr(`key${i}`);
    }
    timeEnd = Date.now();
    console.log(`# Время выполнения 10000 запросов INCR: ${timeEnd - timeStart} мс`);

    
    timeStart = Date.now(); 
    for(let i = 0; i < 10000; i++) {
        client.decr(`key${i}`);
    }
    timeEnd = Date.now();
    console.log(`# Время выполнения 10000 запросов DECR: ${timeEnd - timeStart} мс`);

    client.quit();
});
