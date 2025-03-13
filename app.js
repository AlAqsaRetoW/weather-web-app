// 

function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {

                    let latitude = position.coords.latitude;
                    let longitude = position.coords.longitude;

                    resolve({ latitude, longitude });


                },
                (error) => {
                    console.error("Error getting location:", error.message);
                    reject(error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    })
}

function getWeatherApiUrl(latitude, longitude) {
    let apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&$longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,rain_sum,showers_sum&hourly=temperature_2m,weather_code,wind_speed_10m,rain,wind_direction_10m,showers,apparent_temperature&current=temperature_2m,is_day,wind_speed_10m,weather_code,showers,apparent_temperature&timezone=auto`

    getLocation();

    return apiUrl;
}

const fetchWeather = async () => {
    try {

        const location = await getLocation();

        const apiUrl = getWeatherApiUrl(location.latitude, location.longitude);

        const res = await fetch(apiUrl);

        const data = await res.data();
        console.log(data)
    } catch (err) {
        console.error(err)
    }
}

