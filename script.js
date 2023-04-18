var searchHistoryList = $("#history");
var searchCityInput = $("#search-input");
var searchCityButton = $("#search-button");
var currentCity = $("#current-city");
var currentTemp = $("#current-temp");
var currentHumidity = $("#current-humidity");
var currentWindSpeed = $("#current-wind");

var APIkey = "6b993bd38295772f03036f665669b708";

var cityList = [];

var currentDate = moment().format("L");
$("#current-date").text("(" + currentDate + ")");

initalizeHistory();

$(document).on("submit", function () {
  event.preventDefault();

  var searchValue = searchCityInput.val().trim();

  currentConditionsRequest(searchValue);
  searchHistory(searchValue);
  searchCityInput.val("");
});
searchCityButton.on("click", function (event) {
  event.preventDefault();

  var searchValue = searchCityInput.val().trim();

  currentConditionsRequest(searchValue);
  searchHistory(searchValue);
  searchCityInput.val("");
});

function currentConditionsRequest(searchValue) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    searchValue +
    "&units=metric&appid=" +
    APIkey;

  var forecastURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    searchValue +
    "&units=metric&appid=" +
    APIkey;

 
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    currentCity.text(response.name);
    currentCity.append("<span id='current-date'>");
    $("#current-date").text("(" + currentDate + ")");
    currentCity.append(
      "<img src='https://openweathermap.org/img/w/" +
        response.weather[0].icon +
        ".png' alt='" +
        response.weather[0].main +
        "' />"
    );
    currentTemp.text("Temp: " + response.main.temp.toFixed(1) + "°C");
    currentHumidity.text("Humidity: " + response.main.humidity + "%");
    currentWindSpeed.text("Wind: " + response.wind.speed.toFixed(1) + "km/h");
  });

  $.ajax({
    url: forecastURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    $("#forecast-5day").empty();
    for (var i = 1; i < response.list.length; i += 8) {
      var forecastDateString = moment(response.list[i].dt_txt).format("L");
      console.log(forecastDateString);

      var forecastCol = $("<div class='col-2'>");
      var forecastCard = $("<div class='card card-fr'>");
      var forecastCardBody = $("<div class='card-body'>");
      var forecastDate = $("<h5 class='card-date'>");
      var forecastIcon = $("<img>");
      var forecastTemp = $("<p class='card-text'>");
      var forecastWind = $("<p class='card-text'>");
      var forecastHumidity = $("<p class='card-text'>");

      $("#forecast-5day").append(forecastCol);
      forecastCol.append(forecastCard);
      forecastCard.append(forecastCardBody);

      forecastCardBody.append(forecastDate);
      forecastCardBody.append(forecastIcon);
      forecastCardBody.append(forecastTemp);
      forecastCardBody.append(forecastWind);
      forecastCardBody.append(forecastHumidity);

      forecastIcon.attr(
        "src",
        "https://openweathermap.org/img/w/" +
          response.list[i].weather[0].icon +
          ".png"
      );
      forecastIcon.attr("alt", response.list[i].weather[0].main);
      forecastDate.text(forecastDateString);
      forecastTemp.text("Temp: " + response.list[i].main.temp + "°C"); // Change to Celsius
      forecastWind.text("Wind: " + response.list[i].wind.speed + "km/h");
      forecastHumidity.text(
        "Humidity: " + response.list[i].main.humidity + "%"
      );
    }
  });
}

function searchHistory(searchValue) {
  if (searchValue) {
    if (cityList.indexOf(searchValue) === -1) {
      cityList.push(searchValue);
      listArray();
    } else {
      var removeIndex = cityList.indexOf(searchValue);
      cityList.splice(removeIndex, 1);

      cityList.push(searchValue);
      listArray();
    }
  }
}

function listArray() {
  searchHistoryList.empty();

  cityList.forEach(function (city) {
    var searchHistoryItem = $('<li class="list-group-item">');
    searchHistoryItem.attr("data-value", city);
    searchHistoryItem.text(city);
    searchHistoryList.prepend(searchHistoryItem);
  });

  localStorage.setItem("cities", JSON.stringify(cityList));
}

function initalizeHistory() {
  if (localStorage.getItem("cities")) {
    cityList = JSON.parse(localStorage.getItem("cities"));
    var lastIndex = cityList.length - 1;
    listArray();
    if (cityList.length !== 0) {
      currentConditionsRequest(cityList[lastIndex]);
    }
  }
}
