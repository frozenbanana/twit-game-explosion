// Environment information
require('dotenv').config();
// Using express: http://expressjs.com/
const express = require('express');
// Create the app
const app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
const server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  let host = server.address().address;
  let port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

const rp = require('request-promise');
const requestOptions = {
  method: 'GET',
  uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  qs: {
    'start': '1',
    'limit': '5000',
    'convert': 'USD'
  },
  headers: {
    'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_API
  },
  json: true,
  gzip: true
};

/* This part should request the data from API */
app.get('/data', (req, res) => {
    rp(requestOptions).then(response => {
        res.send(response);
    }).catch((err) => {
      console.log('API call error:', err.message);
    });
});


