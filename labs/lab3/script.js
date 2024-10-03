// Constants
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
    message: "Some Clouds?",
  },
  is_overcast: {
    threshold: 85,
    message: "Overcast Clouds?",
  },
  feels_like: {
    threshold: 32,
    message: "Freezing (32°F)?",
  },
  freezing_temp: {
    threshold: 32,
    message: "Feels-like is colder?",
  },
  daylight_hours: {
    threshold: 11,
    message: "Under 11 hrs of light?",
  },
  wind_speed: {
    threshold: 5,
    message: "Windspeed > 5mph?",
  },
  is_wet: {
    threshold: ["drizzle", "mist", "haze", "fog"],
    message: "Wet (Fog/ Mist)?",
  },
  is_raining: {
    threshold: ["rain", "snow"],
    message: "Raining/Drizzling?",
  },
  is_storming: {
    threshold: ["thunderstorm"],
    message: "Thunderstorm?",
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
function displayResults(results, isTroyDay, troyDayPercentage) {
  const resultsDiv = document.getElementById("threshold-results");
  resultsDiv.innerHTML = "";

  Object.keys(results).forEach((key) => {
    const result = results[key];
    const resultElement = `
      <div class="criteria-row">
        <p class="criteria">${troyDayCriteria[key].message}</p>
        <p class="result">${result.value}</p>
        <span class="passes-badge"> ${result.passes ? '✅' : '❌'}
      </div>
    `;
    resultsDiv.insertAdjacentHTML("beforeend", resultElement);
  });

  const resultContainer = document.getElementById("result-container");
  const troyDayResult = isTroyDay
    ? `It's a Troy Day! (${troyDayPercentage.toFixed(2)}%), have a Dostoyevsky quote:`
    : `It's not a Troy Day! (${troyDayPercentage.toFixed(2)}%), have an inspirational quote:`;
  resultContainer.innerHTML = `<h3>${troyDayResult}</h3>`;
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

    displayResults(troyDayResults, isTroyDay, troyDayPercentage);
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("threshold-results").textContent =
      "Error fetching data or location.";
  }
}

run();
