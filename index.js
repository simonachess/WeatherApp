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
    newDate = `${weekDay}, ${currentHour}:${currentMinutes}`;
    return newDate;
}

let currentTime = document.querySelector("#time");
currentTime.innerHTML = formatDate(new Date());


function searchingCity(event) {
    event.preventDefault();

    let searchingCityName = document.querySelector("#search-input");
    let cityText = document.querySelector("#city");
    let city = searchingCityName.value;

    if (city) {
        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        cityText.innerHTML = city;
        axios.get(apiUrl).then(showTemp);
    } else {
        alert('Enter city name');
    }
}



function showTemp(response) {
    console.log(response);
    console.log(response.data.main.temp);
    let temp = Math.round(response.data.main.temp);
    let h1Temp = document.querySelector("#temp");
    h1Temp.innerHTML = temp;
    tempC = temp;

}

let searchButton = document.querySelector("#search-btn");
searchButton.addEventListener("click", searchingCity);


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

let linkCelc = document.querySelector("#celsius-link");
linkCelc.addEventListener("click", (e) => changeTempC(e, tempC, '#temp'));

let linkFahr = document.querySelector("#fahrenheit-link");
linkFahr.addEventListener("click", (e) => changeTempF(e, tempC, '#temp'));


let locationContainer = document.querySelector(".container-middle");
locationContainer.style.display = "none";

let locationButton = document.querySelector("#current-location");
locationButton.addEventListener('click', () => {
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
            linkCelcCurrent.addEventListener("click", (e) => changeTempC(e, temp, '#temp-current-loc'));

            let linkFahrCurrent = document.querySelector("#fahrenheit-link-current-loc");
            linkFahrCurrent.addEventListener("click", (e) => changeTempF(e, temp, '#temp-current-loc'));
        });
    }
    navigator.geolocation.getCurrentPosition(handlePosition);

});