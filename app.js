// 
function getApiUrl(latitude, longitude) {
    // set parameter on openmeteo later
    return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,uv_index_max&hourly=temperature_2m&current=temperature_2m,precipitation,weather_code,wind_speed_10m,is_day,surface_pressure,showers,rain,wind_direction_10m&timezone=auto`
}

function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    console.log ({latitude, longitude})
                    resolve({ latitude, longitude });
                },
                (error) => {
                    // next: if error, default location
                    reject(`Error getting location: ${error.message}`);
                }
            );
        } else {
            // next: if not supported, default location
            reject("Geolocation is not supported by this browser.");
        }
    });
}

function getWeatherData(apiUrl) {
    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Weather data fetched successfully");
            return data;
        })
        .catch(error => {
            throw new Error(`Error fetching weather data: ${error}`);
        });
}

function initWeatherApp() {
    getLocation()
        .then(({ latitude, longitude }) => {
            const apiUrl = getApiUrl(latitude, longitude);
            return getWeatherData(apiUrl);
        })
        .then(data => {
            // Process and display the weather data
            console.log(data);
        })
        .catch(error => console.error(error));
}

initWeatherApp();