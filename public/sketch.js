/* Global Variabels */
// Server call to Twitter API
let data = [];

const getTwitterData = async () => {
    const response = await fetch(
        "http://dummy.restapiexample.com/api/v1/employees"
    );
    return await response.json().then(json => {
        console.log("json has been gathered. Returning data.", json.data);
        data = json.data;
    }); //Extract JSON from the http response
};

const getApiData = async () => {
    // Make sure .env file has PORT=3001
    const response = await fetch(
        "http://localhost:3001/data"
    );
    return await response.json().then(json => {
        console.log("json has been gathered. Returning data.", json.data);
        data = json.data;
    }); //Extract JSON from the http response
};
console.log("Trying to get data...");
// getTwitterData();
getApiData();

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
    if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            let col = color(random(100,255), random(100,255), random(100,255));
            stroke(col);
            fill(col);
            text(data[i].name, random(0, width), random(0, height));
        }
        noLoop();
    }
}
