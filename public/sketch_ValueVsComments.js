// import { reject } from "bluebird";

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
let prices_references = [];
getApiData("coinmarket")
    .then((data) => {
        console.log("getApiData::Successfully retreived coinmarket data:", data);
        api_data = data;
    
        
        // console.log('price references: ', prices_references);
        api_data.forEach(dataAtTimestamp => {
            let coinsByVolume = dataAtTimestamp.data;
            
            let coins = [];
            

            // TODO, use this object to filter top10.length so coinObjects are placed
            // in the right index.
            
            let coinsIdentifier = {
                tether: 825,
                bitcoin: 1,
                ethereum: 1027,
                litecoin: 2,
                eos: 1765,
                bitcoincash: 1831,
                bitcoinsv: 3602,
                ethereumclassic: 1321,
                ripple: 52,
                tron: 1958
            };
            

            for (let i = 0; i < Object.keys(coinsIdentifier).length; i++) {
                // Interface
                coinObj = {
                    name: null,
                    price: null,
                    price_reference: null,
                    timestamp: null,
                    date: [null, null],
                    comments_in_interval: 0
                };
                const coinKey = Object.keys(coinsIdentifier)[i];
                let selectedCoin = coinsByVolume.find(coin => coin.id == coinsIdentifier[coinKey]);
                coinObj.name = selectedCoin.name;    
                coinObj.price = selectedCoin.quote.USD.price;
                coinObj.price_reference = prices_references[i];
                coinObj.timestamp = new Date(selectedCoin.last_updated).getTime() / 1000;
                coinObj.date[0] = new Date(selectedCoin.last_updated).getDate();
                coinObj.date[1] = new Date(selectedCoin.last_updated).getMonth();
                coins.push(coinObj);
            }
            coinmarketTop10.push(coins);
        });

    })
    .catch((err) => {
        console.log("getApiData::Failed to retreive data:", err);
    });

//Get Reddit Data
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
let canvasX;
let canvasY;
//let topWidth;
//let topHeight;

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

function setup() {
    canvasX = 1500;
    canvasY = 4000;
    createCanvas(canvasX, canvasY);
    background(0);
    textSize(10);  

    // Assignment of global variables
    baseX = 50;
    baseY = 50;
    //topWidth = width - 2 * baseX;
    //topHeight = height - 2 * baseY;
}

function drawPointAndLine(point_x, point_y, prev_point_x, prev_point_y) {
    
    stroke(color('yellow'));
    strokeWeight(2);
    line(point_x, point_y, prev_point_x, prev_point_y);

    let radius = 5;

    stroke(color('yellow'));
    fill(color('yellow'));
    strokeWeight(3);
    //ellipse(point_x, point_y, radius);
    //ellipse(prev_point_x, prev_point_y, radius);

}

function drawGraphAxes(name, name_y, origo_x, origo_y, max_x, max_y) {
    
    stroke(color('white'));
    fill(color('white'));
    
    //X axis
    rect(origo_x, origo_y, max_x, 1);

    //Y axis
    rect(origo_x, origo_y, 1, -max_y);

    //Text
    textSize(20);
    text(name, origo_x + 40, origo_y - max_y - 25);
    textSize(10);
    text("Time", origo_x + max_x + 10, origo_y + 5);
    text(name_y, origo_x - 10, origo_y - max_y - 10);

}

function markXAxis(text, origo_x, origo_y, offset_x) {
    
    stroke(color('white'));
    fill(color('white'));

    rect(origo_x + offset_x, origo_y+5, 1, 10);
    textSize(10);
    text(text, origo_x + offset_x - 5, origo_y+10);
}


function draw() {
    console.log("draw() called.");
    
    if (coinmarketTop10.length > 0) {
        console.log(`We got data. coinmarket: ${coinmarketTop10.length}, reddit: ${Object.keys(redditPosts).length}`);

        stroke(color('white'));
        fill(color('white'));
        rect(canvasX/2, 0, 1, canvasY);

        let num_of_dates = coinmarketTop10.length;
        let num_of_currencies = coinmarketTop10[0].length;

        //STATISTICS
        let max_price = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        for(let curr_iter = 0; curr_iter < num_of_currencies; curr_iter++){
            for(let date_iter = 0; date_iter < num_of_dates; date_iter++){
                if(max_price[curr_iter] < coinmarketTop10[date_iter][curr_iter].price){
                    max_price[curr_iter] = coinmarketTop10[date_iter][curr_iter].price;
                }
            }
        }
        console.log("hm", max_price);
        //

        //DRAW AXES
        for(let curr_iter = 0; curr_iter < num_of_currencies; curr_iter++){
            drawGraphAxes(
                coinmarketTop10[0][curr_iter].name,
                "Value (USD)",
                baseX,
                (canvasY/(num_of_currencies+1)) * (curr_iter+1),
                canvasX/2 - 2*baseX,
                (canvasY/(num_of_currencies+1)) - 2*baseY, 
            );
            
            drawGraphAxes(
                coinmarketTop10[0][curr_iter].name,
                "Nr of Posts/Comments",
                (canvasX/2)+baseX,
                (canvasY/(num_of_currencies+1)) * (curr_iter+1),
                canvasX/2 - 2*baseX,
                (canvasY/(num_of_currencies+1)) - 2*baseY,
            );
        }

        //DRAW LINEGRAPH SHOWING VALUE OVERTIME (x:dates, y:value)
        for(let curr_iter = 0; curr_iter < num_of_currencies; curr_iter++){
            //
            let prev_x = baseX;
            let prev_y = (canvasY/(num_of_currencies+1)) * (curr_iter+1);

            for(let date_iter = 0; date_iter < num_of_dates; date_iter++){
                //x
                let x = baseX + date_iter*((canvasX/2 - 2*baseX)/num_of_dates);

                //y
                let y = (canvasY/(num_of_currencies+1)) * (curr_iter+1);

                //alter y
                //a = current_value_of_currency / max_value_of_currency    =   [0, 1]
                //y += a * max_height
                //->then crop lowest value on y-axis so it looks pwetty~
                y -= (coinmarketTop10[date_iter][curr_iter].price/max_price[curr_iter]) * ((canvasY/(num_of_currencies+1)) - 2*baseY);
                //y -= date_iter;

                drawPointAndLine(
                    x, 
                    y, 
                    prev_x, 
                    prev_y
                );

                prev_x = x;
                prev_y = y;
            }
        }
        //drawPointAndLine(20, 20, 100, 100);

        /*textSize(20);
        stroke(color('white'));
        fill(color('white'));
        text("Percentual change in value over 1 hour", (topWidth/2)-3*baseX, 25);
        */
       
        //DRAW LINEGRAPH SHOWING COMMENTS OVERTIME (x:dates, y:comments)
        


        noLoop();   
    }
    
}