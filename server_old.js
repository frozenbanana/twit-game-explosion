// HTTP Portion
let http = require('http');
// Path module
let path = require('path');
// Using the filesystem module
let fs = require('fs');


// Framework for server creation
let express = require('express');
// Fix cross origin errors when calling another site (API Calls)
let cors = require('cors');
// Create requests to API
let request = require('request');
let bodyParser = require('body-parser')
let app = express();
app.use(bodyParser());
app.use(cors());

app.get('/', (req, res) => {
    // What did we request?
    let pathname = req.url;

    // If blank let's ask for index.html
    if (pathname == '/') {
        pathname = '/index.html';
    }

    // Ok what's our file extension
    let ext = path.extname(pathname);

    // Map extension to file type
    let typeExt = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css'
    };
    // What is it?  Default to plain text
    let contentType = typeExt[ext] || 'text/plain';
    
    // User file system module
    fs.readFile(__dirname + pathname,
        // Callback function for reading
         (err, data) => {
            // if there is an error
            if (err) {
                res.writeHead(500);
                return res.end('Error loading ' + pathname);
            }
            // Otherwise, send the data, the contents of the file
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    );
});

app.get('/data/crypto', (req, res) =>{
    request('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', (error, response, body) => {
        if (!error && response.statusCode == 200) {
            let info = JSON.parse(body)
            // do more stuff
            res.send(info);
        }
    })
});

app.listen(3000);
console.log("The server is now running on port 3000.");

// let server = http.createServer(handleRequest);
// server.listen(8080);

// console.log('Server started on port 8080');
