const apiKey = '9d2649b8bf20dcca2ebd0ffc68b467fb';
const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const forecastHeading = document.getElementById('forecast-heading');
const forecast = document.getElementById('forecast');

// Event listener for form submission
form.addEventListener('submit', function(event) {
  event.preventDefault();
  let city = cityInput.value;
  getWeather(city);
});

// Retrieve weather data for a given city
function getWeather(city) {

// Fetch current weather data
fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      saveSearchHistory(city);
    })
    .catch(error => {
      console.error('Error fetching current weather:', error);
    });

  // Fetch 5-Day forecast data
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      displayForecast(data);
      forecastHeading.classList.remove('hidden'); // Show the forecast heading
    })
    .catch(error => {
      console.error('Error fetching forecast:', error);
    });
}

// Display current weather data
function displayCurrentWeather(data) {
  var cityName = data.name;
  var date = new Date(data.dt * 1000).toLocaleDateString();
  var icon = data.weather[0].icon;
  var temperature = convertKelvinToCelsius(data.main.temp); // Convert temperature to Celsius
  var humidity = data.main.humidity;
  var windSpeed = data.wind.speed;

  var currentWeatherHTML = `
  <h2>${cityName}</h2>
  <p>Date: ${date}</p>
  <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
  <p>Temperature: ${temperature} &#8451;</p>
  <p>Humidity: ${humidity}%</p>
  <p>Wind Speed: ${windSpeed} m/s</p>
`;

currentWeather.innerHTML = currentWeatherHTML;

// Save current weather data to local storage
localStorage.setItem('currentWeather', JSON.stringify(data));
}

// Helper function to convert Kelvin to Celsius
function convertKelvinToCelsius(kelvin) {
  return Math.round(kelvin - 273.15);
}

// Display forecast data
function displayForecast(data) {
  var forecastData = data.list.slice(0, 5); // Take the first 5 days of forecast

  let forecastHTML = '';
  forecastData.forEach((item, index) => {
    var date = new Date(item.dt * 1000).toLocaleDateString();
    var icon = item.weather[0].icon;
    var temperature = convertKelvinToCelsius(item.main.temp); // Convert temperature to Celsius
    var humidity = item.main.humidity;
    var windSpeed = item.wind.speed;

    // Add days to the current date to get the forecast date
    var forecastDate = new Date();
    forecastDate.setDate(forecastDate.getDate() + index + 1);
    var forecastDateString = forecastDate.toLocaleDateString();

    var forecastCardHTML = `
      <div class="forecast-card">
        <h3>${forecastDateString}</h3>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
        <p>Temperature: ${temperature} &#8451;</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      </div>
    `;

    forecastHTML += forecastCardHTML;
  });

  forecast.innerHTML = forecastHTML;

  // Save forecast data to local storage
  localStorage.setItem('forecastData', JSON.stringify(data.list));
}

// Save search history
function saveSearchHistory(city) {
  var searchHistoryItem = document.createElement('p');
  searchHistoryItem.textContent = city;
  searchHistoryItem.addEventListener('click', function() {
    getWeather(city);
  });

// Limit the number of history items to 10
if (searchHistory.childElementCount >= 10) {
  searchHistory.removeChild(searchHistory.lastElementChild);
}

// insert new search history item at the top of list
searchHistory.insertBefore(searchHistoryItem, searchHistory.firstElementChild);

updateSearchHistoryLocalStorage();
}

// Update search history to local storage
function updateSearchHistoryLocalStorage(){
  var historyItems = Array.from(searchHistory.children);
  var history = historyItems.map(item => item.textContent);
  localStorage.setItem('searchHistory', JSON.stringify(history));
}

// Load search history from local storage
function loadSearchHistory() {
  var savedSearchHistory = JSON.parse(localStorage.getItem('searchHistory'));

  if (savedSearchHistory) {
    savedSearchHistory.forEach(city => {
      var searchHistoryItem = document.createElement('p');
      searchHistoryItem.textContent = city
      searchHistoryItem.addEventListener('click', function() {
        getWeather(city);
      });
      // saveSearchHistory(city);
    });
  }
}

// Check if there is existing data in local storage and populate the UI
var savedCurrentWeather = JSON.parse(localStorage.getItem('currentWeather'));
var savedForecastData = JSON.parse(localStorage.getItem('forecastData'));
var lastSearchedCity = localStorage.getItem('lastSearchCity');

if (savedCurrentWeather) {
  displayCurrentWeather(savedCurrentWeather);
}

if (savedForecastData) {
  displayForecast({ list: savedForecastData });
}

if (lastSearchedCity) {
    getWeather(lastSearchedCity);
  }

  loadSearchHistory();