
let weather = {
    apikey : "45f9e033651df3d7c72d4602ff556c89",

    fetchWeather: function (city) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" 
        + city 
        + "&units=imperial&appid=" 
        + this.apikey
    )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },

    displayWeather: function(data) {
        const {name} = data; 
        const {icon, description} = data.weather[0];
        const {temp, humidity} = data.main;
        const {speed} = data.wind;
      //console.log (name, icon, description, temp, humidity, speed)
    
        document.querySelector(".city").innerText = "Weather in " + name + "";
        document.querySelector(".icon").src = 
            "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + " °F";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + " %";
        document.querySelector(".wind").innerText = "Wind Speed: " + speed + " mph";   
        
        document.querySelector(".weather").classList.remove("loading");

        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')";
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    }
};

let geocode = {
    reverseGeocode: function (latitude, longitude){
        var api_key = 'e23368c58ba74509a9dc8c9c82dc7290';
//  var latitude = '51.0';
//  var longitude = '7.0';

  var api_url = 'https://api.opencagedata.com/geocode/v1/json'

  var request_url = api_url
    + '?'
    + 'key=' + api_key
    + '&q=' + encodeURIComponent(latitude + ',' + longitude)
    + '&pretty=1'
    + '&no_annotations=1';

  // see full list of required and optional parameters:
  // https://opencagedata.com/api#forward

  var request = new XMLHttpRequest();
  request.open('GET', request_url, true);

  request.onload = function() {
    // see full list of possible response codes:
    // https://opencagedata.com/api#codes

    if (request.status === 200){ 
      // Success!
      var data = JSON.parse(request.responseText);
   // alert(data.results[0].formatted); // print the location
      weather.fetchWeather(data.results[0].components.city); // print the location -> City
   
    } else if (request.status <= 500){ 
      // We reached our target server, but it returned an error
                           
      console.log("unable to geocode! Response code: " + request.status);
      var data = JSON.parse(request.responseText);
      console.log('error msg: ' + data.status.message);
    } else {
      console.log("server error");
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log("unable to connect to server");        
  };

  request.send();  // make the request
    },
  getLocation: function () {
      function success (data) {
          geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
      }
      if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, console.error);
      }
      else {
          weather.fetchWeather("Brooklyn");
      }
    }
};

document
    .querySelector(".search button")
    .addEventListener("click", function(){
        weather.search();
    });

document
    .querySelector(".search-bar")
    .addEventListener("keyup", function (event){
        if (event.key == "Enter") {weather.search()};
    });

//weather.fetchWeather('Brooklyn')

geocode.getLocation();