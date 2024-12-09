const apiKey = "c580f3a206d96aa35f9969b28f72ef6b";
const loadingText = $("#loading-text");

const updateData = (success, weatherData = {}, errorType = null) => {
  if (success) {
    loadingText.hide();
    $(".details").show();
    $("#city").text(`${weatherData.name} , ${weatherData.sys.country}`);
    $("#weather-icon").attr(
      "src",
      `https://openweathermap.org/img/wn/${weatherData.weather[0].icon.replace(
        "d",
        "n"
      )}.png`
    );
    $("#weather").text(
      `${weatherData.weather[0].main} - ${weatherData.weather[0].description}`
    );
    $("#temperature").text(weatherData.main.temp);
    $("#humidity").text(weatherData.main.humidity);
    $("#clouds").text(weatherData.clouds.all);
    $("#wind-speed").text(weatherData.wind.speed);
    $("#visibility").text(weatherData.visibility / 1000);
  } else {
    loadingText.show();
    $(".details").hide();
    if (errorType == "not-found") {
      loadingText.text(
        "Can't get the location you entered. Please enter a correct location."
      );
    } else if (errorType == "weather") {
      loadingText.text("Can't get weather information. Please try again.");
    } else {
      loadingText.text(
        "Can't get location information. Please search a location in the search bar."
      );
    }
  }
};

const getLocation = () => {
  loadingText.text("Loading...");
  $.getJSON("https://ipinfo.io/json", function (data) {
    getWeatherData(data.city);
  }).fail(() => {
    updateData(false);
  });
};

const getWeatherData = (city) => {
  loadingText.text("Loading...");
  $.getJSON(
    `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${apiKey}&q=${city}`,
    function (data) {
      updateData(true, data);
    }
  ).fail(function (error) {
    if (error.status == 404) {
      updateData(false, {}, "not-found");
    } else {
      updateData(false, {}, "weather");
    }
  });
};

const eventHandler = () => {
  const searchQuery = $("#search-text").val();
  if (searchQuery) {
    getWeatherData(searchQuery);
  } else {
    loadingText.text("Please enter city name to search.");
  }
};

$("#search-form").submit(function (e) {
  e.preventDefault();
  eventHandler();
});
$("#search-button").click(function (e) {
  e.preventDefault();
  eventHandler();
});

getLocation();
