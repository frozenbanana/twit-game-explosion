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

console.log("Trying to get data...");
getTwitterData();

function setup() {
    createCanvas(640, 400);
    background(color(255, 150, 150));
}

function draw() {
    //console.log("The data is: ", data);
    let x = 25;
    let y = random(0, 400);
    let cirlceColor = color(random(0, 255), random(0, 255), random(0, 255));
    //console.log("data is: ", data);
    if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            console.log(data[i].employee_name);
            let circleSize = data[i].employee_age / 2;
            fill(cirlceColor);
            ellipse(x + i * 25, y, circleSize, circleSize);
            textSize(10);
            fill(color("BLACK"));
            let yOffset = (i % 2) * circleSize + 20;
            let xOffset = 10;
            let first_name = data[i].employee_name.substr(
                0,
                data[i].employee_name.indexOf(" ")
            );
            text(first_name, x + i * 25 - xOffset, y - 45 + yOffset);
        }
        noLoop();
    }
}
