const apiKey ='eb0330026840c361df406fc1af14c441'

const cityInput = document.getElementById('cityInput');
const cityNameElement = document.getElementById('cityName');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const weatherIconElement = document.getElementById('weatherIcon');
const searchBtn = document.getElementById('searchBtn');
const airQualityElement = document.getElementById('airQuality');
const hourlyForecastElement = document.getElementById('hourlyForecast');
const dailyForecastElement = document.getElementById('dailyForecast');
const visibilityElement = document.getElementById('visibility');


function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            fetchWeatherByCoordinates(latitude, longitude);
            

            // Get city name based on coordinates and populate the search box
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
                .then(response => response.json())
                .then(data => {
                    if (data.name) {
                        cityInput.value = data.name;
                        fetchAndDisplay24HourForecast(data.name); // Display 24-hour forecast
                        fetchAndDisplay7DayForecast(data.name);   // Display 7-day forecast
                      
                    }
                })
                .catch(error => {
                    console.error('Error fetching city name:', error);
                });
        }, error => {
            console.error('Error getting current location:', error);
            // Handle error or set a default city
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
        // Handle no geolocation support
    }
}



// Function to fetch weather data by coordinates
function fetchWeatherByCoordinates(latitude, longitude) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            const cityName = data.name;
            const temperature = data.main.temp;
            const description = data.weather[0].description;
            const iconCode = data.weather[0].icon;
            const sunriseTimestamp = data.sys.sunrise * 1000; // Convert to milliseconds
            const sunsetTimestamp = data.sys.sunset * 1000;   // Convert to milliseconds
            const sunriseElement = document.getElementById('sunrise');
            const sunsetElement = document.getElementById('sunset');

            cityNameElement.textContent = `${cityName}`;
            temperatureElement.textContent = ` ${temperature}°C`;
            descriptionElement.textContent = `Description: ${description}`;
            weatherIconElement.src = `http://openweathermap.org/img/w/${iconCode}.png`;

            fetchAndDisplayAirQuality(latitude, longitude); // Fetch and display air quality
            fetchAndDisplay24HourForecast(cityName); 
            fetchAndDisplay7DayForecast(cityName);   // Display 7-day forecast
            
        
    

            // Display sunrise and sunset times
            sunriseElement.textContent = `Sunrise: ${formatTime(sunriseTimestamp)}`;
            sunsetElement.textContent = `Sunset: ${formatTime(sunsetTimestamp)}`;
            
            // Add sunrise animation class
            sunriseElement.classList.add('sun-animation', 'sunrise');
            
            // Remove animation class after animation ends
            sunriseElement.addEventListener('animationend', () => {
                sunriseElement.classList.remove('sun-animation', 'sunrise');
            });
            
            // Add sunset animation class
            sunsetElement.classList.add('sun-animation', 'sunset');
            
            // Remove animation class after animation ends
            sunsetElement.addEventListener('animationend', () => {
                sunsetElement.classList.remove('sun-animation', 'sunset');
            });
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}





function fetchAndDisplayAirQuality(latitude, longitude) {
    fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.list && data.list[0]) {
                const airQualityIndex = data.list[0].main.aqi;
                const airQualityDescriptions = [
                    'Good',
                    'Fair',
                    'Moderate',
                    'Poor',
                    'Very Poor'
                ];
                airQualityElement.textContent = `Air Quality: ${airQualityDescriptions[airQualityIndex - 1]}`;
            }
        })
        .catch(error => {
            console.error('Error fetching air quality data:', error);
        });
}


// Function to fetch and display air quality by city name
function fetchAndDisplayAirQualityByCityName(cityName) {
    const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?q=${cityName}&appid=${apiKey}`;

    fetch(airQualityUrl)
        .then(response => response.json())
        .then(data => {
            if (data.list && data.list[0]) {
                const airQualityIndex = data.list[0].main.aqi;
                const airQualityDescriptions = [
                    'Good',
                    'Fair',
                    'Moderate',
                    'Poor',
                    'Very Poor'
                ];
                airQualityElement.textContent = `Air Quality: ${airQualityDescriptions[airQualityIndex - 1]}`;
            }
        })
        .catch(error => {
            console.error('Error fetching air quality data:', error);
        });
}










// Fetch and display 24-hour forecast
function fetchAndDisplay24HourForecast(cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&cnt=24&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.list) {
                display24HourForecast(data.list);
            }
        })
        .catch(error => {
            console.error('Error fetching 24-hour forecast data:', error);
        });
}



// Display 24-hour forecast
function display24HourForecast(hourlyData) {
    hourlyForecastElement.innerHTML = '';

    for (let i = 0; i < hourlyData.length; i++) {
        const forecast = hourlyData[i];
        const timestamp = forecast.dt * 1000;
        const temperature = forecast.main.temp;
        const iconCode = forecast.weather[0].icon;

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item', 'horizontal');
        forecastItem.innerHTML = `
        <p class="forecast-time">${formatTime(timestamp)}</p>
        <img src="http://openweathermap.org/img/w/${iconCode}.png" alt="Weather Icon" class="forecast-icon">
        <p class="forecast-temp">${temperature}°C</p>
    `;
    
        hourlyForecastElement.appendChild(forecastItem);
    }
}

    







// Function to fetch and display 7-day forecast
function fetchAndDisplay7DayForecast(cityName) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            if (data.list) {
                const uniqueDays = {};
                const dailyData = data.list.filter(item => {
                    const day = formatDay(item.dt * 1000);
                    if (!uniqueDays[day]) {
                        uniqueDays[day] = true;
                        return true;
                    }
                    return false;
                });
                display7DayForecast(dailyData);
            }
        })
        .catch(error => {
            console.error('Error fetching 7-day forecast data:', error);
        });
}


// Display 7-day forecast
function display7DayForecast(dailyData) {
    dailyForecastElement.innerHTML = '';

    for (let i = 0; i < dailyData.length; i++) {
        const forecast = dailyData[i];
        const timestamp = forecast.dt * 1000;
        const temperature = forecast.main.temp;
        const iconCode = forecast.weather[0].icon;

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <p class="forecast-day">${formatDay(timestamp)}</p>
            <img src="http://openweathermap.org/img/w/${iconCode}.png" alt="Weather Icon" class="forecast-icon">
            <p class="forecast-temp">${temperature}°C</p>
        `;

        dailyForecastElement.appendChild(forecastItem);
    }
}




