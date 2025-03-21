/* DOM Selector */

const cityInput = document.getElementById('city-input'); // input
const weatherIcon = document.getElementById('weather-icon'); //curr weather icon
const cityDisplay = document.getElementById('city-display');

const daily = document.getElementById('daily');
const date = document.getElementById('date');
const currTemp = document.getElementById('temperature');
const minTemp = document.getElementById('min-temp');
const maxTemp = document.getElementById('max-temp');
const weatherDesc = document.getElementById('weather-desc');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const uvIndex = document.getElementById('uv-index');
const uvCategory = document.getElementById('uv-category');
const airPressure = document.getElementById('air-pressure');
const apCategory = document.getElementById('ap-category')

const getGeocoding = async () => {
  let name = cityInput.value;
  cityDisplay.innerText = name;

  const GEOCODING_URL = `https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=1&language=en&format=json`;

  try {
    const response = await fetch(GEOCODING_URL);
    const data = await response.json();

    let latitude = data.results[0].latitude;
    let longitude = data.results[0].longitude;

    const weatherUrl = weatherApiUrl(latitude, longitude);
    const aqUrl = aqApiUrl(latitude, longitude);

    const weatherData = await getWeatherData(weatherUrl);
    const airQualityData = await getAirQualityData(aqUrl);

    displayWeatherData(weatherData, airQualityData);
  } catch (error) {
    console.error('Error fetching geocoding data:', error);
  }
};

/*
Daily: weather code, min-temp, max-temp, uv index
Curent weather: temp, weather code, wind speed, isDayNight, surface pressure, relative humidity
*/

function weatherApiUrl(latitude, longitude) {
  return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,uv_index_max,temperature_2m_min&current=temperature_2m,weather_code,wind_speed_10m,surface_pressure,is_day,relative_humidity_2m&timezone=auto`
}

function aqApiUrl(latitude, longitude) {
  return `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=us_aqi&current=us_aqi&timezone=auto&forecast_days=1`
}

function getLocation() {
  // Default coordinates for Jakarta, Indonesia
  const DEFAULT_LATITUDE = -6.194758990777724;
  const DEFAULT_LONGITUDE = 106.82303078638766;

  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          resolve({ latitude, longitude });
        },
        (error) => {
          console.warn(`Geolocation error: ${error.message}. Using default location.`);
          resolve({
            latitude: DEFAULT_LATITUDE,
            longitude: DEFAULT_LONGITUDE
          });
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser. Using default location.");
      resolve({
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE
      });
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

async function getAirQualityData(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching air quality data: ${error}`);
  }
}

async function initWeatherApp() {
  try {
    const { latitude, longitude } = await getLocation();

    const weatherUrl = weatherApiUrl(latitude, longitude);
    const aqUrl = aqApiUrl(latitude, longitude);

    const weatherData = await getWeatherData(weatherUrl);
    const airQualityData = await getAirQualityData(aqUrl);

    displayWeatherData(weatherData, airQualityData);
  } catch (error) {
    console.error(error);
  }
}

function displayWeatherData(weatherData, airQualityData) {
  console.log(weatherData, airQualityData);

  // Weather data
  date.innerText = formattedDate(weatherData.current.time);
  currTemp.innerText = Math.round(weatherData.current.temperature_2m) + weatherData.current_units.temperature_2m;
  humidity.innerText = weatherData.current.relative_humidity_2m + weatherData.current_units.relative_humidity_2m;
  windSpeed.innerText = Math.round(weatherData.current.wind_speed_10m) + weatherData.current_units.wind_speed_10m;
  minTemp.innerText = `Min Temperature - ${Math.round(weatherData.daily.temperature_2m_min[0])} ${weatherData.daily_units.temperature_2m_min}`;
  maxTemp.innerText = `Max Temperature - ${Math.round(weatherData.daily.temperature_2m_max[0])} ${weatherData.daily_units.temperature_2m_max}`;
  weatherDesc.innerText = WMO[weatherData.current.weather_code].day.description;
  
  weatherIcon.innerHTML = `<img src="${
    WMO[weatherData.current.weather_code].day.image
  }" class="weather-main-icon"/>`;

  // Air Pressure
  const pressureValue = Math.round(weatherData.current.surface_pressure);
  airPressure.innerText = pressureValue;
  const pressureCategory = getAirPressureCategory(pressureValue);
  apCategory.innerHTML = `<span class="${pressureCategory.color}">${pressureCategory.category}</span>`;

  // UV Index
  const uvValue = Math.round(weatherData.daily.uv_index_max[0]);
  uvIndex.innerText = uvValue;
  const uvCategoryInfo = getUvCategory(uvValue);
  uvCategory.innerHTML = `<span class="${uvCategoryInfo.color}">${uvCategoryInfo.category}</span>`;

  // Air Quality
  const aqIndex = document.getElementById('aq-index');
  const aqCategory = document.getElementById('aq-category');


  const aqiValue = airQualityData.current.us_aqi;
  aqIndex.innerText = aqiValue;

  const airQualityInfo = getAirQualityCategory(aqiValue);
  aqCategory.innerHTML = `<span class="${airQualityInfo.color}">${airQualityInfo.category}</span>`;


  daily.innerHTML = '';
  for (let i = 1; i < weatherData.daily.time.length; i++) {
    daily.innerHTML += `
      <div class="col-4 col-sm-3 col-md-auto col-lg">
        <div class="card bg-gradient text-white text-center rounded-3 border-0"
            style="max-width: 106px; max-height: 176px">
            <div class="card-body d-flex flex-column">
                <h5 class="fs-5">
                    ${formattedShortDate(weatherData.daily.time[i])}
                </h5>
                <img src="${WMO[weatherData.daily.weather_code[i]].day.image}" width="70" height="70" style="margin: 0 auto;" />
                <span class="fs-5">${Math.round(weatherData.daily.temperature_2m_max[i])}${weatherData.daily_units.temperature_2m_max}</span>
            </div>
        </div>
      </div>
    `;
  }
}

initWeatherApp();

//-------------------- Helper --------------------
const formattedDate = (date) => {
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
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

function getAirQualityCategory(aqi) {

  if (aqi <= 50) {
    return {
      category: "Good",
      color: "text-success" // green
    };
  } else if (aqi <= 100) {
    return {
      category: "Moderate",
      color: "text-warning" // yellow
    };
  } else if (aqi <= 150) {
    return {
      category: "Unhealthy for Sensitive Groups",
      color: "text-warning" // orange
    };
  } else if (aqi <= 200) {
    return {
      category: "Unhealthy",
      color: "text-danger" // light red
    };
  } else if (aqi <= 300) {
    return {
      category: "Very Unhealthy",
      color: "text-danger" // red
    };
  } else {
    return {
      category: "Hazardous",
      color: "text-danger" // deep red
    };
  }
}

function getUvCategory(uvIndex) {
  if (uvIndex >= 0 && uvIndex <= 2) {
    return {
      category: "Low",
      color: "text-success"  // green
    };
  } else if (uvIndex >= 3 && uvIndex <= 5) {
    return {
      category: "Moderate",
      color: "text-warning"  // orange/yellow
    };
  } else {
    return {
      category: "High",
      color: "text-danger"   // red
    };
  }
}

function getAirPressureCategory(pressure) {

  if (pressure < 1005.6) {
    return {
      category: "Low",
      color: "text-danger"  // red
    };
  } else if (pressure >= 1005.6 && pressure <= 1020.0) {
    return {
      category: "Normal",
      color: "text-success"  //  green
    };
  } else {
    return {
      category: "High",
      color: "text-primary"  // blue
    };
  }
}
