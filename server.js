// Environment information
require("dotenv").config();
// Using express: http://expressjs.com/
const express = require("express");
// Create the app
const app = express();
const rp = require("request-promise");

// Helper function to save data from response
const saveData = (jsonData) => {
    console.log("Saving it on disk because CoinMarketCap are cheap.");
    let fs = require("fs");
    fs.writeFile("test.json", jsonData, function (err) {
        if (err) {
            console.log(err);
        }
    });
};

// Set up the server
// process.env.PORT is related to deploying on heroku
const server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
    let host = server.address().address;
    let port = server.address().port;
    console.log("Example app listening at http://" + host + ":" + port);
}

//REDDIT------------------------------------------------------------------------------------------------
app.get("/reddit", (req, res) => {
    let subreddit = req.query.subreddit;
    const requestOptions = {
        method: "GET",
        uri: "https://reddit.com/r/" + subreddit + ".json",
        json: true,
    };
    console.log("This is the request", requestOptions);
    rp(requestOptions)
        .then((response) => {
            // console.log('Attempting to save response');
            // saveData(response.json());
            res.send(response); // send response to sketch.js (the client)
        })
        .catch((err) => {
            console.log("API call error:", err.message);
        });
});

//END REDDIT--------------------------------------------------------------------------------------------

//COINMARKETCAP-----------------------------------------------------------------------------------------

app.get("/coinmarket", (req, res) => {
    console.log(req.query);
    let sorting = req.query.sort;
    const requestOptions = {
        method: "GET",
        uri:
            "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?sort=" +
            sorting,
        qs: {
            start: "1",
            limit: "5000",
            convert: "USD",
        },
        headers: {
            "X-CMC_PRO_API_KEY": process.env.COIN_MARKET_CAP_API,
        },
        json: true,
        gzip: true,
    };

    console.log("This is the request:", requestOptions);

    rp(requestOptions)
        .then((response) => {
            // console.log('Attempting to save response');
            // saveData(response.json());
            res.send(response); // send response to sketch.js (the client)
        })
        .catch((err) => {
            console.log("API call error:", err.message);
        });
});
//END COINMARKETCAP-------------------------------------------------------------------------------------

// use as home ('/')
app.use(express.static("public"));

/* This part should request the data from API */
// "http://localhost:3001/data"
// "http://localhost:3001/data?q=veganska-fiskpinnar"
// "http://google.com/search?q=veganska-fiskpinnar"

// Requests from sketch.jst
// "http://localhost:3001/data?coin=btc"
// -------------------------
