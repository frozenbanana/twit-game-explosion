/* Global Variabels */
console.log("Running sketch2.js");

const getApiData = async (api_url) => {
    let api_link = "http://localhost:3001/" + api_url;
    console.log("Accessing api data for: ", api_link);

    // It was a promise, but await-ing it turned it into a Response
    const response = await fetch(api_link);

    // Returning a promise since it says async (api_type)
    return response.json().then((json) => json.data);
};

// GET TOP 10 CURRENCIES
let api_data = [];
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
                    //volume_24h: null,
                    percent_change_24h: null,
                    timestamp: null,
                    comments_in_interval: 0
                };

                coinObj.name = top10[i].name;    
                //coinObj.volume_24h = top10[i].quote.USD.volume_24h;    
                coinObj.percent_change_24h = top10[i].quote.USD.percent_change_24h;  
                coinObj.timestamp = new Date(top10[i].last_updated).getTime() / 1000;
                coins.push(coinObj);
            }

            coinmarketTop10.push(coins);
        });

    })
    .catch((err) => {
        console.log("getApiData::Failed to retreive data:", err);
    });

//GET REDDIT SHIT
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

calcColour = (activity, avg_activity) => {
    colorMode(HSB);

    //  ->  sat increases with higher than average activity
    //  ->  brightness decreases with lower than average activity
    
    percent_change = (activity/avg_activity - 1.0) * 100;

    let sat = (percent_change > 0) ? percent_change : 0;
    let bri = (percent_change < 0) ? percent_change : 0;

    return color(0, sat, 100-bri)
}

drawGraphLegend = (name, max_change, bar_mod, pos_x, pos_y) => {
    noFill();
    stroke(color('white'));
    
    //Place out scale
    let scale_length = 2*max_change*bar_mod;
    rect(pos_x - 10, pos_y - (scale_length/2), 1, scale_length);

    //Place out text
    text(name, pos_x - 10, pos_y + (scale_length/2) + 15);

    for(let i = max_change; i >= -max_change; i=i-10) {
        let text_s = i.toString() + "%";
        let text_x = pos_x - 40;
        let text_y = pos_y + i*bar_mod;
        text(text_s, text_x, text_y);
    }

};

drawGradientLegend = (posx, posy) => {
    //Background
    fill(color('white'));
    stroke(color('white'));
    rect(posx, posy, 200, 100);

    //Gradent Rectangle     //TODO Next: https://p5js.org/examples/color-linear-gradient.html
    fill(color('white'));
    stroke(color('black'));
    rect(posx+10, posy+10, 180, 40);

    //Text
};

function setup() {
    let width = 1280;
    let height = 2800;
    createCanvas(width, height);
    background(0);
    textSize(10);
    

    // Assignment of global variables
    baseX = 50;
    baseY = 175;
    topWidth = width - 2 * baseX;
    topHeight = height - 1 * baseY;
}

function draw() {
    console.log("draw() called. ");
    
    
    if (coinmarketTop10.length > 0) {
        console.log(`We got data. coinmarket: ${coinmarketTop10.length}, reddit: ${Object.keys(redditPosts).length}`);

        /*
        //COUNT COMMENTS IN INTERVALS
        //For all dates
        for(let date_index = 0; date_index < coinmarketTop10.length; date_index++) {
            
            //For each currency
            for(let currency_index = 0; currency_index < coinmarketTop10[date_index].length; currency_index++){
                //Read reddit comments that happened before current date
                //Once current date is reached, stop and move to next date
                let date_iter = 0;
                let curr_key = Object.keys(redditPosts)[currency_index];
                while(redditPosts[curr_key][date_iter] && 
                    redditPosts[curr_key][date_iter].timestamp < coinmarketTop10[date_index][currency_index].timestamp) {
                    // console.log(`date_iter: ${date_iter}, redditPosts[curr_key][date_iter]: ${redditPosts[curr_key][date_iter]}, timestamptoCompare: ${coinmarketTop10[date_index][currency_index].timestamp}`);
                    
                    coinmarketTop10[date_index][currency_index].comments_in_interval += redditPosts[curr_key][date_iter].num_comments;
                    date_iter++;
                }
            }
        }
        */

        //FIND THE LARGEST CHANGE IN VALUE
        let max_change = 0;
        for(let i = 0; i < coinmarketTop10.length; i++){
            for(let k = 0; k < coinmarketTop10[i].length; k++){
                if(max_change < Math.abs(coinmarketTop10[i][k].percent_change_24h)){
                    max_change = Math.abs(coinmarketTop10[i][k].percent_change_24h);
                }
            }
        }

        console.log('max', max_change);
       
        //DRAW DIAGRAMS
        let num_of_dates = coinmarketTop10.length;
        let num_of_currencies = coinmarketTop10[0].length;
        max_change = Math.ceil(max_change/10)*10;   //round up to closest 10
        let bar_mod = 5;
        
        //Currency graphs
        for (let currency_index = 0; currency_index < num_of_currencies; currency_index++) {
            let y = (baseY + currency_index * (topHeight / num_of_currencies));

            //Bars
            for (let date_index = 0; date_index < num_of_dates; date_index++) {
                let x = baseX + date_index * (topWidth / num_of_dates);

                stroke(color('black'));
                fill(calcColour(100, 10));
                //ellipse(x, y, 5);
                let bar_length = -coinmarketTop10[date_index][currency_index].percent_change_24h;   //minus(-) because everything is inverted on canvas
                bar_length = (bar_length/max_change) * (max_change*bar_mod);
                rect(x, y, 10, bar_length);
            }

            drawGraphLegend(
                coinmarketTop10[0][currency_index].name,
                max_change, 
                bar_mod, 
                baseX, 
                y
            );
            drawGradientLegend(1000, 20);
        }

        //Title
        textSize(20);
        text("Percentual change in\nvalue during 24 hours", (topWidth/2)-baseX, 25);
        
        noLoop();   
    }
    
}