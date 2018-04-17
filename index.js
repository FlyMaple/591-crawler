const request = require('request');

let step_row = 30;
let total_rows = 565;
let total_page = (total_rows % step_row) ? (Math.floor(total_rows / step_row) + 1) : (total_rows / step_row);
console.log(`Page: ${total_page}`);

function run() {
    
    for (let page=0; page <= total_page; page++) {
        let timestamp = Date.now();
        let first_row = page * step_row;
        let url = `https://sale.591.com.tw/home/search/list?type=2&&shType=list&pattern=3,4&regionid=4&price=$_900$&order=unitprice_asc&section=371&firstRow=${first_row}&totalRows=${total_rows}&timestamp=${timestamp}`

        if (first_row < total_rows) {
            console.log(url);
        }
    }
}

// run();

request('https://sale.591.com.tw/home/search/list?type=2&&shType=list&pattern=3,4&regionid=4&price=$_900$&order=unitprice_asc&section=371&firstRow=0&totalRows=565&timestamp=1523958577064', function (err, res, body) {
    const data = JSON.parse(body);
    const {house_list, total, recommend_list} = data.data;

    house_list.forEach(function (house) {
        const {houseid, kind_name, shape_name, title, has_carport, room, floor, mainarea, photo_url, nick_name, area, houseage, address, unitprice, price} = house;

        console.log(`房屋編號: ${houseid}`);
        console.log(`住宅類型: ${kind_name}`);
        console.log(`房屋類型: ${shape_name}`);
        console.log(`標題: ${title}`);
        console.log(`車位: ${has_carport ? '有' : '無'}`);
        console.log(`格局: ${room}`);
        console.log(`樓層: ${floor}`);
        console.log(`主建物: ${mainarea}`);
        console.log(`圖片: ${photo_url}`);
        console.log(`聯絡: ${nick_name}`);
        console.log(`總坪數: ${area}`);
        console.log(`屋齡: ${houseage}`);
        console.log(`地址: ${address}`);
        console.log(`單坪價: ${unitprice}`);
        console.log(`總價: ${price}`);
        console.log(`================================`);
    });
    
    // console.log(JSON.stringify(data, null, 4));
});
