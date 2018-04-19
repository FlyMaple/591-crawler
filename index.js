const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

let houses;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(bodyParser.json());

app.get('/houseList', function (req, res, next) {
    houses = JSON.parse(fs.readFileSync('./houses.json', 'utf-8'));

    res.json(houses);
});

app.post('/house/:id', function (req, res, next) {
    console.log(req.params);

    res.json({})
});

app.patch('/house/:houseid', function (req, res, next) {
    const { houseid } = req.params;
    const { status } = req.body.data;

    const query_house = houses.find(function (house) {
        return house.houseid == houseid;
    });
    query_house.status = status;

    if (query_house) {
        fs.writeFile('./houses.json', JSON.stringify(houses, null, 4), 'utf8', function () {
            res.json({});
        });
    } else {
        res.status(400).json({message: `House Id: ${houseid} is not match.`});
    }

});

app.listen('4444', () => {
    console.log('Node.js is Running')
});