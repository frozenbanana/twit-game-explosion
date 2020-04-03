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
    }); //extract JSON from the http response
};
console.log("Trying to get data...");
getTwitterData();

function setup() {
    createCanvas(640, 400);
    background(color(255, 0, 0));
}

function draw() {
    //console.log("The data is: ", data);
    let x = 0;
    let y = random(0, 400);
    fill(color(random(0, 255), random(0, 255), random(0, 255)));
    //console.log("data is: ", data);
    if (data.length > 0) {
        console.log(data[i]);

        for (let i = 0; i < data.length; i++) {
            ellipse(x + i * 25, y, 25, 25);
        }
        noLoop();
    }
}
