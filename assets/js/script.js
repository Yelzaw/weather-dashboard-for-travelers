var searchFormEl = document.querySelector('#search-form');
var searchHistoryListEl = document.querySelector('#search-history-lists');
var cityInputEl = document.querySelector('#cityname');
var cityDataSearch = document.querySelector('#city-name');
var fivedaysForecast = document.querySelector('#five-days-forecast');
var cityList = [];

// get city name from input text and send to getCityData function
var formSubmitHandler = function (event) {
  event.preventDefault();

  var cityname = cityInputEl.value.trim();  
  if (cityname) {
    getCityData(cityname);
    cityInputEl.value = '';    
  } else {
    alert('Please enter a city name');
  }
};

// Store the search history in array, and store in local
function storeCityList(name) {
  if (!cityList.includes(name)){
  cityList.push(name);
  localStorage.setItem("citylist", JSON.stringify(cityList));
  }
}

// show the city name of search history from array
function renderCityList(){
  if (cityList.length!==0){
    $('#search-history').attr('style','display:block'); 
    $('.clearBtn').attr('style','display:block'); 
  } 
  searchHistoryListEl.innerHTML = "";
  for (var i=0; i<cityList.length; i++){
    var listcity = cityList[i];
    $('#search-history-lists').append(`<p><button class="btn" value="${listcity}">${listcity}</button></p>`);
  }
  
}

// get search history from local sotrage and show on browser
function init() {
  var storedCities = JSON.parse(localStorage.getItem("citylist"));
  if (storedCities!==null){
    cityList = storedCities;
  }
  renderCityList();
}

//call function for selected city from search history to show weather data
var buttonClickHandler = function (event) {
  var city = event.target.getAttribute('value');
  if (city) {
    getCityData(city);
  }
};

//base on city name, connect to openweathermap and grab the data with API
var getCityData = function (city) {
  var apiKey = "916dbda628645c79f5666248b6b1d5d5"
  var apiUrlCurrent = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey+"&units=imperial";
  var apiUrlForecast = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid="+apiKey+"&units=imperial";//Fahrenheit,Imperial: miles/hour.
//grab the weather data for current weather and show on browser
  fetch(apiUrlCurrent)
    .then(function(response){
      if(response.ok){
        response.json().then(function(data1){          
          console.log(data1);
          var iconUrl = "http://openweathermap.org/img/w/" + data1.weather[0].icon +".png";
          var iconDescription = data1.weather[0].description;
          $('.city-data').attr('style','display:block');
          cityDataSearch.textContent = data1.name+" ("+(dayjs().format("MMM D, YYYY"))+")";
          $('#hicon').attr('src', iconUrl);
          $('#hicon').attr('alt', iconDescription);
          $('#weather-descr').text(iconDescription);
          $('.city-data').children('#temp').text("Temp: "+data1.main.temp+" °F"); //temp
          $('.city-data').children('#wind').text("Wind: "+data1.wind.speed+" MPH"); //wind
          $('.city-data').children('#humid').text("Humidity: "+data1.main.humidity+" %"); //Humidity
          storeCityList(data1.name);
          renderCityList();
        })
      } else {
      alert('Error: ' + response.statusText);
      }
    })
  .catch(function (error) {
    alert('Unable to connect to Openweathermap');
  });
//grab the weather data for 5 days of forecast weather
  fetch(apiUrlForecast)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayWeather(data);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to Openweathermap');
    });
};

//show the 5 days of forecast weather 
function displayWeather(weather) {
  if (weather.length===0) {
    fivedaysForecast.textContent = "No Weather Status found";
    return;
  } 
  else {
    $("#five-days-forecast").siblings("h2").text("5-Days Forecast:");
    fivedaysForecast.innerHTML="";
  }

  for (var i=0; i < 40; i++) {

    // select exact time for the day, using hours as filter to get 5 days

    var hours = ((weather.list[i].dt_txt).substr(11,19));
    if (hours=="09:00:00") {
      var date = (weather.list[i].dt_txt).substr(0,10);
      var temp = weather.list[i].main.temp;
      var wind = weather.list[i].wind.speed;
      var humid = weather.list[i].main.humidity;
      var icon = weather.list[i].weather[0].icon;
      var description = weather.list[i].weather[0].description

    var dayBoxEl = document.createElement("div");
    dayBoxEl.classList="col bg-dark text-light m-1";    
    
    var dateWeatherEl = document.createElement("p");
    dateWeatherEl.textContent = date;
    dayBoxEl.appendChild(dateWeatherEl);

    var iconWeatherEl = document.createElement("div");
    var iconUrl = "http://openweathermap.org/img/w/" + icon +".png";
    iconWeatherEl.innerHTML='<img id="wicon" src="'+iconUrl+'" alt="'+ description +'"></img>';
    dayBoxEl.appendChild(iconWeatherEl);

    var tempWeatherEl = document.createElement("p");
    tempWeatherEl.textContent = "Temp: "+ temp +" °F";
    dayBoxEl.appendChild(tempWeatherEl);

    var windWeatherEl = document.createElement("p");
    windWeatherEl.textContent = "Wind: "+ wind +" MPH";
    dayBoxEl.appendChild(windWeatherEl);

    var humidWeatherEl = document.createElement("p");
    humidWeatherEl.textContent = "Humidity: "+ humid +" %"; 
    dayBoxEl.appendChild(humidWeatherEl);
    fivedaysForecast.appendChild(dayBoxEl);    
    };
  }
}


init();

searchFormEl.addEventListener('submit', formSubmitHandler);

//get the data for selected city from history list
searchHistoryListEl.addEventListener('click', buttonClickHandler);

//clear search history
$(".clearBtn").on("click",function(){
  localStorage.clear();
  location.reload();
})
