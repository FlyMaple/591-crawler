const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const { run:fetchHouseList } = require('./fetchHouses');

let houses;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(bodyParser.json());

app.get('/houseList', function (req, res, next) {
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
        res.status(400).json({ message: `House Id: ${houseid} is not match.` });
    }

});

async function cron() {
    console.log(`[${new Date().toLocaleString()}] >> 更新資料中，網頁可以正常使用`);
    houses = JSON.parse(fs.readFileSync('./houses.json', 'utf-8'));

    const new_houses = await fetchHouseList();
    new_houses.forEach(function (new_house) {
        const match_house = houses.find(function (old_house) {
            return old_house.houseid === new_house.houseid;
        });
    
        if (match_house) {
            Object.assign(match_house, new_house);
        } else {
            houses.push(new_house);
        }
    });
    fs.writeFile('./houses.json', JSON.stringify(houses, null, 4), 'utf8', function () {});
    console.log(`[${new Date().toLocaleString()}] << 資料更新完畢`);
}

app.listen('4444', () => {
    console.log('Node.js is Running');
    
    cron();
    setInterval(cron, 10 * 60 * 1000);
});