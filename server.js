// Environment information
require("dotenv").config();
// Using express: http://expressjs.com/
const express = require("express");
// Create the app
const app = express();
const rp = require("request-promise");

// get the data
var dir = require('node-dir');

let bucket = [];
let idx = 0;
dir.readFiles("data/coinmarketcap",
    function(err, content, next) {
        if (err) throw err;
        console.log('Reading file: ', idx++);
        
        // console.log('content:', content);  // get content of files
        bucket.push(JSON.parse(content));
        next();
    },
    function(err, files){
        if (err) throw err;
        //console.log('finished reading files:', bucket.length, files); // get filepath 
   });  


// Set up the server-------------------------------------------------------------------------------
// process.env.PORT is related to deploying on heroku
const server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
    let host = server.address().address;
    let port = server.address().port;
    console.log("Example app listening at http://" + host + ":" + port);
}

//REDDIT
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
            res.send(response); // send response to sketch.js (the client)
        })
        .catch((err) => {
            console.log("API call error:", err.message);
        });
});

//COINMARKETCAP
app.get("/coinmarket", (req, res) => { 
   res.send({ data: bucket }); // send response to sketch.js (the client)
});

// use as home ('/')
app.use(express.static("public"));

/* This part should request the data from API */
// "http://localhost:3001/data"
// "http://localhost:3001/data?q=veganska-fiskpinnar"
// "http://google.com/search?q=veganska-fiskpinnar"

// Requests from sketch.jst
// "http://localhost:3001/data?coin=btc"
// -------------------------
