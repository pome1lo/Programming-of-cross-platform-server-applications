const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json()); // Для парсинга JSON в запросах
let client;
(async () => {
    const webdav = await import('webdav');
    client = webdav.createClient(
    'https://webdav.yandex.ru/',
    {
        username: '',
        password: ''
    })
})();

// Создать директорию
app.post('/md/:dirName', async (req, res) => {
    const dirName = req.params.dirName;
    try {
        const exists = await client.exists(dirName);
        if (exists) {
            return res.sendStatus(408);
        }
        await client.createDirectory(dirName);
        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// Удалить директорию
app.post('/rd/:dirName', async (req, res) => {
    const dirName = req.params.dirName;
    try {
        const exists = await client.exists(dirName);
        if (!exists) {
            return res.sendStatus(404);
        }
        await client.deleteFile(dirName);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

const FILENAME = './up/';
// Загрузить файл
app.post('/up/:fileName', async (req, res) => {
    const file = FILENAME + req.params.fileName;
    try {
        if (await client.exists(file)) {
            await client.deleteFile(file);
        }
        const readStream = fs.createReadStream(file);
        if (await client.putFileContents(req.params.fileName, readStream)) {
            res.status(200).send('OK');
        }
        else {
            res.status(408).send('Not accepted');
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
});

// Скачать файл
app.post('/down/:fileName', async (req, res) => {
    const fileName = req.params.fileName;
    try {
        const exists = await client.exists(fileName);
        if (!exists) {
            return res.sendStatus(404);
        }
        const fileBuffer = await client.getFileContents(fileName);
        res.send(fileBuffer);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// Удалить файл
app.post('/del/:fileName', async (req, res) => {
    const fileName = req.params.fileName;
    try {
        const exists = await client.exists(fileName);
        if (!exists) {
            return res.sendStatus(404);
        }
        await client.deleteFile(fileName);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// Копировать файл
app.post('/copy/:source/:destination', async (req, res) => {
    const source = req.params.source;
    const destination = req.params.destination;
    try {
        const exists = await client.exists(source);
        if (!exists) {
            return res.sendStatus(404);
        }
        await client.copyFile(source, destination);
        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.sendStatus(408);
    }
});

// Переместить файл
app.post('/move/:source/:destination', async (req, res) => {
    const source = req.params.source;
    const destination = req.params.destination;
    try {
        const exists = await client.exists(source);
        if (!exists) {
            return res.sendStatus(404);
        }
        await client.moveFile(source, destination);
        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.sendStatus(408);
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});