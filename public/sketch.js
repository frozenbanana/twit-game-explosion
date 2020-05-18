/* Global Variabels */
// Server call to Twitter API
let reddit_data = [];
let api_data = [];

/*
const getTwitterData = async () => {
    const response = await fetch(
        "http://dummy.restapiexample.com/api/v1/employees"
    );
    return await response.json().then((json) => {
        console.log("json has been gathered. Returning data.", json.data);
        twitter_data = json.data;
    }); //Extract JSON from the http response
};
*/

const getApiData = async (api_url) => {
    let api_link = "http://localhost:3001/" + api_url;
    console.log("Accessing api data for: ", api_link);

    // It was a promise, but await-ing it turned it into a Response
    const response = await fetch(api_link);

    // Returning a promise since it says async (api_type)
    return response.json().then((json) => json.data);
};

console.log("Trying to get data...");

// Custom interface to raw api data
coinmarketTop10 = [];
getApiData("coinmarket")
    .then((data) => {
        console.log("getApiData::Successfully retreived coinmarket data:", data);
        api_data = data;

        api_data.forEach(dataAtTimestamp => {
            let top10 = dataAtTimestamp.data.slice(0, 10);
            
            let coins = [];
            for (let i = 0; i < top10.length; i++) {
                // Interface
                coinObj = {
                    name: null,
                    volume_24h: null,
                    timestamp: null,
                    comments_in_interval: 0
                };

                coinObj.name = top10[i].name;    
                coinObj.volume_24h = top10[i].quote.USD.volume_24h;    
                coinObj.timestamp = new Date(top10[i].last_updated).getTime() / 1000;
                coins.push(coinObj);
            }

            coinmarketTop10.push(coins);
        });
        
    })
    .catch((err) => {
        console.log("getApiData::Failed to retreive data:", err);
    });

//-----

let redditPosts = {    
    tether:             [],
    bitcoin:            [],
    ethereum:           [],
    litecoin:           [],
    bitcoincash:        [],
    eos:                [],
    ripple:             [],
    bitcoinsv:          [],
    ethereumclassic:    [],
    tron:               [],
};

getApiData("reddit/")
    .then((data) => {
        console.log("getApiData::Successfully retreived from reddit data", data);

        //Go through the different currencies

        let coinKeys = Object.keys(data);
        
        for(let i = 0; i < coinKeys.length; i++) {
            const currentCoin = data[coinKeys[i]];
            for(let date_index = 0; date_index < currentCoin.length; date_index++) {
                let postObj = {
                    timestamp: null,
                    num_comments: null
                };
                postObj.timestamp = currentCoin[date_index].created_utc;
                postObj.num_comments = currentCoin[date_index].num_comments;
                redditPosts[coinKeys[i]].push(postObj);
            }
        }
    
        console.log("Filtered reddit data: ", redditPosts); 

    })
    .catch((err) => {
        console.log("Failed to retreive data", err);
    });

//-----GLOBALS-------------------------------------------------------------------------------

let baseX;
let baseY;
let topWidth;
let topHeight;

/*
coinmarketTop10:  [dates][currency] {
                    .name
                    .volume_24h
                    .timestamp
                    .comments_in_interval
                    }
*/
/*
redditPosts:      [currency][post] {
                    .timestamp
                    .num_comments
                    }
*/

//-----HELPER FUNCTIONS ----------------------------------------------------------------------

drawLedger = (names, posx, posy) => {
    noFill();
    rect(posx, posy, 100, names.length * 15 + 20);
    stroke(color('white'));
    for (let i = 0; i < names.length; i++) {
        stroke(colors[i]);
        fill(colors[i]);
        text(names[i], posx+5, 20 + i * 15);
    }
};


function setup() {
    createCanvas(1280, 800);
    background(0);
    textSize(10);
    colorMode(HSB);
    colors = [];
    for (let i = 0; i < 10; i++) {
        colors.push(color(i * 25, 50, 150));
    }

    // Assignment of global variables
    baseX = 150;
    baseY = 50;
    topWidth = width - 2 * baseX;
    topHeight = height - 2 * baseY;
}

