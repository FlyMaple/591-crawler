/** LIB */
var request = require('request');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');

function _trim(str) {
    return str.trim().replace(/ /gi, '').replace(/\t/gi, '').replace(/\r\n/gi, '');
}

function init() {
    var cheerioOptions = {
        normalizeWhitespace: true
    };

    var url = 'https://sale.591.com.tw/index.php?module=search&action=rslist&is_new_list=1&type=2&searchtype=1&region=4&section=370,371,372&kind=9&saleprice=0&listview=img&order=posttime&orderType=desc';
    request(url, function (err, res, body) {
        var resJson = JSON.parse(body);
        var data = resJson.main;
        
        var $ = cheerio.load(data);

        var $items = $('.shList');

        $items.each(function (index, item) {
            var $url = $('.shInfo .info .left a', item);
            var $title = $('.shInfo .info .right .title a strong', item);
            var $address = $('.shInfo .info .right p:nth-child(2)', item);
            var $desc = $('.shInfo .info .right p:nth-child(3)', item);
            var $gry = $('.shInfo .info .right .fc-gry', item);
            var $area = $('.shInfo .area', item);
            var $price = $('.shInfo .price', item);
            var $pattern = $('.shInfo .pattern', item);

            var orgUrl = _trim($url.attr('href'));
            var title = _trim($title.text());
            var address = _trim($address.text());
            var desc = _trim($desc.text());
            var gry = _trim($gry.text());
            var area = _trim($area.text());
            var price = _trim($price.text());
            var pattern = _trim($pattern.text());

            if ($price.find('.down').length > 0) {
                var oldprice = _trim($price.find('.oldprice').text());
                var down = _trim($price.find('.down').text());
                
                price = $oldprice + '  下殺 >> '+ down;
            }

            if (orgUrl.indexOf('http') !== 0) {
                orgUrl = 'https://sale.591.com.tw/' + orgUrl;
            }

            console.log('名　　稱:  ' + title);
            console.log('地　　址:  ' + address);
            console.log('詳　　細:  ' + desc);
            console.log('仲　　介:  ' + gry);
            console.log('坪　　數:  ' + area);
            console.log('金　　額:  ' + price);
            console.log('瀏覽人數:  ' + pattern);
            console.log('原始連結:  ' + orgUrl);
            console.log('===========================================================');
        })
    });
}

/** MAIN */
var ep = new eventproxy();
var lanch = false; 

init();