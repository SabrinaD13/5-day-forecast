var API_KEY = '8cdebd314fd388cb898f7de3e44ddb94';

// Data Elements 
var generateBtnEl = document.getElementById('generateBtn');
var searchVal = document.getElementById('nameInput');
var mainQueryName = document.getElementById('searchName');
var mainDateQuery = document.getElementById('dateMainQuery');

// Event listener for search button click
generateBtnEl.addEventListener('click', async function () {
    var cityName = searchVal.value;
    var { name, lat, lon } = await fetchGeoData(cityName);
    mainQueryName.textContent = name;
    var weatherInfo = await fetchWeatherInfo(lat, lon);
    getRequiredItems(weatherInfo);
    var forecastWeatherInfo = await fetchForecastInfo(lat, lon);
    getForecastItems(forecastWeatherInfo);  
    historyAdd(cityName); // Add searched city to history
});

async function historyAdd(cityName) {
    // Data for generated city
    var geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    var response = await fetch(geoUrl);
    var [data] = await response.json();
    var { name } = data;

    // History list
    var historyEl = document.querySelector('#historyID ul');
    var buttonEl = document.createElement('button');
    buttonEl.textContent = name;
    historyEl.appendChild(buttonEl);

    buttonEl.addEventListener('click', async function () {
        var { name, lat, lon } = await fetchGeoData(cityName);
        mainQueryName.textContent = name;
        var weatherInfo = await fetchWeatherInfo(lat, lon);
        getRequiredItems(weatherInfo);
        var forecastWeatherInfo = await fetchForecastInfo(lat, lon);
        getForecastItems(forecastWeatherInfo);
    });
}
//Generates data
async function fetchWeatherInfo(lat, lon) {
    var weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    var response = await fetch(weatherUrl);
    var data = await response.json();
    return data;
  }
  
  async function fetchGeoData(cityName) {
    var geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    var response = await fetch(geoUrl);
    var [data] = await response.json();
    var { name, lat, lon } = data;
    localStorage.setItem('Name', name);
    localStorage.setItem(`${name} lat`, lat);
    localStorage.setItem(`${name} lon`, lon);
    return { name, lat, lon };
  }
  
  async function fetchForecastInfo(lat, lon) {
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    var response = await fetch(forecastUrl);
    var data = await response.json();
    return data;
  }
  
// function to update the forecast 
function getForecastItems(dataEl) {
   
    var numberTest = -1;
    
    for (var i = 0; i < 5; i++) {
       
        numberTest += 8;
       
        var forecastDate = dataEl.list[numberTest].dt_txt;
        var forecastIcon = dataEl.list[numberTest].weather[0].icon;
        var forecastTemp = dataEl.list[numberTest].main.temp;
        var forecastHumidity = dataEl.list[numberTest].main.humidity;
        var forecastWindSpeed = dataEl.list[numberTest].wind.speed;
      
        document.getElementById('date'+ numberTest).textContent = forecastDate;
        document.getElementById('temp'+ numberTest).textContent = forecastTemp;
        document.getElementById('wind'+ numberTest).textContent = forecastWindSpeed;
        document.getElementById('humidity'+ numberTest).textContent = forecastHumidity;

        var iconEl = document.getElementById('icon'+ numberTest);
        iconEl.setAttribute('src', 'http://openweathermap.org/img/w/' + forecastIcon + '.png');
        iconEl.style.display = 'inline';
    }
}

// Weather function
function getRequiredItems(dataEl) {
    
    var humidity = dataEl.list[0].main.humidity
    var temp = dataEl.list[0].main.temp
    var wind = dataEl.list[0].wind.speed
    
    localStorage.setItem('Humidity', humidity)
    localStorage.setItem('Temperature', temp)
    localStorage.setItem('Wind Speed', wind)
  
    document.getElementById('latestQTemp').textContent = localStorage.getItem('Temperature', temp) + ' Kelvin';
    document.getElementById('latestQWindSpeed').textContent = localStorage.getItem('Wind Speed', wind) + ' MPH';
    document.getElementById('latestQHumidity').textContent = localStorage.getItem('Humidity', humidity) + ' %';
}

// Current Date
var timeNow = dayjs().format('MM/DD/YYYY');
mainDateQuery.textContent = timeNow;