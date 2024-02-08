const Redis = require('ioredis');
const subscriber = new Redis();


subscriber.on('message', (channel, message) => {
    console.log(`Получено сообщение с канала '${channel}': ✅ ${message}`);
});

const channel = 'test_channel';

subscriber.subscribe(channel, (error, count) => {
    if (error) {
        console.error('❌ Ошибка:', error);
        throw new Error(error);
    }
    console.log(`Количество каналов: ${count}. Прослушиваем канал ${channel}`);
});