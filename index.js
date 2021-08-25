let tempC;
let tempCurrentLocC;

let date = new Date();
let weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

let weekDay = weekDays[date.getDay()];
let currentHour = date.getHours();
let currentMinutes = date.getMinutes();

function formatDate(newDate) {
    if (currentMinutes < 10) {
        currentMinutes = `0${currentMinutes}`
    }
    if (currentHour < 10) {
        currentHour = `0${currentHour}`
    }
    newDate = `${weekDay}, ${currentHour}:${currentMinutes}`;
    return newDate;
}

let currentTime = document.querySelector("#time");
currentTime.innerHTML = formatDate(new Date());


function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ['Sun', "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[day];
}

function displayForecast(response) {
    console.log(response.data.daily);
    let forecast = response.data.daily;
    let forecastElement = document.querySelector("#forecast");
    let forecastHTML = '';

    forecast.forEach(function (forecastDay, index) {
        if (index < 5) {
            forecastHTML = forecastHTML + `<div><div>${formatDay(forecastDay.dt)}</div>
            <div><img src='http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png' width="64"></div>
            <div><span>${Math.round(forecastDay.temp.max)}℃ </span>
            <span style="color:grey">${Math.round(forecastDay.temp.min)}℃</span></div></div>`;

        }
    });

    forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    console.log(apiUrl);
    axios.get(apiUrl).then(displayForecast);
}

function showTemp(response) {
    console.log(response);
    console.log(response.data.main.temp);
    let temp = Math.round(response.data.main.temp);
    let h1Temp = document.querySelector("#temp");
    h1Temp.innerHTML = temp;
    tempC = temp;
    let speedData = Math.round(response.data.wind.speed);
    let speedInput = document.querySelector("#speed");
    speedInput.innerHTML = `Wind speed: ${speedData} km/h`;
    let humidityData = Math.round(response.data.main.humidity);
    let humidityInput = document.querySelector("#humidity");
    humidityInput.innerHTML = `Humidity: ${humidityData}%`;
    let descriptionData = response.data.weather[0].description;
    let descriptionInput = document.querySelector("#description");
    descriptionInput.innerHTML = `<i>${descriptionData}</i>`;
    let iconElement = document.querySelector("#icon");
    iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);

    getForecast(response.data.coord)

}

function showCityData(city){
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    let cityText = document.querySelector("#city");
    cityText.innerHTML = city;
    axios.get(apiUrl).then(showTemp);
}


function searchingCity(event) {
    event.preventDefault();

    let searchingCityName = document.querySelector("#search-input");
    
    let city = searchingCityName.value;

    if (city) {
        showCityData(city);
    } else {
        alert('Enter city name');
    }
}


let searchButton = document.querySelector("#search-btn");
searchButton.addEventListener("click", searchingCity);


function displayLocalTemp(){
    locationContainer.style.display = null;
    locationButton.style.display = "none";

    function handlePosition(position) {
        console.log(position);
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);

        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        axios.get(apiUrl).then(function showTemp(response) {

            let temp = Math.round(response.data.main.temp);

            let currentLocation = document.querySelector("#city-current-loc");
            currentLocation.innerHTML = response.data.name;
            let currentLocTemp = document.querySelector("#temp-current-loc");
            currentLocTemp.innerHTML = `${temp}`;

            let linkCelcCurrent = document.querySelector("#celsius-link-current-loc");
            let linkFahrCurrent = document.querySelector("#fahrenheit-link-current-loc");

            linkCelcCurrent.addEventListener("click", (e) => changeTempC(e, temp, '#temp-current-loc'));
            linkFahrCurrent.addEventListener("click", (e) => changeTempF(e, temp, '#temp-current-loc'));

            let iconLocalElement = document.querySelector("#icon-local");
            iconLocalElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);

        });
    }
    navigator.geolocation.getCurrentPosition(handlePosition);
}

function changeTempC(event, temp, selector) {
    event.preventDefault();
    let currentTemp = document.querySelector(selector);
    currentTemp.innerHTML = temp;
}

function changeTempF(event, temp, selector) {
    event.preventDefault();
    let currentTemp = document.querySelector(selector);
    let tempF = Math.round((temp * 1.8) + 32);
    currentTemp.innerHTML = tempF;
}

let input = document.querySelector('#search-input');
let linkCelc = document.querySelector("#celsius-link");
let linkFahr = document.querySelector("#fahrenheit-link");


//todo doesnt work link if check input value

linkCelc.addEventListener("click", (e) => {
    if (input.value) { changeTempC(e, tempC, '#temp') }
})

linkFahr.addEventListener("click", (e) => {
    if (input.value) { changeTempF(e, tempC, '#temp') }
});



let locationContainer = document.querySelector(".container-middle");
locationContainer.style.display = "none";

let locationButton = document.querySelector("#current-location");
locationButton.addEventListener('click', displayLocalTemp);


navigator.geolocation.getCurrentPosition((position)=>{
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then((response)=>{
        showCityData(response.data.name);
    })
});


