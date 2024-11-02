# LIST OF PROMPTS
Main converstion using chat gpt 4o1 mini
1. 
    Given these lab assignments and my attached lab 2 code to extend, complete lab 4. Make sure it is the simplest possible subset of lab 3 functionality.
    Lab 4
    Due: 10/18 before you walk in the door
    This is an individual lab. To be hosted on your personal Azure VM at https://<your-VM-URL>/<your-personal-GitHub-repo>/lab4
    IF YOUR REPO HAS THE WRONG NAME, YOU GET A ZERO NO EXCEPTIONS NO FIXING IT AFTER THE FACT!
    Remake a subset of your lab3 (tell us in the README.md file what subset that is) using only ChatGPT (or Copilot, or any other Generative AI) generated code. You may not write any code yourself or edit any code the AI provides. If you don’t like what you got, you will need to find another way to prompt the AI to get what you want.

    EVERYTHING must be AI-generated: code, images, text, everything. Nothing can come from your own hand. You might need to use other sites for AI-generated images. Don’t pay for anything.

    (You may manually stitch code together from multiple conversations, but try to keep that to a minimum and put in your README.md what/where that stitching is.)

    It does not need to be 1-to-1 identical, but any functionality that exists in lab3 needs to exist in lab4. You will be graded on how close you replicate the functionality between lab3 and lab4.

    In your README.md file, keep a running log of the prompts you gave ChatGPT, in the order you gave those prompts. You do not (and should not) post the responses you get back to your README.md file.

    Make sure to include a copy of your ZAP report on GitHub.

    YOU MUST HAVE A README.MD FILE WITH SEVERAL SENTENCES (AKA PARAGRAPHS OF PROSE) OF A RUNNING WORK LOG, WHERE YOU GOT STUCK, AND HOW YOU GOT UNSTUCK, AND ALL YOUR CITATIONS. FAILURE TO PROVIDE A README.MD FILE (OR FAILURE TO PROVIDE CITATIONS) WILL RESULT IN A ZERO FOR THE LAB, NO EXCEPTIONS, NO ADDING THINGS AFTER THE FACT.

    Grading
    Listing of prompts				10 pts.
    Functionality					10 pts.
    ZAP report					10 pts.
    Creativity					10 pts.
    README.md					10 pts.
    TOTAL						50 pts.


    Lab 3 – Backend review (PHP, MySQL)
    Due 10/4 end of day (11:59 PM)
    This is an individual lab. To be hosted on your personal Azure VM at https://<your-VM-URL>/<your-personal-GitHub-repo>/lab3
    You will need to have SSL certs (aka, HTTPS) on your VM or else you won’t be able to connect to your APIs from your VM!
    Take whatever you did for lab2 and make a button that allows you to fetch a JSON object from each API and put that JSON object into a MySQL database. Then use PHP to fetch that information out of the database and display it on your frontend. Give your users a way to change the data they see, and overwrite the existing database entry with the changes the user made.
    Grading:
    Database (MySQL)						10 pts
    Getting data in/out of the database (PHP)			10 pts
    Quality HTML/CSS/JS						10 pts
    Creativity							10 pts
    README.md							10 pts
    Total								50 pts


    Lab 2 – JavaScript, AJAX, JSON, using APIs
    Due 9/27 before class
    Weather and <insert other API here> app
    This is an individual lab. To be hosted on your personal Azure VM at https://<your-VM-URL>/<your-personal-GitHub-repo>/lab2
    You will need to have SSL certs (aka, HTTPS) on your VM or else you won’t be able to connect to your APIs from your VM!
    Use OpenWeatherMap for this lab! Connect to its API and see what information you get back from it. Don’t forget to check out the HTTP response headers: do they include extra metadata not found in the JSON that you might find useful?
    Find another free (you are not allowed to pay for anything; if you have to put a credit card in, you cannot use it) API that provides some other kind of data (your choice!). Do the same as with the OpenWeatherMap API.
    Next, write a web app to show the weather for Troy, NY, and then – think “creativity,” fill out the rest of your app with other information provided to you by both of your APIs.
    It is important to check out the API documentation for both of your APIs to see what data you can get… you might be surprised how much you can get!
    Use CSS/JavaScript/Bootstrap/jQuery/whatever (as long as it’s not a web framework) to make your web app interesting! Make sure you have valid HTML and CSS (warnings OK, but no errors of your own making… -5 if there are HTML errors; -5 if there are CSS errors).
    5 items of content from each API at a minimum!
    YOU MUST CITE ALL YOUR SOURCES IN YOUR README.MD! YOU GET A 0 FOR THE LAB IF YOU DON’T DO THIS! (It’s plagiarism!)
    Example weather-only implementation using Bootstrap. Yours needs to be better than this! (And use both of your APIs):

    Grading:
    Getting data from APIs (AJAX)					10 pts
    Manipulating data received from APIs (JSON)			10 pts
    Quality HTML/CSS/JS						10 pts
    Creativity							10 pts
    README.md							10 pts
    Total								50 pts
    For an additional 5 points, see if you can figure out how to use the HTML5 Geolocation API to get the weather for the user based on their location rather than hard coding Troy, NY.


    // script.js

    const API_KEY = "db97462de6e326bb12348d36bc39e6c5";
    const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
    const QUOTES_API_URL = "https://zenquotes.io/api/";

    // Troy Day Criteria
    const troyDayCriteria = {
    is_in_troy: {
        threshold: true,
        message: "Currently In Troy?",
    },
    is_cloudy: {
        threshold: 50,
        message: "Is it cloudy?",
    },
    is_overcast: {
        threshold: 85,
        message: "Is it TOTALLY cloudy (overcast)?",
    },
    feels_like: {
        threshold: 32,
        message: "Does it feel freezing out?",
    },
    freezing_temp: {
        threshold: 32,
        message: "Is the temperature below 32°F?",
    },
    daylight_hours: {
        threshold: 11,
        message: "Is there 11 hours of daylight or under?",
    },
    wind_speed: {
        threshold: 5,
        message: "Is it windy?",
    },
    is_wet: {
        threshold: ["drizzle", "mist", "haze", "fog"],
        message: "Is it misty, foggy, or wet?",
    },
    is_raining: {
        threshold: ["rain", "snow"],
        message: "Is it drizzling, raining, or snowing?",
    },
    is_storming: {
        threshold: ["thunderstorm"],
        message: "Is there currently a thunderstorm?",
    },
    };

    // Helper Functions

    // Calculate daylight hours
    function calculateDaylightHours(sunrise, sunset) {
    const daylightSeconds = sunset - sunrise;
    const hours = Math.floor(daylightSeconds / 3600);
    const minutes = Math.floor((daylightSeconds % 3600) / 60);
    return { hours, minutes };
    }

    // Get user location
    function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            resolve({ lat, lon });
            },
            (error) => {
            reject(new Error("Unable to retrieve your location."));
            }
        );
        } else {
        reject(new Error("Geolocation is not supported by this browser."));
        }
    });
    }

    // Fetch weather data
    async function fetchWeatherData(lat, lon) {
    const url = `${WEATHER_API_URL}?${new URLSearchParams({
        lat,
        lon,
        units: "imperial",
        appid: API_KEY,
    }).toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather API error");
    return await response.json();
    }

    // Fetch quote
    async function fetchQuote(isTroyDay) {
    const corsProxy = "https://corsproxy.io/?";
    let url;
    if (isTroyDay) {
        // Fetch a quote from Dostoyevsky
        url = `${QUOTES_API_URL}/quotes?author=Dostoyevsky`;
    } else {
        // Fetch a random happy quote
        url = `${QUOTES_API_URL}/random`;
    }

    const response = await fetch(corsProxy + encodeURIComponent(url));
    if (!response.ok) throw new Error("Quote API error");
    const data = await response.json();

    if (data.results && data.results.length > 0) {
        // Return a random quote from the results
        return data.results[Math.floor(Math.random() * data.results.length)];
    } else {
        return data; // Return the random quote
    }
    }

    // Compute Troy Day
    function computeTroyDay(data) {
    const results = {};

    // 1. is_in_troy
    const isInTroy = data.name === "Troy" || data.name === "Watervliet";
    results.is_in_troy = {
        value: isInTroy ? "You're in Troy!" : `You're in ${data.name}`,
        passes: isInTroy,
    };

    // 2. is_cloudy
    const cloudiness = data.clouds.all; // percentage
    let cloudinessType = "";
    if (cloudiness >= 85 && cloudiness <= 100) {
        cloudinessType = "overcast clouds";
    } else if (cloudiness >= 51 && cloudiness <= 84) {
        cloudinessType = "broken clouds";
    } else if (cloudiness >= 25 && cloudiness <= 50) {
        cloudinessType = "scattered clouds";
    } else {
        cloudinessType = "clear skies";
    }
    results.is_cloudy = {
        value: cloudinessType,
        passes: cloudiness >= troyDayCriteria.is_cloudy.threshold,
    };

    // 3. is_overcast
    results.is_overcast = {
        value: `${cloudiness}%`,
        passes: cloudiness >= troyDayCriteria.is_overcast.threshold,
    };

    // 4. feels_like
    const feelsLike = data.main.feels_like;
    results.feels_like = {
        value: `${feelsLike}°F`,
        passes: feelsLike <= troyDayCriteria.feels_like.threshold,
    };

    // 5. freezing_temp
    const temp = data.main.temp;
    results.freezing_temp = {
        value: `${temp}°F`,
        passes: temp <= troyDayCriteria.freezing_temp.threshold,
    };

    // 6. daylight_hours
    const sunrise = data.sys.sunrise;
    const sunset = data.sys.sunset;
    const daylight = calculateDaylightHours(sunrise, sunset);
    const daylightHours = daylight.hours + daylight.minutes / 60;
    results.daylight_hours = {
        value: `${daylightHours.toFixed(2)} hours`,
        passes: daylightHours <= troyDayCriteria.daylight_hours.threshold,
    };

    // 7. wind_speed
    const windSpeed = data.wind.speed;
    results.wind_speed = {
        value: `${windSpeed.toFixed(2)} mph`,
        passes: windSpeed >= troyDayCriteria.wind_speed.threshold,
    };

    // Weather descriptions
    const weatherDescriptions = data.weather.map((w) =>
        w.description.toLowerCase()
    );
    const weatherMain = data.weather.map((w) => w.main.toLowerCase());

    // 8. is_storming
    const isStorming = troyDayCriteria.is_storming.threshold.some((condition) =>
        weatherDescriptions.includes(condition) || weatherMain.includes(condition)
    );
    results.is_storming = {
        value: isStorming ? "Yes" : "No",
        passes: isStorming,
    };

    // 9. is_raining
    const isRaining =
        isStorming ||
        troyDayCriteria.is_raining.threshold.some((condition) =>
        weatherDescriptions.includes(condition) || weatherMain.includes(condition)
        );
    results.is_raining = {
        value: isRaining ? "Yes" : "No",
        passes: isRaining,
    };

    // 10. is_wet
    const isWetConditions = [
        ...troyDayCriteria.is_wet.threshold,
        ...troyDayCriteria.is_raining.threshold,
        ...troyDayCriteria.is_storming.threshold,
    ];
    const isWet =
        isRaining ||
        isWetConditions.some((condition) =>
        weatherDescriptions.includes(condition) || weatherMain.includes(condition)
        );
    results.is_wet = {
        value: isWet ? "Yes" : "No",
        passes: isWet,
    };

    return results;
    }

    // Display results
    function displayResults(results, isTroyDay, troyDayPercentage, quote) {
    const resultsDiv = document.getElementById("threshold-results");
    resultsDiv.innerHTML = "";

    Object.keys(results).forEach((key) => {
        const result = results[key];
        const resultElement = `
        <div class="criteria-row">
            <strong>${troyDayCriteria[key].message}</strong>
            <p>${result.value}</p>
            <span class="badge ${
            result.passes ? "bg-success" : "bg-danger"
            }">${result.passes ? "YES" : "NO"}</span>
        </div>
        `;
        resultsDiv.insertAdjacentHTML("beforeend", resultElement);
    });

    const resultContainer = document.getElementById("result-container");
    const troyDayResult = isTroyDay
        ? `It's a Troy Day! (${troyDayPercentage.toFixed(2)}%), have a Dostoyevsky quote:`
        : `It's not a Troy Day! (${troyDayPercentage.toFixed(2)}%), have an inspirational quote:`;
    resultContainer.innerHTML = `<h3>${troyDayResult}</h3>`;

    const quoteDiv = document.getElementById("quote-container");
    console.log(quote);
    quoteDiv.innerHTML = `
        <blockquote>${quote[0].h}</blockquote>`;
    }

    async function run() {
    try {
        const { lat, lon } = await getUserLocation();
        const weatherData = await fetchWeatherData(lat, lon);

        const troyDayResults = computeTroyDay(weatherData);
        const numPasses = Object.values(troyDayResults).filter(
        (r) => r.passes
        ).length;
        const isTroyDay = numPasses >= 6;
        const troyDayPercentage = (numPasses / 10) * 100;

        const quote = await fetchQuote(isTroyDay);
        displayResults(troyDayResults, isTroyDay, troyDayPercentage, quote);
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("threshold-results").textContent =
        "Error fetching data or location.";
    }
    }

    run();


    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Troy Weather Scale</title>
        <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossorigin="anonymous"
        >
        <link rel="stylesheet" href="styles.css">
        <link
        href="https://fonts.googleapis.com/css2?family=Monsieur+La+Doulaise&display=swap"
        rel="stylesheet"
        >
    </head>
    <body>
        <div id="loading-screen"></div>

        <div id="page">
        <div id="content">
            <h1 class="card-title text-center">The <span>Troy</span>-Day Scale</h1>
            <div id="threshold-results">
            <!-- Results will be filled in dynamically -->
            </div>
            <div id="bottom-card">
            <div id="result-container"></div>
            <div id="quote-container"></div>
            </div>
        </div>
        </div>

        <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"
        ></script>
        <script src="script.js"></script>
    </body>
    </html>


    /* styles.css */
    body {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        background-image: url('assets/barh-bg.jpg');
        background-size: cover;
    }

    h1 {
        padding-bottom: 3%;
    }

    h1 span {
        font-family: "Monsieur La Doulaise", cursive;
        font-weight: 600;
        font-size: larger;
    }

    #page {
        display: flex;
        align-items: center;
        flex-direction: column;
        min-height: 100vh;
    }

    #content {
        padding: 3%;
        margin-top: 100px;
        display: flex;
        flex-direction: column;
        margin: auto 2%;
        min-width: 500px;
        min-height: 750px;
        height: min(calc(0.85 * (100vh)), 80vw);
        width: calc(.85 * min(calc(0.85 * (100vh - 3.5em)), 70vw));
        border-radius: 15px;
        background-image: url('assets/barton-clouds.jpg');
        background-size: cover;
        box-shadow: 0 8px 16px black;
    }
    /* #threshold-results { */

    .criteria-row {
        display: flex;
        justify-content: space-between;
        background-color: rgba(193, 165, 165, 0.266);
        margin-bottom: 5px;
        border-radius: 15px;
        padding-left: 3%;
        padding-right: 3%;
    }

    .criteria-row strong {
        width: 55%;
    }

    #bottom-card {
        margin-top: auto;
    }

    #result-container {
        margin-bottom: 2%;
        padding: 2%;
        border-radius: 10px;
        background-color: #eca87be9;
    }

    #result-container h3 {
        font-size: large;
    }

    #quote-container {
        padding: 2%;
        background-color: #b570e3ec;
        border-radius: 10px;
    }

    #quote-container blockquote {
        font-style: italic;
        margin-bottom: 15px;
    }

