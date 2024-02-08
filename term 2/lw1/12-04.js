const Redis = require('ioredis');
const client = new Redis("redis://127.0.0.1:6379");

let timeStart, timeEnd;

async function run() {
    console.log('✅ Подключено к серверу Redis');

    
    timeStart = Date.now();
    for(let i = 0; i < 10000; i++) {
        await client.hset(`hash${i}`, `field${i}`, `value${i}`);
    }
    timeEnd = Date.now();
    console.log(`# Время выполнения 10000 запросов HSET: ${timeEnd - timeStart} мс`);

    
    timeStart = Date.now();
    for(let i = 0; i < 10000; i++) {
        await client.hget(`hash${i}`, `field${i}`);
    }
    timeEnd = Date.now();
    console.log(`# Время выполнения 10000 запросов HGET: ${timeEnd - timeStart} мс`);

    client.quit();
}

run().catch(console.error);
