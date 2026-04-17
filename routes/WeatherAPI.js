const express = require("express");
const { getWeather } = require("../controllers/WeatherController.js");
const router = express.Router();

router.get("/", getWeather);

module.exports = router;