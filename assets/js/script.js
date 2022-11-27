var searchFormEl = document.querySelector('#search-form');
var searchHistoryListEl = document.querySelector('#search-history-lists');
var cityInputEl = document.querySelector('#cityname');
var cityDataSearch = document.querySelector('#city-name');
var fivedaysForecast = document.querySelector('#five-days-forecast');
var cityList = [];

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

function storeCityList(name) {
  if (!cityList.includes(name)){
  cityList.push(name);
  localStorage.setItem("citylist", JSON.stringify(cityList));
  }
}

function renderCityList(){
  searchHistoryListEl.innerHTML = "";
  for (var i=0; i<cityList.length; i++){
    var listcity = cityList[i];
    // var li = document.createElement("p");
    $('#search-history-lists').append(`<p><button class="btn" value="${listcity}">${listcity}</button></p>`);
    // li.textContent = listcity;
    // searchHistoryListEl.appendChild(li);
  }
}

function init() {
  var storedCities = JSON.parse(localStorage.getItem("citylist"));
  if (storedCities!==null){
    cityList = storedCities;
  }
  renderCityList();
}
// var listClickHandler = function (event) {
//   var city = event.target.getAttribute('data-language');

//   if (language) {
//     getFeaturedRepos(language);

//     repoContainerEl.textContent = '';
//   }
// };

var getCityData = function (city) {

  var apiKey = "916dbda628645c79f5666248b6b1d5d5"
  var apiUrlCurrent = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey+"&units=imperial";
  var apiUrlForecast = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid="+apiKey+"&units=imperial";//Fahrenheit,Imperial: miles/hour.

  fetch(apiUrlCurrent)
    .then(function(response){
      if(response.ok){
        console.log(response);
        response.json().then(function(data1){          
          
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

  fetch(apiUrlForecast)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
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

function displayWeather(weather) {
  if (weather.length===0) {
    fivedaysForecast.textContent = "No Weather Status found";
    return;
  } 
  else {
    $("#five-days-forecast").siblings("h2").text("5-Days Forecast:");
    fivedaysForecast.innerHTML="";
  }

  for (var i=3; i < 40; i=i+8) {
    var dayBoxEl = document.createElement("div");
    dayBoxEl.classList="col bg-dark text-light m-1";    
    
    var dateWeatherEl = document.createElement("p");
    dateWeatherEl.textContent = ((weather.list[i].dt_txt).substr(0,10));
    dayBoxEl.appendChild(dateWeatherEl);

    var iconWeatherEl = document.createElement("div");
    var iconUrl = "http://openweathermap.org/img/w/" + weather.list[i].weather[0].icon +".png";
    var iconDescription = weather.list[i].weather[0].description;
    iconWeatherEl.innerHTML='<img id="wicon" src="'+iconUrl+'" alt="'+iconDescription+'"></img>';
    dayBoxEl.appendChild(iconWeatherEl);

    var tempWeatherEl = document.createElement("p");
    tempWeatherEl.textContent = "Temp: "+weather.list[i].main.temp+" °F";
    dayBoxEl.appendChild(tempWeatherEl);

    var windWeatherEl = document.createElement("p");
    windWeatherEl.textContent = "Wind: "+weather.list[i].wind.speed+" MPH";
    dayBoxEl.appendChild(windWeatherEl);

    var humidWeatherEl = document.createElement("p");
    humidWeatherEl.textContent = "Humidity: "+weather.list[i].main.humidity+" %"; 
    dayBoxEl.appendChild(humidWeatherEl);
    console.log(dayBoxEl);
    fivedaysForecast.appendChild(dayBoxEl);    
  };
}

// var getFeaturedRepos = function (language) {
//   var apiUrl = 'https://api.github.com/search/repositories?q=' + language + '+is:featured&sort=help-wanted-issues';

//   fetch(apiUrl).then(function (response) {
//     if (response.ok) {
//       response.json().then(function (data) {
//         displayRepos(data.items, language);
//       });
//     } else {
//       alert('Error: ' + response.statusText);
//     }
//   });
// };
init();
searchFormEl.addEventListener('submit', formSubmitHandler);
// languageButtonsEl.addEventListener('click', buttonClickHandler);
