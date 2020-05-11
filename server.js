// Environment information
require("dotenv").config();
// Using express: http://expressjs.com/
const express = require("express");
// Create the app
const app = express();
const fs = require('fs').promises;

// get the data
var dir = require('node-dir');
const readFiles = async (path, isDirty) => {
    let bucket = [];
    let idx = 0;
    return new Promise( (resolve, reject) => {
        dir.readFiles(path,
            function(err, content, next) {
                if (err) throw err;
                //console.log('Reading file from ', path,': ', idx++);
                
                // if (path === 'data/coinmarketcap')
                //     console.log('content:', content);  // get content of files

                bucket.push(JSON.parse(content));
                next();
            },
            function(err, files){ // <- final call
                if (err) throw reject(err);

                if (isDirty) bucket = cleanRedditData(bucket, path.substring(path.indexOf('/')+1));
                
                resolve(bucket);
            }
            );
        });

}

const containsObjectByKey = (array, obj, key) => {
    for (let i = 0; i < array.length; i++) {
        if ( array[i].id === obj[key] ) {
            return true; //Object found in array
        }
    }

    return false; // obj is not present in array
}

function cleanRedditData(subredditfiles, coinName) {
    let uniquePosts = [];
    let cleanedCounter = 0;
    subredditfiles.forEach(file => {
        file.data.children.forEach(post => {
            // Make sure post is not duplication 
            if (!containsObjectByKey(uniquePosts, post.data, 'id') ) {
                // console.log('So lets add it.');
                uniquePosts.push(post.data)
            } else {
                cleanedCounter++;
            }
        })
    });
    let totalPosts = subredditfiles.map(file => file.data.children.length).reduce( (tot, cur) => tot+cur, 0);
    uniquePosts.sort((a, b) => {return a.created_utc - b.created_utc});
    console.log(`Successfully loaded \x1b[36m${coinName}\x1b[0m with \x1b[32m${uniquePosts.length}\x1b[0m unique of \x1b[33m${totalPosts}\x1b[0m post total.`);
    return uniquePosts; 
}

let coinmarketBucket = {};
readFiles('data/coinmarketcap', false).then(bucket => { 
    console.log(`Successfully loaded \x1b[36mcoinmarketcap\x1b[0m with \x1b[32m${bucket.length}\x1b[0m unique of \x1b[32m${bucket.length}\x1b[0m post total.`);
    coinmarketBucket = bucket; 
});

const filePath = 'data/reddit/';
let redditBucket = {    
    tether:             {},
    bitcoin:            {},
    ethereum:           {},
    litecoin:           {},
    bitcoincash:        {},
    eos:                {},
    ripple:             {},
    bitcoinsv:          {},
    ethereumclassic:    {},
    tron:               {},
};
// Read async data from files
readFiles(filePath + 'tether',           true).then(bucket => redditBucket.tether           = bucket);
readFiles(filePath + 'bitcoin',          true).then(bucket => redditBucket.bitcoin          = bucket);
readFiles(filePath + 'ethereum',         true).then(bucket => redditBucket.ethereum         = bucket);
readFiles(filePath + 'litecoin',         true).then(bucket => redditBucket.litecoin         = bucket);
readFiles(filePath + 'bitcoincash',      true).then(bucket => redditBucket.bitcoincash      = bucket);
readFiles(filePath + 'eos',              true).then(bucket => redditBucket.eos              = bucket);
readFiles(filePath + 'ripple',           true).then(bucket => redditBucket.ripple           = bucket);
readFiles(filePath + 'bitcoinsv',        true).then(bucket => redditBucket.bitcoinsv        = bucket);
readFiles(filePath + 'ethereumclassic',  true).then(bucket => redditBucket.ethereumclassic  = bucket);
readFiles(filePath + 'tronix',           true).then(bucket => redditBucket.tron             = bucket);


// Set up the server-------------------------------------------------------------------------------
// process.env.PORT is related to deploying on heroku
const server = app.listen(process.env.PORT || 3001, listen);

// This call back just tells us that the server has started
function listen() {
    let host = server.address().address;
    let port = server.address().port;
    console.log("Example app listening at http://" + host + ":" + port);
}

//REDDIT
app.get("/reddit", (req, res) => { 
    console.log('reddit route called!');

    res.send({ data: redditBucket }); // send response to sketch.js (the client)
 });

 app.get("/reddit/:subreddit", (req, res) => { 
    console.log('reddit/',req.params.subreddit ,'called!');
    res.send({ data: redditBucket[req.params.subreddit] }); // send response to sketch.js (the client)
 });


//COINMARKETCAP
app.get("/coinmarket", (req, res) => { 
   console.log('coinmarket route called!');
   res.send({ data: coinmarketBucket }); // send response to sketch.js (the client)
});

// use as home ('/')
app.use(express.static("public"));
