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

const download = (content, fileName, contentType) => {
    let a = document.createElement("a");
    let file = new Blob([JSON.stringify(content)], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}


const getApiData = async (api_url) => {
    let api_link = "http://localhost:3001/" + api_url;
    console.log("Accessing api data for: ", api_link);
    
    // It was a promise, but await-ing it turned it into a Response
    const response = await fetch(api_link);
    // Returning a promise since it says async (api_type)
    return response.json().then(json => json.data);
}

const getDiskData = () => {
      return data;
}

console.log("Trying to get data...");
let url = "data";
getApiData(url).then(data => {
    console.log('We got the data', data);
    // download(data, 'data.json', 'text/plain');
    api_data = data;
}).catch(err => {
    console.log('Failed to retreive data', err);
    // if (err.statusCode == xxx) {}
    api_data = getDiskData('data/data.json');
});

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
        for (let i = api_data.length-1; i > api_data.length-11; i--) {
            let col = color(random(100,255), random(100,255), random(100,255));
            stroke(col);
            fill(col);
            text(api_data[i].name, random(0, width-50), random(0, height-50));
        }
        noLoop();
    }
}
