var forecastContainerEl = $("#forecast-container");
var cityBtnEl = $("#city-btn");
var cityInputEl = $("#city-input");
var searchContainerEl = $("#search-container");
var apiKey = "52ddee8b9cafd9b6965728682363181a";
var currentCity;
var cityWeather;
var futureWeather = [];
var searchHistory = [];

var getCityCoordinates = function(city) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey;
    
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                currentCity = data[0];

                if(currentCity) {
                    getCurrentWeather();
                }
                else {
                    displayError("not found");
                    return;
                }
                
            })
        }
        else {
            displayError("not found");
            return;
        }
    })
    .catch(function(error) {
        displayError("couldn't reach");
        return;
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
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + currentCity.lat + "&lon=" + currentCity.lon + "&units=imperial&appid=" + apiKey;
    
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            futureWeather = data.list;
            displayFutureWeather();
        })
    });
};

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
    humidSpan.text("Humidity: " + cityWeather.main.humidity + "%");

    dateAndWeather.append(weatherImg);
    forecastToday.append(dateAndWeather);
    forecastToday.append(temperatureSpan);
    forecastToday.append(windSpan);
    forecastToday.append(humidSpan);
    forecastContainerEl.append(forecastToday);
};

var displayFutureWeather = function() {
    var futureContainer = $("<div></div");
    
    var fiveDayHeader = $("<h4></h4>");
    fiveDayHeader.addClass("pt-2");
    fiveDayHeader.text("5-day Forecast");

    var futureWeatherContainer = $("<div></div>");
    futureWeatherContainer.addClass("d-flex justify-content-between");

    for(var i = 7; i < 40; i += 8) {
        var forecastDiv = $("<div></div>");
        forecastDiv.addClass("bg-primary pl-1 pr-3 shadow text-light");

        console.log(futureWeather);
        date = moment(futureWeather[i].dt * 1000).format("MM/DD/YYYY");

        var futureWeatherDate = $("<h5></h5>").text(date);

        var futureWeatherIcon = $("<img></img>");
        var imgUrl = "http://openweathermap.org/img/wn/" + futureWeather[i].weather[0].icon + ".png";
        futureWeatherIcon.attr("src", imgUrl);

        var temperatureSpan = $("<div></div>")
            .addClass("mb-1")
            .text("Temp: " + futureWeather[i].main.temp + "°F");

        var windSpan = $("<div></div>")
            .addClass("mb-1")
            .text("Wind: " + futureWeather[i].wind.speed + " MPH");

        var humidSpan = $("<div></div>")
            .addClass("mb-3")
            .text("Humidity: " + futureWeather[i].main.humidity + "%");

        forecastDiv.append(futureWeatherDate);
        forecastDiv.append(futureWeatherIcon);
        forecastDiv.append(temperatureSpan);
        forecastDiv.append(windSpan);
        forecastDiv.append(humidSpan);
        futureWeatherContainer.append(forecastDiv);
    }

    futureContainer.append(fiveDayHeader);
    futureContainer.append(futureWeatherContainer);

    forecastContainerEl.append(futureContainer);

};

var submitCity = function(event) {
    if(cityInputEl.val()) {
        city = cityInputEl.val();
        forecastContainerEl.empty();
        saveSearch(city);

        getCityCoordinates(city);
    }
};

var submitCityBtn = function(event) {
    if(event.target.classList.contains("history-btn")) {
        city = event.target.textContent;
        forecastContainerEl.empty();

        getCityCoordinates(city);
    }
};

var saveSearch = function(city) {
    if(searchHistory.length > 6) {
        searchHistory.shift();
    }
    searchHistory.push(city);

    localStorage.setItem("history", JSON.stringify(searchHistory));
};

var loadHistory = function() {
    searchHistory = JSON.parse(localStorage.getItem("history"));
    while(searchHistory.length > 6) {
        searchHistory.shift();
    }

    var historyContainer = $("<div></div>")
        .addClass("border-top border-dark mt-3 pt-2");
    
    for(var i = 0; i < searchHistory.length; i++) {
        var historyBtn = $("<button></button>")
            .addClass("btn btn-secondary btn-block shadow history-btn")
            .text(searchHistory[i]);

        historyContainer.append(historyBtn);
    }

    searchContainerEl.append(historyContainer);
};

var removeChildren = function() {
    while(forecastContainerEl.firstChild) {
        forecastContainerEl.removeChild(forecastContainerEl.firstChild);
    }
};

var displayError = function(error) {
    var errorDiv = $("<div></div>")
    if(error === "not found") {
        errorDiv.text("We couldn't find that city. Please try again.");
    }
    else if (error === "couldn't reach") {
        errorDiv.text("OpenWeather service couldn't be reached. Please try again.");
    }

    forecastContainerEl.append(errorDiv);
};

loadHistory();

cityBtnEl.on("click", submitCity);
searchContainerEl.on("click", submitCityBtn);