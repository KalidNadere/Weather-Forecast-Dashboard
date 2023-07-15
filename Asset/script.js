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
  
}