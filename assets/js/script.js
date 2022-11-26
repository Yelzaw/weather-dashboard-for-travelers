var searchFormEl = document.querySelector('#search-form');
var searchHistoryButtonsEl = document.querySelector('#search-history-buttons');
var cityInputEl = document.querySelector('#cityname');
var cityDataSearch = document.querySelector('#city-name');
var fivedaysForecast = document.querySelector('#five-days-forecast');

var formSubmitHandler = function (event) {
  event.preventDefault();

  var cityname = cityInputEl.value.trim();

  if (cityname) {
    getCityData(cityname);

    // repoContainerEl.textContent = '';
    cityInputEl.value = '';
  } else {
    alert('Please enter a city name');
  }
};

// var buttonClickHandler = function (event) {
//   var language = event.target.getAttribute('data-language');

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

          cityDataSearch.textContent = data1.name+" ("+(dayjs().format("MMM D, YYYY"))+")";
          $('#hicon').attr('src', iconUrl);
          $('#hicon').attr('alt', iconDescription);
          $('.city-data').children('#temp').text("Temp: "+data1.main.temp+" °F"); //temp
          $('.city-data').children('#wind').text("Wind: "+data1.wind.speed+" MPH"); //wind
          $('.city-data').children('#humid').text("Humidity: "+data1.main.humidity+" %"); //Humidity

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
        // console.log(response);
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

    // $('#wicon').attr('src', iconUrl);
    // $('#wicon').attr('alt', iconDescription);
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

// var displayRepos = function (repos, searchTerm) {
//   if (repos.length === 0) {
//     repoContainerEl.textContent = 'No repositories found.';
//     return;
//   }

//   repoSearchTerm.textContent = searchTerm;

//   for (var i = 0; i < repos.length; i++) {
//     var repoName = repos[i].owner.login + '/' + repos[i].name;

//     var repoEl = document.createElement('a');
//     repoEl.classList = 'list-item flex-row justify-space-between align-center';
//     repoEl.setAttribute('href', './single-repo.html?repo=' + repoName);

//     var titleEl = document.createElement('span');
//     titleEl.textContent = repoName;

//     repoEl.appendChild(titleEl);

//     var statusEl = document.createElement('span');
//     statusEl.classList = 'flex-row align-center';

//     if (repos[i].open_issues_count > 0) {
//       statusEl.innerHTML =
//         "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
//     } else {
//       statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
//     }

//     repoEl.appendChild(statusEl);

//     repoContainerEl.appendChild(repoEl);
//   }
// };

searchFormEl.addEventListener('submit', formSubmitHandler);
// languageButtonsEl.addEventListener('click', buttonClickHandler);
