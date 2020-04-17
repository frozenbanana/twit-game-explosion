/* Global Variabels */
// Server call to Twitter API
let reddit_data = { children: [] };
let api_data = [];

const getTwitterData = async () => {
    const response = await fetch(
        "http://dummy.restapiexample.com/api/v1/employees"
    );
    return await response.json().then((json) => {
        console.log("json has been gathered. Returning data.", json.data);
        twitter_data = json.data;
    }); //Extract JSON from the http response
};

const download = (content, fileName, contentType) => {
    let a = document.createElement("a");
    let file = new Blob([JSON.stringify(content)], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
};

const getApiData = async (api_url) => {
    let api_link = "http://localhost:3001/" + api_url;
    console.log("Accessing api data for: ", api_link);

    // It was a promise, but await-ing it turned it into a Response
    const response = await fetch(api_link);
    // Returning a promise since it says async (api_type)
    return response.json().then((json) => json.data);
};

const getDiskData = () => {
    return data;
};

console.log("Trying to get data...");

getApiData("coinmarket?sort=volume_24h")
    .then((data) => {
        console.log("We got the data", data);
        // download(data, 'coinmarket.json', 'text/plain');
        api_data = data;
    })
    .catch((err) => {
        console.log("Failed to retreive data", err);
        // if (err.statusCode == xxx) {}
        // api_data = getDiskData("data/data.json");
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

function setup() {
    createCanvas(640, 400);
    background(0);
    textSize(10);
}

function draw() {
    //console.log("The data is: ", data);
    // let x = random(0, width);
    // let y = random(0, height);
    //console.log("data is: ", data);
    if (api_data.length > 0 && reddit_data.children.length > 0) {
        for (let i = 0; i < 10; i++) {
            let col = color(
                random(100, 255),
                random(100, 255),
                random(100, 255)
            );
            stroke(col);
            fill(col);
            text(
                api_data[i].name,
                random(0, width - 50),
                random(0, height - 50)
            );
        }

        for (let i = 0; i < reddit_data.children.length; i++) {
            let offset = 10;
            let col = color(255, 100, 100);
            stroke(col);
            ellipse(i * offset, height / 2, 5, 5);
        }
        noLoop();
    }
}
