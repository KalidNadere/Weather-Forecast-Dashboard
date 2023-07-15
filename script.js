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
}