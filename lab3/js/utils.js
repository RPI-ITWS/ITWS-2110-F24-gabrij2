export function calculateDaylightHours(sunrise, sunset) {
    const daylightSeconds = sunset - sunrise;
    const hours = Math.floor(daylightSeconds / 3600);
    const minutes = Math.floor((daylightSeconds % 3600) / 60);
    return { hours, minutes };
  }
  
  export function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  