/* Global Variabels */

//import { text } from "express";

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
                    percent_change_1h: null,
                    timestamp: null,
                    date: [null, null],
                    comments_in_interval: 0,
                };

                coinObj.name = top10[i].name;    
                //coinObj.volume_24h = top10[i].quote.USD.volume_24h;    
                coinObj.percent_change_1h = top10[i].quote.USD.percent_change_1h;  
                coinObj.timestamp = new Date(top10[i].last_updated).getTime() / 1000;
                coinObj.date[0] = new Date(top10[i].last_updated).getDate();
                coinObj.date[1] = new Date(top10[i].last_updated).getMonth();
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

    //  ->  sat is 0 with average activity
    //  ->  sat increases with higher than average activity 
    
    let change = (activity/avg_activity - 1.0) * 100;

    //The reddest color represents this percentage
    let max_percent = 500;
    let mod = max_percent/100;

    let sat = Math.max(Math.min(change/mod, 100), 0);

    return color(0, sat, 100);
}

drawGraphLegend = (name, max_change, step_length, bar_mod, pos_x, pos_y) => {
    //console.log(name, max_change, );

    noFill();
    stroke(color('white'));

    let scale_length = 2*max_change*bar_mod;

    //Place out text (Name
    textSize(30);
    text(name, pos_x + (topWidth/2), pos_y - (scale_length/2) - 30);
    
    //VERTICAL AXIS
    //Place out scale
    
    rect(pos_x - 10, pos_y - (scale_length/2), 1, scale_length);

    //
    fill(color('white'));
    textSize(20);
    text("Change in Percent", pos_x-80, pos_y - (scale_length/2) - 20);

    textSize(15);
    for(let i = max_change; i >= -max_change; i=i-step_length) {
        let text_s = i.toString() + "%";
        let text_x = pos_x - 40;
        let text_y = pos_y - i*bar_mod;
        text(text_s, text_x, text_y);

        rect(pos_x-10, text_y, 10, 1);
    }

    //HORIZONTAL AXIS
    noFill();
    stroke(color('white'));
    rect(pos_x - 10, pos_y + (scale_length/2), topWidth, 1);

    fill(color('white'));
    textSize(20);
    text("Date", pos_x + topWidth, pos_y + (scale_length/2) + 5);
};

function drawGradient(pos_x, pos_y, in_width, in_height, colour_a, colour_b) {
    noFill();
    // Left to right gradient
    for (let i = pos_x; i <= pos_x + in_width; i++) {
      let inter = map(i, pos_x, pos_x + in_width, 0, 1);
      let c = lerpColor(colour_a, colour_b, inter);
      stroke(c);
      line(i, pos_y, i, pos_y + in_height);
    }
}

drawGradientLegend = (pos_x, pos_y) => {
    //Background
    fill(color('white'));
    stroke(color('white'));
    rect(pos_x, pos_y, 420, 200);

    //Gradent Rectangle     //TODO: Change title to only be about %, add time axis to graph ledger
    
    let pos_x2 = pos_x+30;
    let pos_y2 = pos_y+40;

    drawGradient(pos_x2, pos_y2, 360, 80, calcColour(0, 1), calcColour(100, 1),);
    stroke(color('black'));
    noFill();
    rect(pos_x2, pos_y2, 360, 80);

    //help lines
    rect(pos_x2+0, pos_y2+60, 1, 40);
    rect(pos_x2+180,pos_y2+60, 1, 40);
    rect(pos_x2+360, pos_y2+60, 1, 40);

    //Text
    fill(color('black'));
    stroke(color('black'));

    textSize(20);
    text("Post and Comment Activity", pos_x2, pos_y2-10);

    textSize(15);
    text("Average or\nlower", pos_x2, pos_y2+130);
    text("250%\nincrease", pos_x2+150, pos_y2+130);
    text("500%\nincrease", pos_x2+300+25, pos_y2+130);
    
};

function setup() {
    let width = 2560;//1280;
    let height = 5600;//2800;
    createCanvas(width, height);
    background(0);
    textSize(10);
    

    // Assignment of global variables
    baseX = 100;//50;
    baseY = 350;//175;
    topWidth = width - 2 * baseX;
    topHeight = height - 1 * baseY;
}

