const request = require('request');

let step_row = 30;
let total_rows;
let total_page;

let ignore_titles = ['套房'];
let ignore_addresses = ['明湖', '武陵路', '成德路', '高峰路', '富群街', '中華路三段', '振興路', '中山路640巷', '田美三街', '柴橋路', '寶新路', '光華二街', '林森路'];
let max_house_age = 25;

process.on('unhandledRejection', error => {
    // Prints "unhandledRejection woops!"
    console.log('unhandledRejection', error);
});

function getPageListData(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (err, res, body) {
            const data = JSON.parse(body);
            const { house_list, recommend_list } = data.data;

            resolve(house_list);
        });
    });
}

function getTotalPage() {
    let timestamp = Date.now();
    let url = `https://sale.591.com.tw/home/search/list?type=2&&shType=list&pattern=3,4&regionid=4&price=$_900$&order=unitprice_asc&section=371&firstRow=0`;

    return new Promise(function (resolve, reject) {
        request(url, function (err, res, body) {
            const data = JSON.parse(body);
            const { total } = data.data;

            total_rows = total;
            total_page = (total_rows % step_row) ? (Math.floor(total_rows / step_row) + 1) : (total_rows / step_row);

            resolve();
        });
    });
}

async function getHouseList() {
    return new Promise(async function (resolve, reject) {
        let house_list = [];

        for (let page = 0; page <= total_page; page++) {
            let timestamp = Date.now();
            let first_row = page * step_row;
            let url = `https://sale.591.com.tw/home/search/list?type=2&&shType=list&pattern=3,4&regionid=4&price=$_900$&order=unitprice_asc&section=371&firstRow=${first_row}&totalRows=${total_rows}&timestamp=${timestamp}`

            if (first_row < total_rows) {
                console.log(`>> 正在獲取 Page ${page + 1} ...`);
                const list = await getPageListData(url);
                console.log(`\t<<成功獲取...`);
                house_list = house_list.concat(list);
            }
        }
        resolve(house_list);
    });
}

function filterHouseList(house_list) {
    const filter_house_list = [];

    house_list.forEach(function (house) {
        const { nick_name, houseage, address, title } = house;

        let ignore = false;

        if (nick_name && (houseage <= max_house_age)) {
            ignore_addresses.forEach(function (ignore_address) {
                if (address.indexOf(ignore_address) !== -1) {
                    ignore = true;
                }
            });

            ignore_titles.forEach(function (ignore_title) {
                if (title.indexOf(ignore_title) !== -1) {
                    ignore = true;
                }
            });

            if (!ignore) {
                filter_house_list.push(house);
            }
        }
    });

    return filter_house_list;
}

async function run() {
    return new Promise(async function (resolve, reject) {
        await getTotalPage();
        console.log(`Rows: ${total_rows}`);
        console.log(`Pages: ${total_page}`);

        const house_list = await getHouseList();
        const house_list_filter = filterHouseList(house_list);

        resolve(house_list_filter);
        // console.log(JSON.stringify(house_list_filter, null, 4));
        // house_list_filter.forEach(function (house) {
        //     const { houseid, kind_name, shape_name, title, has_carport, room, floor, mainarea, photo_url, nick_name, area, houseage, address, unitprice, price } = house;

        //     console.log(`房屋編號: ${houseid}`);
        //     console.log(`住宅類型: ${kind_name}`);
        //     console.log(`房屋類型: ${shape_name}`);
        //     console.log(`標題: ${title}`);
        //     console.log(`車位: ${has_carport ? '有' : '無'}`);
        //     console.log(`格局: ${room}`);
        //     console.log(`樓層: ${floor}`);
        //     console.log(`主建物: ${mainarea}`);
        //     console.log(`圖片: ${photo_url}`);
        //     console.log(`聯絡: ${nick_name}`);
        //     console.log(`總坪數: ${area}`);
        //     console.log(`屋齡: ${houseage}`);
        //     console.log(`地址: ${address}`);
        //     console.log(`單坪價: ${unitprice}`);
        //     console.log(`總價: ${price}`);
        //     console.log(`================================`);
        // });
    });
}

// run();

module.exports = {
    run,
};