const API_KEY = "381d904bb5f8891c68c8a3c817e855ce";

const days = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
// use class to build the app
// getLocation()
//getcurrentLocation weather details
//render on the screen
const KelvinToCelcius = tempInKelv => (tempInKelv - 273).toFixed(1);

const MainContent = document.querySelector(".content__center");
const MainView = document.querySelector(".main");
const CurForeCastView = document.querySelector(".cur__Forecast--overview");
const detailedForeCastViewContainer = document.querySelector(
	".detailed__forecast-view"
);
const detailedForeCastCur = document.querySelector(".detailed__forecast--cur");
const detailedForeCastList = document.querySelector(
	".detailed__forecast--list"
);

const EventView = document.querySelector(".event__view");
const EventDetails = document.querySelector(".event__details");
const EventTitle = document.querySelector(".event__title");
const EventDesc = document.querySelector(".event__desc");
const EventIcon = document.querySelector(".event__icon");

const searchView = document.querySelector(".search");

const close = document.querySelector(".close");
const othersContainer = document.querySelector(".others");
const addCitiesBtn = document.querySelector(".add__cities");

const form = document.querySelector(".form");
const formInput = document.querySelector(".form__input");

const spinner = `<div class="lds-ripple spinner">
					<div></div>
					<div></div>
				 </div>
`;

const setEventIcon = pin => (pin ? "/pin.svg" : "/map.svg");

function getLocation() {
	if (!navigator.geolocation) alert("geolocation not available");
	navigator.geolocation.getCurrentPosition(
		success => {
			fetchCurrentForecastData(success.coords);
		},
		err => console.log(err)
	);
}

function fetchCurrentForecastData(coords) {
	fetch(
		` https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=983fe9217aa2f17f99c9d6dd7d01dd07`
	)
		.then(res => res.json())
		.then(data => renderCurForeCast(data))
		.catch(err => console.log(err));
}

function fetchWeatherForCity(query) {
	axios
		.get(
			`api.openweathermap.org/data/2.5/weather?q=London&appid=983fe9217aa2f17f99c9d6dd7d01dd07`
		)
		.then(res => console.log(res))
		// .then(data => console.log(data))
		.catch(err => console.log(err));
}

function renderCurForeCast(data) {
	const {
		id,
		dt,
		coord,
		name,
		main: { feels_like, humidity, temp, temp_max, temp_min },
		sys: { country },
		weather: [{ description, main, icon }],
	} = data;

	let html = ` 
	         
	              <h2 class="cur__detail-name">${name},${country}</h2>
					<div class="cur__detail-icon">
						<img class="icon" src="./sun.svg" alt="icon"/>
						<span class="cur__detail-temp">${KelvinToCelcius(temp)}°C
						</span>
					</div>
					<span class="description cur-description">${main}</span>
					<span class="maxmin--temp">${KelvinToCelcius(temp_min)}°C.${KelvinToCelcius(
		temp_max
	)}°C</span>
			 
	`;

	CurForeCastView.innerHTML = "";
	CurForeCastView.dataset.date = dt;
	CurForeCastView.dataset.lat = coord.lat;
	CurForeCastView.dataset.lon = coord.lon;
	CurForeCastView.dataset.place = name;

	CurForeCastView.insertAdjacentHTML("afterbegin", html);
}

function getDetailedForecastData(lat, lon, dt, place) {
	detailedForeCastCur.innerHTML = spinner;

	fetch(
		`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&dt=${dt}&appid=983fe9217aa2f17f99c9d6dd7d01dd07`
	)
		.then(res => res.json())
		.then(data => renderDetailedForecastView({ place, ...data }))
		.catch(err => console.log(err));
}

function renderDetailedForecastView(data) {
	const { place, current, daily, hourly } = data;
	EventDetails.classList.remove("hidden");
	EventTitle.textContent = place;
	EventIcon.src = setEventIcon(true);
	let curHtml = `
				<h2 class="cur__detail-name">Current Weather</h2>
				<div class="cur__detail-icon">
					<img class="icon" src="./sun.svg" alt="icon"/>
					<span class="cur__detail-temp">${KelvinToCelcius(current.temp)}°C</span>
				</div>
				<p class="description cur-description">${current.weather[0].main}</p>
				<span class="maxmin--temp">${KelvinToCelcius(current.temp)}°C.${KelvinToCelcius(
		current.temp
	)}°C</span>
			 `;

	close.classList.add("close__icon--show");

	if (!data) {
		throw alert("error occured please refresh");
	}

	detailedForeCastCur.innerHTML = "";

	detailedForeCastCur.insertAdjacentHTML("afterbegin", curHtml);

	daily.forEach(el => {
		const {
			dt,
			temp: { max, min, day },
			weather: [{ main: desc }],
		} = el;

		let date = new Date(dt * 1000);
		let curDate = date.getDate();
		let curDay = days[date.getDay()];
		let curMonth = months[date.getMonth()];

		let html = ` <div class="detail__card shadow-light">
		               <span class="detail__card--dateAndTime">${curDay},${curDate} ${curMonth}</span>
		                 <div class="detail__card--specs"> 
						     <div class="detail__specs--left">
							   <img src='/sun.svg' class='detail__card--icon' />
							   <div class="detail__descContainer">
							   <span class="description">${desc}</span>
							   <span class="maxmin--temp">${KelvinToCelcius(min)}.${KelvinToCelcius(
			max
		)}</span>  
							   </div>
							 </div>
						     <div class="detail__specs--right temp">
							   ${KelvinToCelcius(day)}°C
							 </div>
						 </div> 
		            </div>`;

		detailedForeCastList.insertAdjacentHTML("afterbegin", html);
	});
}

CurForeCastView.addEventListener("click", e => {
	const el = e.target.closest(".cur__Forecast--overview");

	const { date, lat, lon, place } = el.dataset;

	getDetailedForecastData(lat, lon, date, place);

	othersContainer.style.display = CurForeCastView.style.display = "none";
	detailedForeCastViewContainer.classList.remove("hidden");
});

close.addEventListener("click", () => {
	detailedForeCastViewContainer.classList.add("hidden");

	detailedForeCastCur.innerHTML = detailedForeCastList.innerHTML = "";

	othersContainer.style.display = CurForeCastView.style.display = "flex";
	EventDetails.style.display = "none";
	EventDetails.classList.add("hidden");

	setTimeout(() => {
		EventDetails.style.display = "grid";
	}, 1000);

	init();
});

form.addEventListener("submit", e => {
	e.preventDefault();
	fetchWeatherForCity(formInput.value);
});

function showSearchView() {
	searchView.style.display = "block";
	othersContainer.style.display = CurForeCastView.style.display = "none";
}

addCitiesBtn.addEventListener("click", showSearchView);

function init() {
	getLocation();
	CurForeCastView.innerHTML = spinner;
}

init();

// code to get daily & hourly forecast
// fetch(
// 	"https://api.openweathermap.org/data/2.5/onecall?lat=20.1628017&lon=85.702648&dt=1586468027&appid=983fe9217aa2f17f99c9d6dd7d01dd07"
// )
// 	.then(res => res.json())
// 	.then(data => console.log(data))
// 	.catch(err => console.log(err));
