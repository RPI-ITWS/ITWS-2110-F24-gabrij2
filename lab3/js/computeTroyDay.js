// computeTroyDay.js

import { troyDayCriteria } from './troyDayCriteria.js';
import { calculateDaylightHours } from './utils.js';

export function computeTroyDay(data) {
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
