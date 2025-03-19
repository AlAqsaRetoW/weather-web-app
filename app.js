/* DOM Selector */

const cityInput = document.getElementById('city-input')

const daily = document.getElementById('daily');
const cityDisplay = document.getElementById('city-display');
const date = document.getElementById('date');
const minTemp = document.getElementById('min-temp');
const maxtemp = document.getElementById('max-temp');
const weatherDesc = document.getElementById('weather-desc');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const uvIndex = document.getElementById('uv-index');
const airPressure = document.getElementById('air-pressure')


/*
API
Daily: weather code, min-temp, max-temp, uv index
Curent weather: temp, weather code, wind speed, isDayNight, surface pressure, relative humidity
*/

const formattedDate = (date) => {
    const options = {
        weekday: 'long'  // Only keep weekday option
    };
    const newDate = new Date(date);
    return newDate.toLocaleDateString('en-US', options);
};

function getApiUrl(latitude, longitude) {
    return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,uv_index_max,temperature_2m_min&current=temperature_2m,weather_code,wind_speed_10m,surface_pressure,is_day,relative_humidity_2m&timezone=auto`
}

function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    // console.log ({latitude, longitude}) udah bisa
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

async function getWeatherData(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error fetching weather data: ${error}`);
    }
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
            date.innerText = formattedDate(data.current.time);
        })
        .catch(error => console.error(error));
}

initWeatherApp();