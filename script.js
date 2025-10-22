// Tumhara WeatherAPI.com ka key
const API_KEY = 'bf7c85fb162e43c583c153815252210';
const API_URL = 'https://api.weatherapi.com/v1/current.json';

// Elements get karo
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const body = document.body;

// Search button pe click event
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    
    if (city === '') {
        weatherResult.innerHTML = '<p class="error">Meherbani karke city ka naam likhen!</p>';
        return;
    }
    
    getWeather(city);
});

// Enter key press pe bhi search ho
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Weather data fetch karo
async function getWeather(city) {
    try {
        // Loading dikhao
        weatherResult.innerHTML = '<p class="loading">🔄 Data load ho raha hai...</p>';
        
        // API se data fetch karo
        const response = await fetch(`${API_URL}?key=${API_KEY}&q=${city}&aqi=no`);
        
        if (!response.ok) {
            throw new Error('City nahi mili! Sahi naam likhein.');
        }
        
        const data = await response.json();
        
        // Background change karo based on weather
        changeBackground(data.current.condition.text);
        
        // Weather display karo
        displayWeather(data);
        
    } catch (error) {
        weatherResult.innerHTML = `<p class="error">❌ ${error.message}</p>`;
        body.className = ''; // Reset background
    }
}

// Background change karo weather ke hisaab se
function changeBackground(condition) {
    // Remove all weather classes
    body.className = '';
    
    const conditionLower = condition.toLowerCase();
    
    // Remove existing animations
    removeWeatherEffects();
    
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
        if (conditionLower.includes('night')) {
            body.classList.add('clear-night');
        } else {
            body.classList.add('sunny');
        }
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
        body.classList.add('rain');
        createRainEffect();
    } else if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
        body.classList.add('cloudy');
    } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
        body.classList.add('thunderstorm');
    } else if (conditionLower.includes('snow') || conditionLower.includes('blizzard')) {
        body.classList.add('snow');
        createSnowEffect();
    } else if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
        body.classList.add('mist');
    } else {
        body.classList.add('cloudy'); // Default
    }
}

// Weather icon select karo
function getWeatherIcon(condition) {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
        return '☀️';
    } else if (conditionLower.includes('rain')) {
        return '🌧️';
    } else if (conditionLower.includes('cloud')) {
        return '☁️';
    } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
        return '⛈️';
    } else if (conditionLower.includes('snow')) {
        return '❄️';
    } else if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
        return '🌫️';
    } else if (conditionLower.includes('wind')) {
        return '💨';
    } else if (conditionLower.includes('night')) {
        return '🌙';
    } else {
        return '🌤️';
    }
}

// Rain chances calculate karo (Pakistani formula!)
function calculateRainChances(data) {
    const { humidity, cloud, condition } = data.current;
    const conditionText = condition.text.toLowerCase();
    
    let rainChance = 0;
    
    // Condition ke base pe
    if (conditionText.includes('rain') || conditionText.includes('drizzle')) {
        rainChance = 85;
    } else if (conditionText.includes('thunder') || conditionText.includes('storm')) {
        rainChance = 95;
    } else if (conditionText.includes('cloud') || conditionText.includes('overcast')) {
        // Humidity aur cloud cover se calculate
        rainChance = Math.min((humidity * 0.4) + (cloud * 0.3), 70);
    } else if (conditionText.includes('mist') || conditionText.includes('fog')) {
        rainChance = 30;
    } else if (conditionText.includes('sunny') || conditionText.includes('clear')) {
        rainChance = 5;
    } else {
        rainChance = humidity * 0.5; // Default
    }
    
    return Math.round(rainChance);
}

// Weather ko Urdu/Pakistani style mein describe karo
function getUrduDescription(condition, temp) {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('sunny')) {
        if (temp > 35) return 'Bohat garmi hai! 🔥';
        else if (temp > 25) return 'Dhoop khili hui hai ☀️';
        else return 'Mausam khoobsurat hai 😊';
    } else if (conditionLower.includes('rain')) {
        return 'Barish ho rahi hai 🌧️';
    } else if (conditionLower.includes('cloud')) {
        return 'Badal chaye hain ☁️';
    } else if (conditionLower.includes('thunder')) {
        return 'Bijli chamak rahi hai! ⚡';
    } else if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
        return 'Dhundla mausam hai 🌫️';
    } else if (conditionLower.includes('snow')) {
        return 'Barf gir rahi hai! ❄️';
    } else {
        return 'Mausam theek hai';
    }
}

