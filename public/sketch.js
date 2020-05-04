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
redditNumOfComments = [];

getApiData("coinmarket")
    .then((data) => {
        console.log("getApiData::Successfully retreived data:", data);
        api_data = data;

        api_data.forEach(dataAtTimestamp => {
            coinmarketTop10.push(dataAtTimestamp.data.slice(0, 10));
        });

        // coinmarketTop10[0].quote.volume_24h
        // coinmarketTop10[0][0].quote.USD.volume_24h
        //normalizeData(api_data); // TODO
    })
    .catch((err) => {
        console.log("getApiData::Failed to retreive data:", err);
    });

getApiData("reddit/bitcoin")
    .then((files) => {
        amountOfCharsInBody = 0;
        files.forEach(file => {
            // Extract posts from file
            file = file.data.children;
        });






        // reddit_data = data[0].children;
        // console.log("current response and reddit_data", data, reddit_data);
        reddit_data.forEach(posts => {
            let commentUrl = posts.permalink;
            //fetch(commentUrl).then(response => response[1].data.children).then( comments => /* Get Date and sort it. */;amountOfCharsInBody += comments.body;);
            redditNumOfComments.push(posts.data.num_comments);
        });
    })
    .catch((err) => {
        console.log("Failed to retreive data", err);
    });


//-----GLOBALS-------------------------------------------------------------------------------

let baseX;
let baseY;
let topWidth;
let topHeight;

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
    //console.log("The data is: ", data);
    // let x = random(0, width);
    // let y = random(0, height);
    if (coinmarketTop10.length > 0 && reddit_data.length > 0) {
        console.log("data is: ", coinmarketTop10);
        
        //Variables
        let normFact = coinmarketTop10[0][0].quote.USD.volume_24h;
        let numOfDates = coinmarketTop10.length;

        for (let i = 0; i < numOfDates; i++) {

            let x = baseX + i * (topWidth / numOfDates);
            for (let j = 0; j < coinmarketTop10[i].length; j++) {
                let y = height - baseY - (coinmarketTop10[i][j].quote.USD.volume_24h / normFact) * topHeight;
                stroke(colors[j]);
                fill(colors[j]);
                ellipse(x, y, 20);
            }


        }

        let names = coinmarketTop10[0].map(a => a.name);
        drawLedger(names, 25, 5);
        
        console.log('This is the comments',redditNumOfComments );

        const sumNumOfComments = redditNumOfComments.reduce((a , b) => a + b);
        console.log(sumNumOfComments);
        text(sumNumOfComments,width/2, height/2);
       // graphLayout();
        let p1 = width;
        let p2 = height*0.5;
        stroke(255);
        line(0, p2, p1, p2);

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