function draw() {
    console.log("draw() called. ");
    
    
    if (coinmarketTop10.length > 0 && redditPosts['bitcoin'].length > 0) {
        console.log(`We got data. coinmarket: ${coinmarketTop10.length}, reddit: ${Object.keys(redditPosts).length}`);
        
        //COUNT COMMENTS IN INTERVALS
        let crypto_Date_Reached = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // to keep track of each
        //For all dates
        for(let date_index = 0; date_index < coinmarketTop10.length; date_index++) {
            
            //For each currency
            for(let currency_index = 0; currency_index < coinmarketTop10[date_index].length; currency_index++){
                //Read reddit comments that happened before current date
                //Once current date is reached, stop and move to next date
                let curr_key = Object.keys(redditPosts)[currency_index];

                while(redditPosts[curr_key][crypto_Date_Reached[currency_index]] &&
                    redditPosts[curr_key][crypto_Date_Reached[currency_index]].timestamp < coinmarketTop10[date_index][currency_index].timestamp) {
                    //console.log("Comments in Interval", curr_key, coinmarketTop10[date_index][currency_index].timestamp); //To see the how many comments have the same timestamps        
                    coinmarketTop10[date_index][currency_index].comments_in_interval += 1 + redditPosts[curr_key][crypto_Date_Reached[currency_index]].num_comments;

                    crypto_Date_Reached[currency_index]++;
                }
                //console.log("Comments in Interval", curr_key, coinmarketTop10[date_index][currency_index].comments_in_interval); //Comments in each interval
            }
        }
        

        //STATISTICS
        let max_change = 0;
        
        let comment_avg_per_time_interval = {};
        for(let i = 0; i < coinmarketTop10[0].length; i++){
            let currency = coinmarketTop10[0][i].name;
            comment_avg_per_time_interval[currency] = 0;
        }

        for(let i = 0; i < coinmarketTop10.length; i++){
            for(let k = 0; k < coinmarketTop10[i].length; k++){
                
                //Find largest percentual change
                if(max_change < Math.abs(coinmarketTop10[i][k].percent_change_1h)){
                    max_change = Math.abs(coinmarketTop10[i][k].percent_change_1h);
                }

                //Calculate comment average (skip first entry due to the comment being accumulated outside of gathering dates)
                if(i != 0){
                    let currency = coinmarketTop10[i][k].name;
                    comment_avg_per_time_interval[currency] += (coinmarketTop10[i][k].comments_in_interval / coinmarketTop10.length); 
                }
            }
        }

        //console.log('cmnt avg', comment_avg_per_time_interval);
       
        //DRAW DIAGRAMS
        let num_of_dates = coinmarketTop10.length;
        let num_of_currencies = coinmarketTop10[0].length;
        let step_length = 2;
        max_change = Math.ceil(max_change/step_length)*step_length;   //round up to closest multiple of step_length
        let bar_mod = 50;//25;
        
        //Currency graphs
        for (let currency_index = 0; currency_index < num_of_currencies; currency_index++) {
            let y = (baseY + currency_index * (topHeight / num_of_currencies));

            //Bars
            let last_date = coinmarketTop10[0][currency_index].date;
            for (let date_index = 0; date_index < num_of_dates; date_index++) {
                let x = baseX + date_index * (topWidth / num_of_dates);

                stroke(color('black'));
                fill(calcColour(
                    coinmarketTop10[date_index][currency_index].comments_in_interval,
                    comment_avg_per_time_interval[coinmarketTop10[date_index][currency_index].name]
                    ));
                //ellipse(x, y, 5);
                let bar_length = -coinmarketTop10[date_index][currency_index].percent_change_1h;   //minus(-) because everything is inverted on canvas
                bar_length = (bar_length/max_change) * (max_change*bar_mod);
                rect(x, y, 20, bar_length);

                if(last_date[0] != coinmarketTop10[date_index][currency_index].date[0]) {
                    last_date = coinmarketTop10[date_index][currency_index].date;
                    
                    stroke(color('white'));
                    fill(color('white'));
                    rect(x, (y + max_change*bar_mod - 10), 1, 10);

                    textSize(15);
                    text((last_date[0] + "/" + last_date[1]), (x-10), (y + max_change*bar_mod + 15));
                }
            }

            drawGraphLegend(
                coinmarketTop10[0][currency_index].name,
                max_change, 
                step_length,
                bar_mod, 
                baseX, 
                y
            );
        }

        //Title
        textSize(40);
        stroke(color('white'));
        fill(color('white'));
        text("Percentual change in value over 1 hour", (topWidth/2)-3*baseX, 40);
        textSize(20);
        text("*Data gathered every 3 hours", (topWidth/2)-3*baseX, 65);

        //TODO: Change title to only be about %, add time axis to graph legend

        //Gradient legend
        drawGradientLegend(2000, 20);
        
        noLoop();   
    }
    
}