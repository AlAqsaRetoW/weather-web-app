/* DOM Selector */

const cityInput = document.getElementById('city-input') // input
const weatherIcon = document.getElementById('weather-icon') //curr weather icon
const cityDisplay = document.getElementById('city-display')

const daily = document.getElementById('daily');
const date = document.getElementById('date');
const currTemp = document.getElementById('temperature');
const minTemp = document.getElementById('min-temp');
const maxTemp = document.getElementById('max-temp');
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

const getGeocoding = async () => {
    let name = cityInput.value;
    cityDisplay.innerText = name;


    const GEOCODING_URL = `https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=1&language=en&format=json`;

    const response = await fetch(GEOCODING_URL);
    const data = await response.json();

    let latitude = data.results[0].latitude;
    let longitude = data.results[0].longitude;
    const apiUrl = getApiUrl(latitude, longitude);
    getWeatherData(apiUrl).then(
        data => {
            // Process and display the weather data
            console.log(data);
            date.innerText = formattedDate(data.current.time);
            temperature.innerText = data.current.temperature_2m;
            temperature.innerText += data.current_units.temperature_2m;
            humidity.innerText = data.current.relative_humidity_2m + data.current_units.relative_humidity_2m;
            windSpeed.innerText = data.current.wind_speed_10m + data.current_units.wind_speed_10m;
            minTemp.innerText = `Min Temperature - ${data.daily.temperature_2m_min[0]} ${data.daily_units.temperature_2m_min}`;
            maxTemp.innerText = `Max Temperature - ${data.daily.temperature_2m_max[0]} ${data.daily_units.temperature_2m_max}`;
            airPressure.innerText = data.current.surface_pressure;

            daily.innerHTML = ``

            for (let i = 1; i < data.daily.time.length; i++) {
                daily.innerHTML +=
                    `
                    <div class="col-4 col-sm-3 col-md-auto col-lg">
                        <div class="card bg-gradient text-white text-center rounded-3 border-0"
                            style="max-width: 106px; max-height: 176px">
                            <div class="card-body d-flex flex-column">
                                <h5 class="fs-5">
                                    ${formattedShortDate(data.daily.time[i])}
                                </h5>
                                <img src="/assets/images/windy-sunny-1.png" width="70" height="70" style="margin: 0 auto;" />
                                <span class="fs-5">${data.daily.temperature_2m_max[i]}${data.daily_units.temperature_2m_max}</span>
                            </div>
                        </div>
                    </div>
                   `
            }
        })
        .catch(error => console.error(error));
};

const formattedDate = (date) => {
    const options = {
        weekday: 'long'  // Only keep weekday option
    };
    const newDate = new Date(date);
    return newDate.toLocaleDateString('en-US', options);
};

const formattedShortDate = (date) => {
    const options = {
        weekday: 'short'
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
        // console.log(data);
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
            temperature.innerText = data.current.temperature_2m;
            temperature.innerText += data.current_units.temperature_2m;
            humidity.innerText = data.current.relative_humidity_2m + data.current_units.relative_humidity_2m;
            windSpeed.innerText = data.current.wind_speed_10m + data.current_units.wind_speed_10m;
            minTemp.innerText = `Min Temperature - ${data.daily.temperature_2m_min[0]} ${data.daily_units.temperature_2m_min}`;
            maxTemp.innerText = `Max Temperature - ${data.daily.temperature_2m_max[0]} ${data.daily_units.temperature_2m_max}`;
            airPressure.innerText = data.current.surface_pressure;

            daily.innerHTML = ``

            for (let i = 1; i < data.daily.time.length; i++) {
                daily.innerHTML +=
                    `
                    <div class="col-4 col-sm-3 col-md-auto col-lg">
                        <div class="card bg-gradient text-white text-center rounded-3 border-0"
                            style="max-width: 106px; max-height: 176px">
                            <div class="card-body d-flex flex-column">
                                <h5 class="fs-5">
                                    ${formattedShortDate(data.daily.time[i])}
                                </h5>
                                <img src="windy-sunny-1.png" width="70" height="70" style="margin: 0 auto;" />
                                <span class="fs-5">${data.daily.temperature_2m_max[i]}${data.daily_units.temperature_2m_max}</span>
                            </div>
                        </div>
                    </div>
                   `
            }
        })
        .catch(error => console.error(error));
}

initWeatherApp();