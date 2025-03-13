// 
function getApiUrl(latitude, longitude) {
    return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,rain_sum,showers_sum&hourly=temperature_2m,weather_code,wind_speed_10m,rain,wind_direction_10m,showers,apparent_temperature&current=temperature_2m,is_day,wind_speed_10m,weather_code,showers,apparent_temperature&timezone=auto`;
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
                    reject(`Error getting location: ${error.message}`);
                }
            );
        } else {
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

            // console.log(apiUrl);
            return getWeatherData(apiUrl);
        })
        .then(data => {
            // Process and display the weather data
            console.log(data);
        })
        .catch(error => console.error(error));
}

initWeatherApp();