const { asyncHandler } = require("../utils/AsyncHandler.js")
const { ApiError } = require("../utils/ApiError.js")
const { ApiResponse } = require("../utils/ApiResponse.js")
const axios = require("axios")

// Using Open-Meteo API (free, no key required)
const getWeather = asyncHandler(async (req, res) => {
  const { lat, lng } = req.query
  
  if (!lat || !lng) {
    throw new ApiError(400, "Latitude and longitude are required")
  }
  
  try {
    // Get current weather
    const currentResponse = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: lat,
        longitude: lng,
        current: "temperature_2m,humidity_2m,weather_code,wind_speed_10m",
        timezone: "auto"
      }
    })
    
    // Get forecast
    const forecastResponse = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: lat,
        longitude: lng,
        daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum",
        timezone: "auto",
        forecast_days: 5
      }
    })
    
    const current = currentResponse.data.current
    const daily = forecastResponse.data.daily
    
    // Format response
    const weatherData = {
      current: {
        temp: Math.round(current.temperature_2m),
        humidity: current.humidity_2m,
        wind: current.wind_speed_10m,
        description: getWeatherDescription(current.weather_code),
        icon: getWeatherIcon(current.weather_code)
      },
      forecast: daily.time.map((date, index) => ({
        day: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        temp: Math.round(daily.temperature_2m_max[index]),
        minTemp: Math.round(daily.temperature_2m_min[index]),
        rain: daily.precipitation_sum[index] || 0,
        icon: getWeatherIcon(daily.weather_code[index])
      }))
    }
    
    return res.status(200).json(
      new ApiResponse(200, weatherData, "Weather data fetched successfully")
    )
  } catch (error) {
    throw new ApiError(500, "Failed to fetch weather data: " + error.message)
  }
})

const getWeatherDescription = (code) => {
  const codes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm"
  }
  return codes[code] || "Unknown"
}

const getWeatherIcon = (code) => {
  if (code === 0) return "sun"
  if ([1, 2].includes(code)) return "cloud"
  if (code === 3) return "cloud"
  if ([45, 48].includes(code)) return "fog"
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "rain"
  if ([71, 73, 75, 85, 86].includes(code)) return "snow"
  if (code >= 90) return "storm"
  return "cloud"
}

module.exports = { getWeather }
