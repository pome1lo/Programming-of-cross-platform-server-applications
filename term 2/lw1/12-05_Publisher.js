const Redis = require('ioredis');
const publisher = new Redis();

const channel = 'test_channel';

const wait = sec => new Promise(resolve => 
  setTimeout(resolve, sec * 1000)
);

async function run() {
    console.log('Стартовал...')
    await wait(4);
    publisher.publish(channel, '## ОТКРЫТИЕ КАНАЛА');

    await wait(5);
    publisher.publish(channel, '## ЗАКРЫТИЕ КАНАЛА');
    publisher.disconnect();
}

run();