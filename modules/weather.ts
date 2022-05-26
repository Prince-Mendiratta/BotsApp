export
const inputSanitization = require("../sidekick/input-sanitization");
const https = require("https");
const config = require("../config");
const apiKey = config.WEATHER_API_KEY;
const Strings = require("../lib/db");
const WEATHER = Strings.weather;
const TRANSMIT = require('../core/transmission')
require('python-format-js');

module.exports = {
    name: "weather",
    description: WEATHER.DESCRIPTION,
    extendedDescription: WEATHER.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [
            ".weather Nsawam",
            ".weather Asokwa",
            ".weather Accra tomorrow",
        ],
    },
    async handle(client, chat, BotsApp, args) {

        let cityName;
        try {
            const weatherTypes = {
                sunny: "sunny",
                clear: "clear",
                cloud: "cloud",
                overcast: "overcast",
                rain: "rain",
                drizzle: "drizzle",
                snow: "snow",
                storm: "storm",
                fog: "fog",
                haze: "haze",
                mist: "mist",
            };
            const result = async (imageUrl, weatherDataVariables, downloading) => {
                await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {image:{url:imageUrl},caption:WEATHER.WEATHER_DATA.format(weatherDataVariables),thumbnail:null})
                .catch(err => inputSanitization.handleError(err, client, BotsApp));

            };
            if (args.length < 1) {
                return await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: WEATHER.CITY_NAME_REQUIRED})
            } else if (
                args[args.length - 1] === "tom" ||
                args[args.length - 1] === "tomorrow"
            ) {
                var downloading = await TRANSMIT.sendMessageWTyping(client, BotsApp.chat, {text: WEATHER.DOWNLOADING})

                args[args.length - 1] = "";
                cityName = args.join(" ");
                const unit = "metric";

                const url =
                    "https://api.openweathermap.org/data/2.5/forecast?q=" +
                    cityName +
                    "&appid=" +
                    apiKey +
                    "&units=" +
                    unit +
                    "&cnt=" +
                    8;

                https.get(url, function (response) {
                    response.on("error", (err) => {
                        throw err;
                    });
                    response.on("data", function (data) {
                        try {
                            const weatherData = JSON.parse(data);
                            const tempInC = Number(
                                weatherData.list[7].main.temp
                            ).toFixed(2);
                            // @ts-ignore
                            const tempInF = (tempInC * 1.8 + 32).toFixed(2);
                            const minTempInC = Number(
                                weatherData.list[7].main.temp_min
                            ).toFixed(2);
                            // @ts-ignore
                            const minTempInF = (minTempInC * 1.8 + 32).toFixed(
                                2
                            );
                            const maxTempInC = Number(
                                weatherData.list[7].main.temp_max
                            ).toFixed(2);
                            // @ts-ignore
                            const maxTempInF = (maxTempInC * 1.8 + 32).toFixed(
                                2
                            );

                            const humidity = Number(
                                weatherData.list[7].main.humidity
                            ).toFixed(2);

                            const windSpeedInkmph = (
                                Number(weatherData.list[7].wind.speed) * 3.6
                            ).toFixed(2);
                            // @ts-ignore
                            const windSpeedInmph = (
                                +windSpeedInkmph * 0.621371
                            ).toFixed(2);
                            const windDegree =
                                weatherData.list[7].wind.deg.toFixed(2);

                            const sunriseTimeStamp = Number(
                                weatherData.city.sunrise
                            );
                            var sunriseDate = new Date(sunriseTimeStamp);
                            const sunriseTime =
                                sunriseDate.getHours() +
                                ":" +
                                sunriseDate.getMinutes() +
                                ":" +
                                sunriseDate.getSeconds();
                            const sunsetTimeStamp = Number(
                                weatherData.city.sunset
                            );
                            var sunsetDate = new Date(sunsetTimeStamp);
                            const sunsetTime =
                                sunsetDate.getHours() +
                                ":" +
                                sunsetDate.getMinutes() +
                                ":" +
                                sunsetDate.getSeconds();

                            var weatherDescription =
                                weatherData.list[7].weather[0].description;

                            let imageName
                            for (var type in weatherTypes) {
                                if (
                                    weatherDescription.includes(
                                        weatherTypes[type]
                                    )
                                ) {
                                    imageName = weatherTypes[type];
                                    break;
                                } else {
                                    imageName = "fallback";
                                }
                            }
                            weatherDescription =
                                weatherDescription.toUpperCase();
                            cityName = weatherData.city.name;
                            const country = weatherData.city.country;
                            const timeOfRequest = weatherData.list[7].dt * 1000;
                            var date = new Date(timeOfRequest);

                            const dateAndTime =
                                date.getDate() +
                                "/" +
                                (date.getMonth() + 1) +
                                "/" +
                                date.getFullYear() +
                                " " +
                                date.getHours() +
                                ":" +
                                date.getMinutes() +
                                ":" +
                                date.getSeconds();
                            const weatherDataVariables = {
                                tempInC: tempInC,
                                tempInF: tempInF,
                                minTempInC: minTempInC,
                                minTempInF: minTempInF,
                                maxTempInC: maxTempInC,
                                maxTempInF: maxTempInF,
                                humidity: humidity,
                                windSpeedInkmph: windSpeedInkmph,
                                windSpeedInmph: windSpeedInmph,
                                degree: windDegree,
                                sunriseTime: sunriseTime,
                                sunsetTime: sunsetTime,
                                weatherDescription: weatherDescription,
                                cityName: cityName,
                                country: country,
                                dateAndTime: dateAndTime,
                            };

                            const imageUrl =
                                "https://raw.githubusercontent.com/Prince-Mendiratta/BotsApp-Resources/main/weather/" +
                                imageName +
                                ".jpg";
                            result(imageUrl, weatherDataVariables, downloading);
                        } catch (err) {

                            inputSanitization.handleError(
                                err,
                                client,
                                BotsApp,
                                WEATHER.ERROR_OCCURED
                            );
                        }
                    });
                });
                return;
            } else {
                cityName = args.join(" ");
                const unit = "metric";

                const url =
                    "https://api.openweathermap.org/data/2.5/weather?q=" +
                    cityName +
                    "&appid=" +
                    apiKey +
                    "&units=" +
                    unit;

                https.get(url, function (response) {
                    response.on("error", (err) => {
                        throw err;
                    });
                    response.on("data", function (data) {
                        try {
                            const weatherData = JSON.parse(data);
                            const tempInC = Number(
                                weatherData.main.temp
                            ).toFixed(2);
                            // @ts-ignore
                            const tempInF = (tempInC * 1.8 + 32).toFixed(2);
                            const minTempInC = Number(
                                weatherData.main.temp_min
                            ).toFixed(2);
                            // @ts-ignore
                            const minTempInF = (minTempInC * 1.8 + 32).toFixed(
                                2
                            );
                            const maxTempInC = Number(
                                weatherData.main.temp_max
                            ).toFixed(2);
                            // @ts-ignore
                            const maxTempInF = (maxTempInC * 1.8 + 32).toFixed(
                                2
                            );
                            const humidity = Number(
                                weatherData.main.humidity
                            ).toFixed(2);
                            const windSpeedInkmph = (
                                Number(weatherData.wind.speed) * 3.6
                            ).toFixed(2);
                            // @ts-ignore
                            const windSpeedInmph = (
                                +windSpeedInkmph * 0.621371
                            ).toFixed(2);
                            const windDegree = weatherData.wind.deg.toFixed(2);
                            const sunriseTimeStamp = Number(
                                weatherData.sys.sunrise
                            );
                            var sunriseDate = new Date(sunriseTimeStamp);
                            const sunriseTime =
                                sunriseDate.getHours() +
                                ":" +
                                sunriseDate.getMinutes() +
                                ":" +
                                sunriseDate.getSeconds();
                            const sunsetTimeStamp = Number(
                                weatherData.sys.sunset
                            );
                            var sunsetDate = new Date(sunsetTimeStamp);
                            const sunsetTime =
                                sunsetDate.getHours() +
                                ":" +
                                sunsetDate.getMinutes() +
                                ":" +
                                sunsetDate.getSeconds();
                            var weatherDescription =
                                weatherData.weather[0].description;
                            let imageName
                            for (var type in weatherTypes) {
                                if (
                                    weatherDescription.includes(
                                        weatherTypes[type]
                                    )
                                ) {
                                    imageName = weatherTypes[type];
                                    break;
                                } else {
                                    imageName = "fallback";
                                }
                            }
                            weatherDescription =
                                weatherDescription.toUpperCase();
                            cityName = weatherData.name;
                            const country = weatherData.sys.country;
                            const timeOfRequest = weatherData.dt * 1000;
                            var date = new Date(timeOfRequest);

                            const dateAndTime =
                                date.getDate() +
                                "/" +
                                (date.getMonth() + 1) +
                                "/" +
                                date.getFullYear() +
                                " " +
                                date.getHours() +
                                ":" +
                                date.getMinutes() +
                                ":" +
                                date.getSeconds();
                            const weatherDataVariables = {
                                tempInC: tempInC,
                                tempInF: tempInF,
                                minTempInC: minTempInC,
                                minTempInF: minTempInF,
                                maxTempInC: maxTempInC,
                                maxTempInF: maxTempInF,
                                humidity: humidity,
                                windSpeedInkmph: windSpeedInkmph,
                                windSpeedInmph: windSpeedInmph,
                                degree: windDegree,
                                sunriseTime: sunriseTime,
                                sunsetTime: sunsetTime,
                                weatherDescription: weatherDescription,
                                cityName: cityName,
                                country: country,
                                dateAndTime: dateAndTime,
                            };
                            const imageUrl =
                                "https://raw.githubusercontent.com/Prince-Mendiratta/BotsApp-Resources/main/weather/" +
                                imageName +
                                ".jpg";

                            result(imageUrl, weatherDataVariables, downloading);
                        } catch (err) {
                            inputSanitization.handleError(
                                err,
                                client,
                                BotsApp,
                                WEATHER.ERROR_OCCURED
                            );
                            return;
                        }
                    });
                });
                return;
            }
        } catch (err) {
            inputSanitization.handleError(
                err,
                client,
                BotsApp,
                WEATHER.ERROR_OCCURED
            );
        }
    },
};