2.	give the entire code for script.js
3.	rewrite the sql command to create the database using the following host, username password and dbname localhost gabrij2 dixie2 lab4
4.  change the api key to the actual one in the first prompt and the php links to start with https://gabrij2.eastus.cloudapp.azure.com/ITWS-2110-F24-gabrij2/lab4/
5.	compile a list of prompts (not responses) from this conversation


supplemental conversation using 4o
1. create similar images based on the following with the same filenames 
    [with the following attached 
    ├── barh-bg.jpg
    └── barton-clouds.jpg]


# WRITEUP
For this lab I used ChatGPT 4o1 mini for the code and functionality. I used 4o to generate the images.

I asked ChatGPT to implement the simplest possible subset of lab3 functionality, letting it decide. It chose to the subset of storing and accessing the fetched weather data with a button.

After completing this lab, I realized that generative AI has become highly proficient at implementing functionality. In my prompts, I provided the AI with as much context as possible by including the actual lab instructions. I found that giving AI more context leads to better results, even if the context is simply appended at the end of the prompt. However, communicating good and creative personal design choices remains very difficult. I asked the AI to extend my given Lab 2 code, which I believe complies with the assignment rules since I wrote no new code and only used AI-generated output.

One part of this lab that initially stumped me was that the app generated by ChatGPT appeared visually correct but did nothing. I realized that it did not include the API key, correct credentials for MySQL, or the proper links to fetch the PHP resources. The only issue I didn’t catch at first was the use of placeholder links for the PHP scripts. This is something I notice AI often does, possibly because handling actual credentials poses a security risk.


# CITATIONS:

- chatgpt.com
-  Zenquotes API https://docs.zenquotes.io/
- Open Weather API https://api.openweathermap.org/data/2.5/weather
- Referenced previous lab3 and lab2 code 