// Temperature feel batao Pakistani style
function getTemperatureFeel(temp, feelsLike) {
    if (temp >= 40) {
        return '🔥 Bahut zyada garmi';
    } else if (temp >= 30) {
        return '😓 Garmi hai';
    } else if (temp >= 20) {
        return '😊 Mausam sahi hai';
    } else if (temp >= 10) {
        return '😌 Thandi hai';
    } else {
        return '🥶 Sakht sardi';
    }
}

// Wind speed ko Urdu mein
function getWindDescription(windKph) {
    if (windKph < 10) {
        return 'Halki hawa';
    } else if (windKph < 30) {
        return 'Tez hawa';
    } else if (windKph < 50) {
        return 'Bahut tez hawa';
    } else {
        return 'Aandhhi!';
    }
}

// Rain effect banao
function createRainEffect() {
    const rainContainer = document.createElement('div');
    rainContainer.className = 'rain-container';
    body.appendChild(rainContainer);
    
    for (let i = 0; i < 50; i++) {
        const rain = document.createElement('div');
        rain.className = 'rain';
        rain.style.left = Math.random() * 100 + '%';
        rain.style.animationDuration = Math.random() * 0.5 + 0.5 + 's';
        rain.style.animationDelay = Math.random() * 2 + 's';
        rainContainer.appendChild(rain);
    }
}

// Snow effect banao
function createSnowEffect() {
    const snowContainer = document.createElement('div');
    snowContainer.className = 'rain-container';
    body.appendChild(snowContainer);
    
    for (let i = 0; i < 30; i++) {
        const snow = document.createElement('div');
        snow.className = 'snow';
        snow.style.left = Math.random() * 100 + '%';
        snow.style.animationDuration = Math.random() * 3 + 2 + 's';
        snow.style.animationDelay = Math.random() * 5 + 's';
        snow.style.opacity = Math.random();
        snowContainer.appendChild(snow);
    }
}

// Purane weather effects remove karo
function removeWeatherEffects() {
    const existingEffects = document.querySelectorAll('.rain-container');
    existingEffects.forEach(effect => effect.remove());
}

// Weather ko screen pe dikhao (Pakistani Style!)
function displayWeather(data) {
    const { location, current } = data;
    const icon = getWeatherIcon(current.condition.text);
    const rainChance = calculateRainChances(data);
    const urduDesc = getUrduDescription(current.condition.text, current.temp_c);
    const tempFeel = getTemperatureFeel(current.temp_c, current.feelslike_c);
    const windDesc = getWindDescription(current.wind_kph);
    
    const html = `
        <div class="weather-icon">${icon}</div>
        <h2>📍 ${location.name}, ${location.country}</h2>
        <div class="temp">${Math.round(current.temp_c)}°C</div>
        <div class="description">${urduDesc}</div>
        
        <div class="weather-details">
            <div class="detail-item">
                <p>🌡️ Mehsoos</p>
                <span>${tempFeel}</span>
            </div>
            <div class="detail-item">
                <p>☔ Barish ke Chances</p>
                <span>${rainChance}%</span>
            </div>
            <div class="detail-item">
                <p>💧 Nami</p>
                <span>${current.humidity}%</span>
            </div>
            <div class="detail-item">
                <p>💨 Hawa</p>
                <span>${windDesc}</span>
            </div>
        </div>
        
        <div class="extra-info">
            <p>🌤️ <strong>Haalat:</strong> ${current.condition.text}</p>
            <p>👁️ <strong>Nazar:</strong> ${current.vis_km} km</p>
            <p>☁️ <strong>Badal:</strong> ${current.cloud}%</p>
        </div>
    `;
    
    weatherResult.innerHTML = html;
}