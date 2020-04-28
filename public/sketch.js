/* Global Variabels */
// Server call to Twitter API
let reddit_data = { children: [] };
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
        console.log("getApiData::Successfully retreived data:", data);
        api_data = data;

        api_data.forEach(dataAtTimestamp => {
            coinmarketTop10.push(dataAtTimestamp.data.slice(0,10));
        });

        // coinmarketTop10[0].quote.volume_24h
        // coinmarketTop10[0][0].quote.USD.volume_24h
        //normalizeData(api_data); // TODO
    })
    .catch((err) => {
        console.log("getApiData::Failed to retreive data:", err);
    });

getApiData("reddit?subreddit=bitcoin")
    .then((data) => {
        console.log("We got the data", data);
        // download(data, 'reddit.json', 'text/plain');
        reddit_data = data;
    })
    .catch((err) => {
        console.log("Failed to retreive data", err);
        // if (err.statusCode == xxx) {}
        // api_data = getDiskData("data/data.json");
    });


//-------------------------------------------------------------------------------------------------


// let normalizeData = (data) => {
    
// };
//-------------------------------------------------------------------------------------------------
function setup() {
    createCanvas(640, 400);
    background(0);
    textSize(10);
}

function draw() {
    //console.log("The data is: ", data);
    // let x = random(0, width);
    // let y = random(0, height);
    console.log("data is: ", coinmarketTop10);
    if (api_data.length > 0) {
        for (let i = 0; i < 10; i++) {
            let col = color(
                random(100, 255),
                random(100, 255),
                random(100, 255)
            );
            stroke(col);
            fill(col);
            let x = random(0, width - 50);
            let y = random(0, height - 50);
            let normFact = coinmarketTop10[0][0].quote.USD.volume_24h;
            ellipse(x,y, 50* coinmarketTop10[0][i].quote.USD.volume_24h/normFact);


            stroke(127);

            text(
                coinmarketTop10[0][i].name,
                x,
                y,
            );
            
            
        }
        
        noLoop();
    }

    // let nrOfPoints = 3;
    // let testPointCoord = 70;
    // let p1 = 70;
    // let p2 = 70*1.5;
    // let p3 = 70*2;
    // for (let i = 0; i < nrOfPoints; i++)
    //     {
    //     stroke(255);
    //     point(p1,p2);
    //     point(p2,p3);
    //     point(p1,p3);

        
    //     }
    // noLoop();
}
