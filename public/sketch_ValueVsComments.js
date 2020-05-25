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
    tether: [],
    bitcoin: [],
    ethereum: [],
    litecoin: [],
    bitcoincash: [],
    eos: [],
    ripple: [],
    bitcoinsv: [],
    ethereumclassic: [],
    tron: [],
};

getApiData("reddit/")
    .then((data) => {
        console.log("getApiData::Successfully retreived from reddit data", data);

        //Go through the different currencies

        let coinKeys = Object.keys(data);

        for (let i = 0; i < coinKeys.length; i++) {
            const currentCoin = data[coinKeys[i]];
            for (let date_index = 0; date_index < currentCoin.length; date_index++) {
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

    //HAI

    canvasX = 3000;
    canvasY = 8000;
    createCanvas(canvasX, canvasY);
    background(0);
    textSize(10);

    // Assignment of global variables
    baseX = 100;
    baseY = 100;
    //topWidth = width - 2 * baseX;
    //topHeight = height - 2 * baseY;
}

function drawPointAndLine(point_x, point_y, prev_point_x, prev_point_y) {

    stroke(color('yellow'));
    strokeWeight(2);
    line(point_x, point_y, prev_point_x, prev_point_y);

    let radius = 5;

    stroke(color('black'));
    fill(color('black'));
    strokeWeight(1);
    ellipse(point_x, point_y, radius);
    //ellipse(prev_point_x, prev_point_y, radius);

    strokeWeight(1);
}

function drawBlankXAxis(name, pos_x, pos_y, x_axis_len) {
    stroke(color('white'));
    fill(color('white'));

    //X axis
    rect(pos_x, pos_y, x_axis_len, 1);

    textAlign(CENTER);
    textSize(25);
    text("Date", pos_x + (x_axis_len / 2), pos_y + 60);
    textAlign(LEFT);
}

function markXAxis(date, pos_x, pos_y_0, grid, y_axis_len) {

    if (grid) {
        stroke(color('#292929'));
        fill(color('#292929'));
        rect(pos_x, pos_y_0, 1, -y_axis_len);
    }

    stroke(color('white'));
    fill(color('white'));
    rect(pos_x, (pos_y_0 - 10), 1, 20);

    textSize(20);
    text((date[0] + "/" + date[1]), (pos_x - 20), (pos_y_0 + 30));
}

function drawYAxis(name, pos_x, pos_y_0, y_axis_len, scaling_mod, magnitude, fix, orientation, grid, x_axis_len) {

    //Draw base axis
    stroke(color('white'));
    fill(color('white'));

    rect(pos_x, pos_y_0, 1, -y_axis_len);

    //Draw value lines, value numbers and axis name 
    textSize(20);
    let text_offset_x = 20;
    let text_offset_y = 10;
    if (orientation === 0) {
        textSize(20);
        //text(name, pos_x - text_offset_x, pos_y_0 - y_axis_len - text_offset_y * 2);

        textAlign(RIGHT);

        for (let y = 0; y < y_axis_len; y += magnitude * scaling_mod) {
            if (grid) {
                stroke(color('#292929'));
                fill(color('#292929'));
                rect(pos_x, (pos_y_0 - y), x_axis_len, 1);
                stroke(color('white'));
                fill(color('white'));
            }

            rect(pos_x - 10, (pos_y_0 - y), 20, 1);

            let value = Math.round((y / scaling_mod) / magnitude) * magnitude;

            let tx = pos_x - text_offset_x;
            let ty = pos_y_0 - y + text_offset_y
            text(value.toFixed(fix), tx, ty);
        }

        textAlign(LEFT);
    }
    else if (orientation === 1) {

        textAlign(RIGHT);

        textSize(20);
        //text(name, pos_x + text_offset_x, pos_y_0 - y_axis_len - text_offset_y * 2);

        textAlign(LEFT);

        for (let y = 0; y < y_axis_len; y += magnitude * scaling_mod) {
            rect(pos_x - 10, (pos_y_0 - y), 20, 1);

            let value = Math.round((y / scaling_mod) / magnitude) * magnitude;
            let tx = pos_x + text_offset_x;
            let ty = pos_y_0 - y + text_offset_y
            text(value.toFixed(fix), tx, ty);
        }
    }



}

function countComments() {
    //COUNT COMMENTS IN INTERVALS
    let crypto_Date_Reached = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // to keep track of each
    //For all dates
    for (let date_index = 0; date_index < coinmarketTop10.length; date_index++) {

        //For each currency
        for (let currency_index = 0; currency_index < coinmarketTop10[date_index].length; currency_index++) {
            //Read reddit comments that happened before current date
            //Once current date is reached, stop and move to next date
            let curr_key = Object.keys(redditPosts)[currency_index];

            while (redditPosts[curr_key][crypto_Date_Reached[currency_index]] &&
                redditPosts[curr_key][crypto_Date_Reached[currency_index]].timestamp < coinmarketTop10[date_index][currency_index].timestamp) {
                //console.log("Comments in Interval", curr_key, coinmarketTop10[date_index][currency_index].timestamp); //To see the how many comments have the same timestamps        
                coinmarketTop10[date_index][currency_index].comments_in_interval += 1 + redditPosts[curr_key][crypto_Date_Reached[currency_index]].num_comments;

                crypto_Date_Reached[currency_index]++;
            }
            //console.log("Comments in Interval", curr_key, coinmarketTop10[date_index][currency_index].comments_in_interval); //Comments in each interval
        }
    }
    //
}

function calcProportionalValues(max_value, y_axis_len, magnitude_step) {

    //Go from 1000000 to 0.000001 and figure out the magnitude of the number
    let magnitude = 1000000;
    let fix = 0
    for (let j = 6; j > -6; j--) {
        if (j < 0) { fix = abs(j); }
        if ((max_value / magnitude) >= 1) { j = -7; } //Break loop
        else { magnitude /= 10; }   //Elsewise divide by 10
    }

    //Scaling modifier
    //->    Magnitude_step denominates the interval we mark on the y-axes,
    //      ergo a magnitude_step of 2 and a magnitude of 10 means we mark
    //      the y-axis in steps of 20
    let ref_magnitude = magnitude * magnitude_step;
    let magnitude_mod = Math.ceil(max_value / ref_magnitude) * ref_magnitude + magnitude;
    let scaling_mod = y_axis_len / magnitude_mod;

    //return [scaling_mod, magnitude, fix];
    return {
        scaling_mod: scaling_mod,
        magnitude: magnitude,
        fix: fix,
    }
}

function drawLegends(init_x_pos, init_y_pos) {
    //Variables
    let box_w = 150;
    let box_h = 70;
    let box_py = init_y_pos - 35;
    let bar_mods = [0.1, 0.5, 0.4, 0.2, 0.3, 0.2, 0.4, 0.5, 0.2];
    
    let mid_offset = 570;

    //Price
    let box_px = init_x_pos - mid_offset - box_w;

    stroke(color('white'));
    fill(color('black'));
    rect(box_px, box_py, box_w, box_h);

    stroke(color('white'));
    fill(color('white'));
    textSize(20);
    text("Price:", box_px + 0.3*box_w, box_py + 0.25*box_h);

    let prev_x = box_px + (0+1)*0.1*box_w;
    let prev_y = box_py + 0.9*box_h - bar_mods[0]*box_h;
    for(let i = 0; i < bar_mods.length; i++) {
        let x = box_px + (i+1)*0.1*box_w;
        let y = box_py + 0.9*box_h - bar_mods[i]*box_h;

        drawPointAndLine(
            x,
            y,
            prev_x,
            prev_y
        );

        prev_x = x;
        prev_y = y;
    }

    //Posts/Comments
    box_px = init_x_pos + mid_offset;
    
    stroke(color('white'));
    fill(color('black'));
    rect(box_px, box_py, box_w, box_h);

    stroke(color('white'));
    fill(color('white'));
    textSize(15);
    text("Posts & Comments:", box_px + 0.05*box_w, box_py + 0.25*box_h);

    stroke(color('#9C6ECC'));
    fill(color('#9C6ECC'));
    for(let i = 0; i < bar_mods.length; i++) {
        rect(box_px + (i+1)*0.1*box_w, box_py + 0.9*box_h, 4, -bar_mods[i]*box_h);
    }
    

}

function bigDrawCommentTime(num_of_dates, num_of_currencies, x_axis_len, y_axis_len, x_start, mag_step, grid) {
    //DRAW LINEGRAPH SHOWING COMMENTS OVERTIME (x:dates, y:comments)

    //STATISTICS
    let max_price = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let max_comments = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let curr_iter = 0; curr_iter < num_of_currencies; curr_iter++) {
        for (let date_iter = 1; date_iter < num_of_dates; date_iter++) {
            if (max_price[curr_iter] < coinmarketTop10[date_iter][curr_iter].price) {
                max_price[curr_iter] = coinmarketTop10[date_iter][curr_iter].price;
            }
            if (max_comments[curr_iter] < coinmarketTop10[date_iter][curr_iter].comments_in_interval) {
                max_comments[curr_iter] = coinmarketTop10[date_iter][curr_iter].comments_in_interval;
            }
        }
    }

    for (let curr_iter = 0; curr_iter < num_of_currencies; curr_iter++) {
        //Newer
        let price_cat = calcProportionalValues(max_price[curr_iter], y_axis_len, mag_step);
        let comment_cat = calcProportionalValues(max_comments[curr_iter], y_axis_len, mag_step);
        //let scaling_mod = ret_cat[0];
        //let magnitude = ret_cat[1];
        //let fix = ret_cat[2];

        //console.log("s", scaling_mod);

        let y_axis_0 = (canvasY / (num_of_currencies + 1)) * (curr_iter + 1);

        //TITLE
        textAlign(CENTER);
        textSize(50);
        stroke(color('white'));
        fill(color('white'));
        
        let title = coinmarketTop10[0][curr_iter].name;
        let title_x_pos = x_start + (x_axis_len / 2);
        let title_y_pos = y_axis_0 - y_axis_len - 50;
        text(title, title_x_pos, title_y_pos);
        textAlign(LEFT);

        //LEGENDS
        drawLegends(title_x_pos, title_y_pos);

        //DRAW AXES
        drawBlankXAxis(
            "Date",
            x_start, //(canvasX / 2) + baseX,
            y_axis_0,
            x_axis_len
        );

        drawYAxis(
            "Price (USD)",
            x_start, //(canvasX / 2) + baseX,
            y_axis_0,
            y_axis_len,
            price_cat.scaling_mod,
            price_cat.magnitude,
            price_cat.fix,
            0,
            grid,
            x_axis_len,
        );

        drawYAxis(
            "Nr of Posts/Comments",
            x_start + x_axis_len, //(canvasX / 2) + baseX + x_axis_len,
            y_axis_0,
            y_axis_len,
            comment_cat.scaling_mod,
            comment_cat.magnitude,
            comment_cat.fix,
            1,
            false, //grid,
            x_axis_len,
        );

        //DATA
        let prev_x = x_start; //(canvasX / 2) + baseX;
        let prev_price_y = y_axis_0 - coinmarketTop10[1][curr_iter].price * price_cat.scaling_mod;

        let last_date = coinmarketTop10[1][curr_iter].date;
        for (let date_iter = 1; date_iter < num_of_dates; date_iter++) {
            //x
            let x = x_start + date_iter * (x_axis_len / num_of_dates);

            //Mark x-axis
            if (last_date[0] != coinmarketTop10[date_iter][curr_iter].date[0]) {
                last_date = coinmarketTop10[date_iter][curr_iter].date;
                markXAxis(
                    last_date,
                    x,
                    y_axis_0,
                    grid,
                    y_axis_len,
                );
            }

            //Comments
            //stroke(color('black'));
            stroke(color('#9C6ECC'));
            fill(color('#9C6ECC'));
            rect(x, y_axis_0, 4, -coinmarketTop10[date_iter][curr_iter].comments_in_interval * comment_cat.scaling_mod);

            //temp text above each bar
            /*
            stroke(color('black'));
            fill(color('white'));
            textSize(10);
            text(
                coinmarketTop10[date_iter][curr_iter].comments_in_interval,
                x,
                y_axis_0 - coinmarketTop10[date_iter][curr_iter].comments_in_interval * comment_cat.scaling_mod - 15
            );
            */

            //Price
            let price_y = y_axis_0 - coinmarketTop10[date_iter][curr_iter].price * price_cat.scaling_mod;
            drawPointAndLine(
                x,
                price_y,
                prev_x,
                prev_price_y
            );

            prev_x = x;
            prev_price_y = price_y;
        }//date_iter
    }//curr_iter
}

function draw() {
    console.log("draw() called.");

    if (coinmarketTop10.length > 0 && redditPosts['bitcoin'].length > 0) {
        console.log(`We got data. coinmarket: ${coinmarketTop10.length}, reddit: ${Object.keys(redditPosts).length}`);

        stroke(color('white'));
        fill(color('white'));
        rect(canvasX / 2, 0, 1, canvasY);

        let num_of_dates = coinmarketTop10.length;
        let num_of_currencies = coinmarketTop10[0].length;

        let x_axis_len = canvasX / 2 - 2 * baseX;
        let y_axis_len = (canvasY / (num_of_currencies + 1)) - 2 * baseY;

        //Count comments
        countComments();

        //bigDrawValueTime(num_of_dates, num_of_currencies, x_axis_len, y_axis_len);
        bigDrawCommentTime(num_of_dates, num_of_currencies, x_axis_len, y_axis_len, baseX, 10, true);
        bigDrawCommentTime(num_of_dates, num_of_currencies, x_axis_len, y_axis_len, ((canvasX / 2) + baseX), 2, true);

        noLoop();
    }

}