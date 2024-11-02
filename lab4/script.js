// script.js

const API_KEY = "db97462de6e326bb12348d36bc39e6c5"; // Replace with your actual API key
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
  
  console.log("Fetching weather data from URL:", url); // Logging the URL

  const response = await fetch(url);
  if (!response.ok) throw new Error("Weather API error");
  const data = await response.json();
  console.log("Weather API response:", data); // Logging the response
  return data;
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

  console.log("Fetching quote from URL:", url); // Logging the quote URL

  const response = await fetch(corsProxy + encodeURIComponent(url));
  if (!response.ok) throw new Error("Quote API error");
  const data = await response.json();
  console.log("Quote API response:", data); // Logging the quote data

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
  if (Array.isArray(quote) && quote.length > 0) {
    quoteDiv.innerHTML = `
      <blockquote>${quote[0].h}</blockquote>`;
  } else {
    quoteDiv.innerHTML = `
      <blockquote>Quote not available.</blockquote>`;
  }
}

// Variable to store fetched weather data
let weatherData = null;

// Function to save data to the database
async function saveDataToDatabase(data) {
  try {
    console.log("Saving data to database...");
    const response = await fetch('https://gabrij2.eastus.cloudapp.azure.com/ITWS-2110-F24-gabrij2/lab4/save_data.php', { // Update with your actual URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    });
    const result = await response.text();
    console.log("Save Data Response:", result);
    alert('Data saved to database.');
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Function to load data from the database
async function loadDataFromDatabase() {
  try {
    console.log("Loading data from database...");
    const response = await fetch('https://gabrij2.eastus.cloudapp.azure.com/ITWS-2110-F24-gabrij2/lab4/get_data.php'); // Update with your actual URL
    if (!response.ok) throw new Error("Failed to load data from database.");
    const data = await response.json();
    console.log('Data loaded from database:', data);
    displayLoadedData(data);
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Function to display the loaded data
function displayLoadedData(data) {
  // Update the DOM elements with the loaded data
  const loadedDataElement = document.getElementById('loaded-data');
  if (loadedDataElement) {
    loadedDataElement.textContent = JSON.stringify(data, null, 2);
  } else {
    console.warn("Loaded data element not found.");
  }
}

// Add event listeners to buttons
document.addEventListener('DOMContentLoaded', () => { // Ensure DOM is loaded before adding listeners
  const saveButton = document.getElementById('save-button');
  const loadButton = document.getElementById('load-button');

  if (saveButton) {
    saveButton.addEventListener('click', () => {
      if (weatherData) {
        saveDataToDatabase(weatherData);
      } else {
        alert('No data to save. Please fetch data first.');
      }
    });
  } else {
    console.warn("Save button not found.");
  }

  if (loadButton) {
    loadButton.addEventListener('click', () => {
      loadDataFromDatabase();
    });
  } else {
    console.warn("Load button not found.");
  }
});

// Main function to run the application
async function run() {
  try {
    console.log("Starting the application...");
    
    console.log("Getting user location...");
    const { lat, lon } = await getUserLocation();
    console.log(`User location obtained: Latitude = ${lat}, Longitude = ${lon}`);

    console.log("Fetching weather data...");
    weatherData = await fetchWeatherData(lat, lon);
    console.log("Weather data fetched successfully:", weatherData);

    console.log("Computing Troy Day criteria...");
    const troyDayResults = computeTroyDay(weatherData);
    const numPasses = Object.values(troyDayResults).filter(
      (r) => r.passes
    ).length;
    const isTroyDay = numPasses >= 6;
    const troyDayPercentage = (numPasses / 10) * 100;
    console.log(`Troy Day Computation: ${numPasses} passes, ${isTroyDay ? "It's a Troy Day!" : "It's not a Troy Day."}`);

    console.log("Fetching quote based on Troy Day status...");
    const quote = await fetchQuote(isTroyDay);
    console.log("Quote fetched:", quote);

    console.log("Displaying results...");
    displayResults(troyDayResults, isTroyDay, troyDayPercentage, quote);
    console.log("Application run successfully.");
  } catch (error) {
    console.error("Error during application run:", error);
    document.getElementById("threshold-results").textContent =
      "Error fetching data or location.";
  }
}

run();