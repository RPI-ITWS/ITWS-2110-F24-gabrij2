export function getUserLocation() {
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
  