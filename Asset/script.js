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
  const city = cityInput.value;
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
    console.error('Error fetching current weather'. error);
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
  const cityName = data.name;
  const date = new Date(data.dt * 1000).toLocaleDateString();
  const icon = data.weather[0].icon;
  const temperature = convertKelvinToCelsius(data.main.temp); // convert temperature to Celsius
  const humidity = data.main.humidity;
  const windspeed = data.wind.speed;

  const currentWeatherHTML = `
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

// Heler function to convert Kelvin to Celsius
function convertKelvinToCelsius(kelvin) {
  return Math.round(kelvin - 273.15);
}

// Display forecast data
function displayForecast(data) {
  const forecastData = data.list.slice(0,5); // Take first 5 days of forecast

  const forecastHTML = '';
  forecastData.forEach((item, index) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    const icon = item.weather[0].icon;
    const temperature = convertKelvinToCelsius(item.main.temp);
    const humidity = item.main.humidity;
    const windSpeed = item.wind.speed;

  // Add days to current date to get the forecast date
    const forecastDate = new Date();
    forecastDate.setDate(forecastDate.getDate() + index + 1);
    const forecastDateString = forecastDate.toLocaleDateString();

    const forecastCardHTML = `
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
  localStorage.setItem('forecasData', JSON.stringify(data.list));
}

// Save search history
function saveSearchHistory(city) {
  const searchHistoryItem = document.createElement('p');
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
    const historyItems = Array.from(searchHistory.children);
    const history = historyItems.map(item => item.textContent);
    localStorage.setItem('searchHistory', JSON.stringify(history));
  }

  