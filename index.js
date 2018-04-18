const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.get('/houseList', function (req, res, next) {
    const houses = JSON.parse(fs.readFileSync('./houses.json', 'utf-8'));
    res.json(houses);
});

app.listen('4444', () => {
    console.log('Node.js is Running')
});