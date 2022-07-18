var forecastContainerEl = $("#forecast-container");
var apiKey = "52ddee8b9cafd9b6965728682363181a";
var currentCity;
var cityWeather;

var getCityCoordinates = function() {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=Orlando&appid=" + apiKey;
    
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            currentCity = data[0];

            console.log(currentCity);

            getCurrentWeather();
        })
    })
};

var getCurrentWeather = function() {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + currentCity.lat + "&lon=" + currentCity.lon + "&units=imperial&appid=" + apiKey;

    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            cityWeather = data;

            displayTodaysWeather();

            getFutureWeather();
        })
    })
};

var getFutureWeather = function() {
    displayFutureWeather();
}

var displayTodaysWeather = function() {
    var forecastToday = $("<div></div>");
    forecastToday.addClass("border border-dark");
            
    var dateAndWeather = $("<h3></h3>");
    var date = moment().format("MM/DD/YYYY");
    dateAndWeather.text(currentCity.name + " (" + date + ")");
    dateAndWeather.addClass("ml-2");

    var weatherImg = $("<img></img>");
    var imgUrl = "http://openweathermap.org/img/wn/" + cityWeather.weather[0].icon + ".png";
    weatherImg.attr("src", imgUrl);

    var temperatureSpan = $("<div></div>");
    temperatureSpan.addClass("mb-3 ml-2");
    temperatureSpan.text("Temp: " + cityWeather.main.temp + "°F");

    var windSpan = $("<div></div>");
    windSpan.addClass("mb-3 ml-2");
    windSpan.text("Wind: " + cityWeather.wind.speed + " MPH");

    var humidSpan = $("<div></div>");
    humidSpan.addClass("mb-3 ml-2");
    humidSpan.text("Humidity: " + cityWeather.main.humidity + " %");

    dateAndWeather.append(weatherImg);
    forecastToday.append(dateAndWeather);
    forecastToday.append(temperatureSpan);
    forecastToday.append(windSpan);
    forecastToday.append(humidSpan);
    forecastContainerEl.append(forecastToday);
}

var displayFutureWeather = function() {
    var futureContainer = $("<div></div");
    
    var fiveDayHeader = $("<h4></h4>");
    fiveDayHeader.text("5-day Forecast");

    var futureWeatherContainer = $("<div></div>");
    futureWeatherContainer.addClass("d-flex justify-content-between");

    for(var i = 0; i < 5; i++) {
        var forecastDiv = $("<div></div>");
        forecastDiv.addClass("bg-info");

        futureWeatherContainer.append(forecastDiv);
    }

    futureContainer.append(fiveDayHeader);
    futureContainer.append(futureWeatherContainer);

    forecastContainerEl.append(futureContainer);
}

getCityCoordinates();