let isCelsius = true;

async function fetchWeather() {
    const city = document.getElementById('city').value.trim();
    const apiKey = 'bd5e378503939ddaee76f12ad7a97608';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (data.cod === "404") return alert("City not found.");
        if (data.cod !== 200) throw new Error(`API error: ${data.message}`);

        displayCurrentWeather(data);
        fetchForecast(data.coord.lat, data.coord.lon);
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

function displayCurrentWeather(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('temperature').textContent = `Temp: ${data.main.temp} °C`;
    document.getElementById('conditions').textContent = `Condition: ${data.weather[0].description}`;
    document.getElementById('icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    isCelsius = true;
}

function convertTemperature() {
    const temperatureElement = document.getElementById('temperature');
    let tempValue = parseFloat(temperatureElement.textContent.split(" ")[1]);
    tempValue = isCelsius ? (tempValue * 9/5) + 32 : (tempValue - 32) * 5/9;
    temperatureElement.textContent = `Temp: ${tempValue.toFixed(1)} ${isCelsius ? '°F' : '°C'}`;
    isCelsius = !isCelsius;
}

async function fetchForecast(lat, lon) {
    const apiKey = 'bd5e378503939ddaee76f12ad7a97608';
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=24&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        alert("Error fetching forecast.");
    }
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast-cards');
    forecastContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const forecastData = data.list[i * 8];
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date(forecastData.dt_txt));

        forecastItem.innerHTML = `
            <p>${dayName}</p>
            <p>Temp: ${forecastData.main.temp} °C</p>
            <img src="http://openweathermap.org/img/wn/${forecastData.weather[0].icon}.png" alt="${forecastData.weather[0].description}" />
            <p>${forecastData.weather[0].description}</p>
        `;

        forecastContainer.appendChild(forecastItem);
    }
}
