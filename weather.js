const axios = require("axios");
const { WEATHER_TOKEN, WEATHER_BASE_URL } = process.env

const kelvinToCelsius = (temp) => Math.round((temp - 273.15) * 100) / 100

const getCoordsByCityName = async (cityName) => {
    try {
        const resp = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${WEATHER_TOKEN}`)

        if (resp && resp.data.length) {
            const coords = resp.data[0]
            return {
                lat: coords.lat,
                lon: coords.lon,
            }
        }

        return resp
    } catch (e) {
        return 'Not found'
    }
}

const getWeatherByCoords = async ({ lat, lon }) => {
    try {
        const { data } = await axios.get(`${WEATHER_BASE_URL}/data/2.5/weather`, {
            params: {
                lat,
                lon,
                appid: WEATHER_TOKEN
            }
        })

        const { temp, feels_like } = data.main
        const { description } = data.weather[0]

        return {
            temp: kelvinToCelsius(temp),
            feelsLike: kelvinToCelsius(feels_like),
            description,
        }
    } catch (err) {
        return 'Not found'
    }
}

module.exports = {
    getCoordsByCityName,
    getWeatherByCoords,
}