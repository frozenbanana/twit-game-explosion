/* Global Variabels */
// Server call to Twitter API
let twitter_data = [];
let api_data = [];

const getTwitterData = async () => {
    const response = await fetch(
        "http://dummy.restapiexample.com/api/v1/employees"
    );
    return await response.json().then(json => {
        console.log("json has been gathered. Returning data.", json.data);
        twitter_data = json.data;
    }); //Extract JSON from the http response
};

const getApiData = async (api_type) => {
    let api_link = "http://localhost:3001/" + api_type;
    console.log("Accessing api data for: ", api_link);

    const promise = await fetch(api_link);
    
    return await promise.json().then(json => {
        console.log("json has been gathered. Returning data.", json.data);
        api_data = json.data; //could change to return but doesnt work to do so.
    });
    
   //return await promise.json().data;
}

console.log("Trying to get data...");

// getTwitterData();
// getCMarketData();
getApiData("data");

function setup() {
    createCanvas(640, 400);
    background(0);
    textSize(10);
}

function draw() {
    //console.log("The data is: ", data);
    let x = random(0, width);
    let y = random(0, height);
    //console.log("data is: ", data);
    if (api_data.length > 0) {
        for (let i = 0; i < api_data.length; i++) {
            let col = color(random(100,255), random(100,255), random(100,255));
            stroke(col);
            fill(col);
            text(api_data[i].name, random(0, width), random(0, height));
        }
        noLoop();
    }
}