// Function to format timestamp to HH:mm format
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
}


function formatDay(timestamp) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(timestamp);
    const dayOfWeek = date.getDay(); 
    return daysOfWeek[dayOfWeek];
}
// Function to format timestamp to dd/mm/yyyy format
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// // Listen for search button click
// searchBtn.addEventListener('click', () => {
//     const cityName = cityInput.value;
//     if (cityName) {
//         getWeatherData(cityName);
//         fetchAndDisplayAirQualityByCity(cityName)
//     }
// });
// Remove the redundant event listener for the search button click
searchBtn.addEventListener('click', () => {
    const cityName = cityInput.value;
    if (cityName) {
        getWeatherData(cityName);
        fetchAndDisplay24HourForecast(cityName);
        fetchAndDisplay7DayForecast(cityName);
       
       
    }
});;

// Function to get weather data for a city
function getWeatherData(cityName) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.main && data.main.temp !== undefined && data.weather && data.weather[0]) {
                const temperature = data.main.temp;
                const description = data.weather[0].description;
                const iconCode = data.weather[0].icon;

                cityNameElement.textContent = ` ${cityName}`;
                temperatureElement.textContent = ` ${temperature}°C`;
                descriptionElement.textContent = `Description: ${description}`;

                // Set the weather icon
                const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
                weatherIconElement.src = iconUrl;
              
            } else {
                cityNameElement.textContent = 'Weather data not available';
                temperatureElement.textContent = ''; // Clear the temperature display
                descriptionElement.textContent = '';
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            cityNameElement.textContent = 'Error fetching weather data';
            temperatureElement.textContent = ''; // Clear the temperature display
            descriptionElement.textContent = '';
        });


    // Fetch sunrise and sunset times
    fetchWeatherByCity(cityName);
    fetchAndDisplayAirQualityByCityName(cityName);
 


        

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;




    // Fetch 7-day daily forecast data
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            if (data.list) {
                const dailyData = data.list.filter(item => item.dt_txt.includes('12:00'));
                display7DayForecast(dailyData);
            }
        })
        .catch(error => {
            console.error('Error fetching 7-day forecast data:', error);
        });
}



function fetchWeatherByCity(cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const sunriseTimestamp = data.sys.sunrise * 1000; // Convert to milliseconds
            const sunsetTimestamp = data.sys.sunset * 1000;   // Convert to milliseconds
            const sunriseElement = document.getElementById('sunrise');
            const sunsetElement = document.getElementById('sunset');

            // Display sunrise and sunset times
            sunriseElement.textContent = `Sunrise: ${formatTime(sunriseTimestamp)}`;
            sunsetElement.textContent = `Sunset: ${formatTime(sunsetTimestamp)}`;
        })
        .catch(error => {
            console.error('Error fetching sunrise and sunset data:', error);
        });
}





// Fetch city name suggestions based on user input
function fetchSuggestions(userInput) {
    const suggestionsUrl = `https://api.openweathermap.org/data/2.5/find?q=${userInput}&appid=${apiKey}`;

    fetch(suggestionsUrl)
        .then(response => response.json())
        .then(data => {
            const suggestions = data.list.map(item => item.name);
            updateSuggestions(suggestions);
        })
        .catch(error => {
            console.error('Error fetching city suggestions:', error);
        });
}

// Function to update the datalist with city name suggestions
function updateSuggestions(suggestions) {
    cityList.innerHTML = '';
    suggestions.forEach(suggestion => {
        const option = document.createElement('option');
        option.value = suggestion;
        cityList.appendChild(option);
    });
}


function clearSuggestions() {
    cityList.innerHTML = '';
}


// Listen for input change and fetch city name suggestions
cityInput.addEventListener('input', () => {
    const userInput = cityInput.value.trim();
    if (userInput) {
        fetchSuggestions(userInput);
    } else {
        clearSuggestions();
    }
});



// Listen for click of a suggestion and fetch weather data
cityList.addEventListener('click', event => {
    const selectedCity = event.target.value;
    cityInput.value = selectedCity;
    clearSuggestions();
    getWeatherData(selectedCity);
});



// Get current location weather on page load
window.addEventListener('load', () => {
    getCurrentLocationWeather();
});