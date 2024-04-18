const TelegramBot = require('node-telegram-bot-api');
const token = '';
const request = require('request');
const bot = new TelegramBot(token, { polling: true });
const THE_CAT_API_KEY = "";
const THE_API_KEY = ""
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./subscribers.db');
const axios = require('axios');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS subscribers (chat_id INTEGER PRIMARY KEY)");
});


bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if(msg.text === null){
        return;
    }
    bot.sendMessage(chatId, msg.text); // Echo the same message back
});

bot.onText('', (msg) => {
    const chatId = msg.chat.id;
    if (msg.text.toLowerCase() === 'привет') {
        const stickerFileId = 'CAACAgIAAxkBAAEqwe9mFQKJKIHp5NruF4z9wAxdISzGPwACKDoAApf9YUhXzT8ijhGCAzQE'; // Укажите здесь реальный file_id стикера
        bot.sendSticker(chatId, stickerFileId).catch(error => {
            console.error(error); // В случае возникновения ошибки выведем её в консоль
        });
    }

    if (msg.text.toLowerCase() === 'пока') {
        const stickerFileId = 'CAACAgIAAxkBAAEqwfNmFQKQfwnVzv6pRG_YLcRgWMXSigACFjMAAgLi8UrObw98OJQi5zQE'; // Укажите здесь реальный file_id стикера
        bot.sendSticker(chatId, stickerFileId).catch(error => {
            console.error(error); // В случае возникновения ошибки выведем её в консоль
        });
    }

    if (msg.text.toLowerCase() === 'хрю') {
        const stickerFileId = 'CAACAgIAAxkBAAEqwfFmFQKMuPyI4PgP0Q269yAyRqpPdwACJD4AAgS3GEhrRmtb61CeqDQE'; // Укажите здесь реальный file_id стикера
        bot.sendSticker(chatId, stickerFileId).catch(error => {
            console.error(error); // В случае возникновения ошибки выведем её в консоль
        });
    }

    if(msg.text.toLowerCase() === '/subscribe'){
        db.run("INSERT INTO subscribers(chat_id) VALUES (?)", [chatId], (err) => {
            if (err) {
                return bot.sendMessage(chatId, "Произошла ошибка при подписке. Возможно, вы уже подписаны");
            }
            bot.sendMessage(chatId, "Вы успешно подписались!");
        });
    }

    if(msg.text.toLowerCase() === '/unsubscribe'){
        db.run("DELETE FROM subscribers WHERE chat_id = ?", [chatId], (err) => {
            if (err) {
                return bot.sendMessage(chatId, "Произошла ошибка при отписке. Возможно вы не подписаны");
            }
            bot.sendMessage(chatId, "Вы успешно отписались.");
        });
    }

    if (msg.text.toLowerCase() === '/joke') {

        request.get({
            url: 'https://api.api-ninjas.com/v1/jokes?limit=1',
            headers: {
                'X-Api-Key': THE_API_KEY
            },
        }, function(error, response, body) {
            if(error) {
                bot.sendMessage(chatId, 'Произошла ошибка при запросе шутки.');
                return console.error('Request failed:', error);
            } else if(response.statusCode != 200) {
                bot.sendMessage(chatId, 'Не удалось получить шутку: ' + response.statusCode);
                return console.error('Error:', response.statusCode, body.toString('utf8'));
            } else {

                try {
                    const joke = JSON.parse(body);
                    let jokeMessage = joke.map(joke => joke.joke).join('nn');
                    bot.sendMessage(chatId, jokeMessage);
                } catch (parseError) {
                    bot.sendMessage(chatId, 'Произошла ошибка при обработке шутки.');
                    return console.error('Parse failed:', parseError);
                }
            }
        });
    };

    if(msg.text.toLowerCase() === '/cat'){

        axios.get('https://api.thecatapi.com/v1/images/search', {
            headers: {
                'x-api-key': THE_CAT_API_KEY
            }
        })
            .then(response => {
                const imageUrl = response.data[0].url;
                bot.sendPhoto(chatId, imageUrl);
            })
            .catch(error => {
                bot.sendMessage(chatId, 'Произошла ошибка при получении изображения кота.');
                console.error(error);
            });
    }


    if (msg.text.toLowerCase() === '/weater'){
        var name = 'San Francisco'
        request.get({
            url: 'https://api.api-ninjas.com/v1/city?name=' + name,
            headers: {
                'X-Api-Key': THE_API_KEY
            },
        }, function(error, response, body) {
            if(error) {
                bot.sendMessage(chatId, 'Произошла ошибка при запросе информации о городе.');
                return console.error('Request failed:', error);
            } else if(response.statusCode != 200) {
                bot.sendMessage(chatId, 'Не удалось получить информацию о городе: ' + response.statusCode);
                return console.error('Error:', response.statusCode, body.toString('utf8'));
            } else {

                try {
                    const info = JSON.stringify(body);
                    // let infoMessage = info.map(info => info.).join('\n');
                    bot.sendMessage(chatId, info);
                } catch (parseError) {
                    bot.sendMessage(chatId, 'Произошла ошибка при обработке информации о городе.');
                    return console.error('Parse failed:', parseError);
                }
            }
        });

    }

});




const cron = require('node-cron');

cron.schedule('* * * * *', () => { // Каждый день в 9:00 утра
    db.all("SELECT chat_id FROM subscribers", [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            sendFact(row.chat_id);
        });
    });
});

function sendFact(chatId) {

    request.get({
        url: 'https://api.api-ninjas.com/v1/facts?limit=1',
        headers: {
            'X-Api-Key': THE_API_KEY
        },
    }, function(error, response, body) {
        if(error) {
            bot.sendMessage(chatId, 'Произошла ошибка при запросе фактов.');
            return console.error('Request failed:', error);
        } else if(response.statusCode != 200) {
            bot.sendMessage(chatId, 'Не удалось получить факты: ' + response.statusCode);
            return console.error('Error:', response.statusCode, body.toString('utf8'));
        } else {

            try {
                const facts = JSON.parse(body);
                let factsMessage = facts.map(fact => fact.fact).join('nn');
                bot.sendMessage(chatId, factsMessage);
            } catch (parseError) {
                bot.sendMessage(chatId, 'Произошла ошибка при обработке фактов.');
                return console.error('Parse failed:', parseError);
            }
        }
    });
}
 