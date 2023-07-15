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
    forecastHeading.classList.remove('hidden'); // Shows forecast heading
  })
  .catch(error => {
    console.error('Error fetching forecast:', error);
  });
}

// Display current weather data
function displayCurrentWeather(data) {
  let cityName = data.name;
  let date = new Date(data.dt * 1000).toLocaleDateString();
  let icon = data.weather[0].icon;
  let temperature = convertKelvinToCelsius(data.main.temp); // convert temperature to Celsius
  let humidity = data.main.humidity;
  let windSpeed = data.wind.speed;

  let currentWeatherHTML = `
  <h2>${cityName}</h2>
  <p>Date: ${date}</p>
  <img src="https://openweathermap.org/img/wn/${icon}.png" alt="weather Icon">
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
  let forecastData = data.list.slice(0,5); // Take first 5 days of forecast

  let forecastHTML = '';
  forecastData.forEach((item, index) => {
    let date = new Date(item.dt * 1000).toLocaleDateString();
    let icon = item.weather[0].icon;
    let temperature = convertKelvinToCelsius(item.main.temp);
    let humidity = item.main.humidity;
    let windSpeed = item.wind.speed;

  // Add days to current date to get the forecast date
    let forecastDate = new Date();
    forecastDate.setDate(forecastDate.getDate() + index + 1);
    let forecastDateString = forecastDate.toLocaleDateString();

    let forecastCardHTML = `
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
  let searchHistoryItem = document.createElement('p');
  searchHistoryItem.textContent = city;
  searchHistoryItem.addEventListener('click', function() {
    getWeather(city);
  });

// Limit the number of history items to 10
  if (searchHistory.childElementCount >= 10) {
    searchHistory.removeChild(searchHistory.lastElementChild);
  }

// Insert new search history item at the top of list
  searchHistory.insertBefore(searchHistoryItem, searchHistory.firstElementChild);

  updateSearchHistoryLocalStorage();
}

// Update search history to local storage
  function updateSearchHistoryLocalStorage() {
    let historyItems = Array.from(searchHistory.children);
    let history = historyItems.map(item => item.textContent);
    localStorage.setItem('searchHistory', JSON.stringify(history));
  }

// Load search history from local storage
  function loadSearchHistory() {
    let savedSearchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    
    if (savedSearchHistory) {
      savedSearchHistory.forEach(city => {
        saveSearchHistory(city);
      });
    }
  }

// Check if there is existing data in local storage and populate the UI
let savedCurrentWeather = JSON.parse(localStorage.getItem('currentWeather'));
let savedForecastData = JSON.parse(localStorage.getItem('forecastData'));
let lastSearchedCity = localStorage.getItem('lastSearchCity');

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