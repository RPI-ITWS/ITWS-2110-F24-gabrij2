import { WEATHER_API_URL, API_KEY } from './constants.js';

export async function fetchWeatherData(lat, lon) {
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

export async function fetchDataFromDatabase(date) {
  try {
    const response = await fetch('php/get_data.php?date=' + encodeURIComponent(date));
    const result = await response.json();
    if (result.success) {
      return result.data;
    } else {
      throw new Error('Error fetching data: ' + result.message);
    }
  } catch (error) {
    throw new Error('Error fetching data from server: ' + error.message);
  }
}

export async function storeDataInDatabase(weatherData, troyDayResults, date) {
  try {
    const response = await fetch('php/store.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        weatherData: weatherData,
        troyDayResults: troyDayResults,
        date: date,
      }),
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error('Error storing data: ' + result.message);
    }
  } catch (error) {
    throw new Error('Error sending data to server: ' + error.message);
  }
}

export async function storeUpdatedDataInDatabase(updatedResults, date) {
  try {
    const response = await fetch('php/update_data.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        troyDayResults: updatedResults,
        date: date,
      }),
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error('Error updating data: ' + result.message);
    }
  } catch (error) {
    throw new Error('Error sending updated data to server: ' + error.message);
  }
}

export async function fetchQuote(isTroyDay) {
  const quoteType = isTroyDay ? 'random' : 'random'; // Adjust as needed
  const quoteUrl = `php/get_quote.php?type=${quoteType}`;

  const response = await fetch(quoteUrl);
  if (!response.ok) throw new Error("Quote API error");
  const data = await response.json();

  return data;
}
