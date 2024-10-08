import { getUserLocation } from './location.js';
import { fetchWeatherData, fetchDataFromDatabase, storeDataInDatabase, storeUpdatedDataInDatabase } from './fetchData.js';
import { computeTroyDay } from './computeTroyDay.js';
import { displayResults } from './displayResults.js';
import { getQueryParam } from './utils.js';

async function getTodaysData() {
  try {
    const { lat, lon } = await getUserLocation();
    const weatherData = await fetchWeatherData(lat, lon);

    const troyDayResults = computeTroyDay(weatherData);
    const numPasses = Object.values(troyDayResults).filter((r) => r.passes).length;
    const isTroyDay = numPasses >= 6;
    const troyDayPercentage = (numPasses / 10) * 100;

    const todayDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD

    await storeDataInDatabase(weatherData, troyDayResults, todayDate);

    // Redirect to the same page with date parameter
    window.location.href = window.location.pathname + '?date=' + todayDate;
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("threshold-results").textContent =
      "Error fetching data or location.";
  }
}

function displayDateInTitle() {
  const dateParam = getQueryParam('date');
  if (dateParam) {
    const titleElement = document.querySelector('h2.date-title');
    titleElement.innerHTML = `${dateParam}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  displayDateInTitle();
  const dateParam = getQueryParam('date');
  if (dateParam) {
    // Fetch data from database for this date
    fetchDataFromDatabase(dateParam)
      .then((data) => {
        const troyDayResults = data.troyDayResults;
        const numPasses = Object.values(troyDayResults).filter((r) => r.passes).length;
        const isTroyDay = numPasses >= 6;
        const troyDayPercentage = (numPasses / 10) * 100;
        displayResults(troyDayResults, isTroyDay, troyDayPercentage);
      })
      .catch((error) => {
        console.error(error);
        document.getElementById('threshold-results').textContent = 'Error fetching data for the specified date.';
      });
  } else {
    // Main Page (no date parameter), prompt user to click the button to get today's data
    document.getElementById('threshold-results').textContent = "Click the button to get today's weather data.";
  }

  document.getElementById('view-history-btn').addEventListener('click', () => {
    window.location.href = 'php/history.php';
  });
});

document.getElementById('get-weather-btn').addEventListener('click', getTodaysData);