function draw() {
    console.log("draw() called. ");
    // let x = random(0, width);
    // let y = random(0, height);
    

    if (coinmarketTop10.length > 0 && redditPosts['bitcoin'].length > 0) {
        console.log(`We got data. coinmarket: ${coinmarketTop10.length}, reddit: ${Object.keys(redditPosts).length}`);

        //COUNT COMMENTS IN INTERVALS
        //For all dates

        /*for(let date_index = 0; date_index < coinmarketTop10.length; date_index++) {
            
            //For each currency
            for(let currency_index = 0; currency_index < coinmarketTop10[date_index].length; currency_index++){
                //Read reddit comments that happened before current date
                //Once current date is reached, stop and move to next date
                let timeStamp_Registered_Comments;
                let date_iter = 0;
                let curr_key = Object.keys(redditPosts)[currency_index];
                while(redditPosts[curr_key][date_iter] && 
                    redditPosts[curr_key][date_iter].timestamp < coinmarketTop10[date_index][currency_index].timestamp) {
                    // console.log(`date_iter: ${date_iter}, redditPosts[curr_key][date_iter]: ${redditPosts[curr_key][date_iter]}, timestamptoCompare: ${coinmarketTop10[date_index][currency_index].timestamp}`);
                    
                    coinmarketTop10[date_index][currency_index].comments_in_interval += redditPosts[curr_key][date_iter].num_comments;
                    date_iter++;
                }
            }
        }*/

        
        let crypto_Date_Reached = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // to keep track of each

        for(let date_index = 0; date_index < coinmarketTop10.length; date_index++) {
            
            //For each currency
            for(let currency_index = 0; currency_index < coinmarketTop10[date_index].length; currency_index++){
                //Read reddit comments that happened before current date
                //Once current date is reached, stop and move to next date
                let curr_key = Object.keys(redditPosts)[currency_index];
                
                while(redditPosts[curr_key][crypto_Date_Reached[currency_index]] &&
                    redditPosts[curr_key][crypto_Date_Reached[currency_index]].timestamp < coinmarketTop10[date_index][currency_index].timestamp) {
                    //console.log("Comments in Interval", curr_key, coinmarketTop10[date_index][currency_index].timestamp); //To see the how many comments have the same timestamps        
                    coinmarketTop10[date_index][currency_index].comments_in_interval += redditPosts[curr_key][crypto_Date_Reached[currency_index]].num_comments;
                    crypto_Date_Reached[currency_index]++;
                }
                //console.log("Comments in Interval", curr_key, coinmarketTop10[date_index][currency_index].comments_in_interval); //Comments in each interval
            }
        }
       

        //FIND MAX VALUE FOR FORMATTING
        let max_val = 0;
        for(let i = 0; i < coinmarketTop10.length; i++){
            for(let k = 0; k < 2; k++){ //Only consider the top 2 currencies
                if(max_val < coinmarketTop10[i][k].volume_24h){
                    max_val = coinmarketTop10[i][k].volume_24h;
                }
            }
        }

        console.log('New NormFact', max_val); 
        let normFact = max_val;
        let numOfDates = coinmarketTop10.length;

        //Balls
        for (let date_index = 0; date_index < numOfDates; date_index++) {

            let x = baseX + date_index * (topWidth / numOfDates);
            
            for (let currency_index = 0; currency_index < coinmarketTop10[date_index].length; currency_index++) {
                let y = height - baseY - (coinmarketTop10[date_index][currency_index].volume_24h / normFact) * topHeight;
                stroke(color('black'));
                fill(colors[currency_index]);
                //ellipse(x, y, (10 + (coinmarketTop10[date_index][currency_index].comments_in_interval * 0.025)));
                let rect_size = 1 + (coinmarketTop10[date_index][currency_index].comments_in_interval * 0.225);
                rect(x, y, 10, rect_size);
            }
        }

        //Names
        let names = coinmarketTop10[0].map(a => a.name);
        drawLedger(names, 25, 5);
        
        noLoop();   
    }
}

/*function graphLayout()
{  
    let p1 = width;
    let p2 = height*0.5;
    stroke(255);
    line(0, p2, p1, p2);
}*/