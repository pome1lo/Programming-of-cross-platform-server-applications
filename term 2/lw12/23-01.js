const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let phoneBook = [];

app.get('/TS', (req, res) => {
    res.json(phoneBook);
});

app.post('/TS', (req, res) => {
    const newEntry = req.body;
    phoneBook.push(newEntry);
    res.status(201).send('Phone entry added');
});

app.put('/TS', (req, res) => {
    const { id, ...otherDetails } = req.body;
    const index = phoneBook.findIndex(entry => entry.id === id);
    if (index !== -1) {
        phoneBook[index] = { ...phoneBook[index], ...otherDetails };
        res.send('Phone entry updated');
    } else {
        res.status(404).send('Entry not found');
    }
});

app.delete('/TS', (req, res) => {
    const { id } = req.body;
    phoneBook = phoneBook.filter(entry => entry.id !== id);
    res.send('Phone entry deleted');
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});