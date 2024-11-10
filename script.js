let isCelsius = true; // Track if the temperature is in Celsius or Fahrenheit

// Fetch weather data when the user clicks the search button
async function fetchWeather() {
    const city = document.getElementById('city').value.trim(); //  input
    const apiKey = 'bd5e378503939ddaee76f12ad7a97608'; // API key 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; // Weather API URL

    try {
        const response = await fetch(url); //weather data
        if (!response.ok) { //check
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        //city is not found (404 error)
        if (data.cod === "404") {
            alert("City not found. Please enter a valid city name.");
            return;
        }

        // other API errors
        if (data.cod !== 200) {
            throw new Error(`API error: ${data.message}`);
        }

        displayCurrentWeather(data); //current weather information 
        fetchForecast(data.coord.lat, data.coord.lon); //forecast data for the city
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert(`There was an error: ${error.message}`); // Show error message
    }
}

//current weather information <3
function displayCurrentWeather(data) {
    document.getElementById('city-name').textContent = data.name; // City name
    document.getElementById('temperature').textContent = `Temp: ${data.main.temp} °C`; // Temperature
    document.getElementById('conditions').textContent = `Condition: ${data.weather[0].description}`; // Weather conditions
    document.getElementById('icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`; // Weather icon
    isCelsius = true; // Set temperature to Celsius
}

// Convert temperature (Celsius and Fahrenheit) (python ში მაქვს აწყობილი Units conventor ი და მანდედან ავიღე ფორმულები :D)
function convertTemperature() {
    const temperatureElement = document.getElementById('temperature');
    let tempValue = parseFloat(temperatureElement.textContent.split(" ")[1]);

    if (isCelsius) {
        tempValue = (tempValue * 9/5) + 32; // Convert Celsius to Fahrenheit
        temperatureElement.textContent = `Temp: ${tempValue.toFixed(1)} °F`;
    } else {
        tempValue = (tempValue - 32) * 5/9; // Convert Fahrenheit to Celsius
        temperatureElement.textContent = `Temp: ${tempValue.toFixed(1)} °C`;
    }

    isCelsius = !isCelsius; // Toggle Celsius and Fahrenheit
}

//the 3-day weather forecast
async function fetchForecast(lat, lon) {
    const apiKey = 'bd5e378503939ddaee76f12ad7a97608'; // API key from OpenWeather
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=24&appid=${apiKey}&units=metric`; // Forecast API URL

    try {
        const response = await fetch(url); //forecast data

        // Check
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); //JSON data
        displayForecast(data); // the 3-day forecast
    } catch (error) {
        console.error("Error fetching forecast data:", error);
        alert("There was an error fetching the forecast data. Please try again."); // Show error message
    }
}

// 3-day weather forecast
function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast-cards');
    forecastContainer.innerHTML = ''; // Clear previous forecast

    // Get data for the next 3 days
    for (let i = 0; i < 3; i++) {
        const forecastData = data.list[i * 8];
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        const date = new Date(forecastData.dt_txt);
        const options = { weekday: 'long' };
        const dayName = new Intl.DateTimeFormat('en-US', options).format(date);

        forecastItem.innerHTML = `
            <p>${dayName}</p>
            <p>Temp: ${forecastData.main.temp} °C</p>
            <img src="http://openweathermap.org/img/wn/${forecastData.weather[0].icon}.png" alt="${forecastData.weather[0].description}" />
            <p>${forecastData.weather[0].description}</p>
        `;

        forecastContainer.appendChild(forecastItem);
    }
}

// <3