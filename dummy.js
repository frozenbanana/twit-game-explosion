console.log("HEWWWOOOO");

module.exports = {

    requestOptionsTest : {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map',
        qs: {
          'symbol': 'BTC,USDT,BNB'
        },
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_API
        },
        json: true,
        gzip: true
    }, 
};

//-----------------

function draw() {
    //Draw dummy
}