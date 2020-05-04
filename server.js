// Environment information
require("dotenv").config();
// Using express: http://expressjs.com/
const express = require("express");
// Create the app
const app = express();
const rp = require("request-promise");

// get the data
var dir = require('node-dir');
const readFiles = (path, isDirty) => {
    let bucket = [];
    let idx = 0;
    dir.readFiles(path,
        function(err, content, next) {
            if (err) throw err;
            console.log('Reading file from ', path,': ', idx++);
            
            // console.log('content:', content);  // get content of files
            bucket.push(JSON.parse(content));
            next();
        },
        function(err, files){ // <- final call
            if (err) throw err;

            if (isDirty) bucket = cleanRedditData(bucket);
            
            return bucket;
        }    
    );

}

let idArray = [];
const containsObjectByKey = (array, obj, key) => {
    array.forEach(element => {
        if ( element[key] === obj[key] ) {
            return true; //Object found in array
        }
    });

    let seen = new Set();
    let hasDuplicates = array.some(function(currentObject) {
        return seen.size === seen.add(currentObject).size;
    });

    console.log(`${obj[key]} is not found. hasDuplicates: ${hasDuplicates}`);
    idArray.push(obj[key] );
    return false; // obj is not present in array
}


function cleanRedditData(subredditfiles) {
    let uniquePosts = [];
    let cleanedCounter = 0;
    subredditfiles.forEach(file => {
        file.data.children.forEach(post => {
            // make sure post is not duplication 

            //console.log("post id: ", post.data.id);

            if (!containsObjectByKey(uniquePosts, post.data, 'id') ) {
                uniquePosts.push(post.data)
            } else {
                cleanedCounter++;
            }
        })
    });
    console.log('Cleaned ', cleanedCounter, ' posts of',  subredditfiles.map(file => file.data.children.length).reduce( (tot, cur) => tot+cur, 0));
    console.log('This is left', uniquePosts.length);
    console.log('Number of Unique ids', idArray.length);
    let findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) != index);
    console.log('Number of duplicates (double checking)', findDuplicates(idArray).length);
    return uniquePosts; 
}

let coinmarketBucket = readFiles('data/coinmarketcap', false);

const filePath = 'data/reddit/';
let redditBucket = {
    // tether:              readFiles(filePath + 'tether', true),
    bitcoin:             readFiles(filePath + 'bitcoin', true),
    // ethereum:            readFiles(filePath + 'ethereum', true),
    // litecoin:            readFiles(filePath + 'litecoin', true),
    // bitcoincash:         readFiles(filePath + 'bitcoincash',true ),
    // eos:                 readFiles(filePath + 'eos', true),
    // ripple:              readFiles(filePath + 'ripple', true),
    // bitcoinsv:           readFiles(filePath + 'bitcoinsv', true),
    // ethereumclassic:     readFiles(filePath + 'ethereumclassic', true),
    // tron:                readFiles(filePath + 'tronix', true),
};


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
    res.send({ data: redditBucket }); // send response to sketch.js (the client)
 });

 app.get("/reddit/:subreddit", (req, res) => { 
    res.send({ data: redditBucket[req.params.subreddit] }); // send response to sketch.js (the client)
 });

// app.get("/reddit", (req, res) => {
//     let subreddit = req.query.subreddit;
//     const requestOptions = {
//         method: "GET",
//         uri: "https://reddit.com/r/" + subreddit + ".json",
//         json: true,
//     };
//     console.log("This is the request", requestOptions);
//     rp(requestOptions)
//         .then((response) => {
//             res.send(response); // send response to sketch.js (the client)
//         })
//         .catch((err) => {
//             console.log("API call error:", err.message);
//         });
// });

//COINMARKETCAP
app.get("/coinmarket", (req, res) => { 
   res.send({ data: coinmarketBucket }); // send response to sketch.js (the client)
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
