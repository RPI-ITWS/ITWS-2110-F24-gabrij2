
export const troyDayCriteria = {
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
  