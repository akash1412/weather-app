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

const EventView = document.querySelector(".event__view");
const EventTitle = document.querySelector(".event__title");
const EventDesc = document.querySelector(".event__desc");
const EventIcon = document.querySelector(".event__icon");

const close = document.querySelector(".close");

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
						<span class="cur__detail-temp">${KelvinToCelcius(temp)} 
						°C
						</span>
					</div>
					<span class="description cur-description">${main}</span>
					<span class="cur__maxmin--temp">${KelvinToCelcius(
						temp_min
					)}°C.${KelvinToCelcius(temp_max)}°C</span>
			 
	`;

	CurForeCastView.innerHTML = "";
	CurForeCastView.dataset.date = dt;
	CurForeCastView.dataset.lat = coord.lat;
	CurForeCastView.dataset.lon = coord.lon;
	CurForeCastView.dataset.place = name;

	CurForeCastView.insertAdjacentHTML("afterbegin", html);
}

function getDetailedForecastData(lat, lon, dt, place) {
	fetch(
		`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&dt=${dt}&appid=983fe9217aa2f17f99c9d6dd7d01dd07`
	)
		.then(res => res.json())
		.then(data => renderDetailedForecastView({ place, ...data }))
		.catch(err => console.log(err));
}

function renderDetailedForecastView(data) {
	console.log(data);
	const { place, current, daily, hourly } = data;

	EventTitle.textContent = place;
	EventIcon.src = setEventIcon(true);
	let curHtml = `
			<div class="cur__Forecast--view ">
				<h2 class="cur__detail-name">Current Weather</h2>
				<div class="cur__detail-icon">
					<img class="icon" src="./sun.svg" alt="icon"/>
					<span class="cur__detail-temp">${KelvinToCelcius(current.temp)}°C</span>
				</div>
				<p class="description cur-description">${current.weather[0].main}</p>
				<span class="maxmin--temp">${KelvinToCelcius(current.temp)}°C.${KelvinToCelcius(
		current.temp
	)}°C</span>
			</div>`;

	const detailedForecastList = document.createElement("div");

	close.classList.add("fadeIn");
	close.classList.add("close__icon--show");

	detailedForeCastViewContainer.innerHTML = "";
	detailedForeCastViewContainer.insertAdjacentHTML("afterbegin", curHtml);

	daily.forEach(el => {
		const {
			dt,
			temp: { max, min, day },
			weather: [{ main: desc }],
		} = el;

		let date = new Date();
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

		detailedForeCastViewContainer.appendChild(detailedForecastList);

		detailedForecastList.insertAdjacentHTML("afterbegin", html);
	});
}

CurForeCastView.addEventListener("click", e => {
	const el = e.target.closest(".cur__Forecast--overview");

	const { date, lat, lon, place } = el.dataset;

	getDetailedForecastData(lat, lon, date, place);
	CurForeCastView.style.display = "none";

	EventView.classList.remove("hide");
	detailedForeCastViewContainer.classList.add("fadeIn");
});

close.addEventListener("click", () => {
	EventView.classList.add("hide");
	detailedForeCastViewContainer.classList.remove("fadeIn");
	// detailedForeCastViewContainer.classList.add(".fadeOut");

	CurForeCastView.style.display = "flex";
	close.classList.remove("close__icon--show");
	init();
});

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
