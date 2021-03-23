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
const detailedForeCastTitle = document.querySelector(".detailedForCastTitle");

const Tabs = document.querySelector(".tabs");
const EventDetails = document.querySelector(".event__details");
const EventTitle = document.querySelector(".event__title");
const EventDesc = document.querySelector(".event__desc");
const EventIcon = document.querySelector(".event__icon");

const searchView = document.querySelector(".search");
const searchResultsContainer = document.querySelector(".search__results");

const close = document.querySelector(".close");
const othersContainer = document.querySelector(".others");
const searchedCitiesHistoryContainer = document.querySelector(
	".searched__citiesHistory--container"
);
const addCitiesBtn = document.querySelector(".add__cities");

const form = document.querySelector(".form");
const formInput = document.querySelector(".form__input");

const clearSavedLocationsBtn = document.querySelector(".clear__btn");

const spinner = `<div class="spinner">
					<div></div>
					<div></div>
				</div>  
`;

function getLocation() {
	if (!navigator.geolocation) alert("geolocation not available");
	navigator.geolocation.getCurrentPosition(
		success => {
			fetchCurrentGeoForecastUI(success.coords);
		},
		err => {
			console.log(err);
			renderErrorUI(err.message);
			CurForeCastView.removeEventListener(
				"click",
				GetDetailedForecastOfCurLoaction
			);
		}
	);
}

function searchCities(query) {
	fetch(
		`https://proxxy.herokuapp.com/https://get-cities-ids.herokuapp.com/?q=${query}`,
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	)
		.then(res => res.json())
		.then(cities => {
			console.log(cities);
			renderSearchResults(cities);
		})
		.catch(err => console.log(err));
}

async function handleListClick(e) {
	const { lat, lon } = e.target.closest(".search__list").dataset;

	await setLocalStorage(lat, lon);
	handleCloseAction();
}

function renderSearchResults(citiesArray) {
	searchResultsContainer.innerHTML = "";

	citiesArray.forEach(city => {
		const {
			coord: { lat, lon },
			name,
			country,
		} = city;
		let citytHtml = `
	         <li class="search__list" data-lat=${lat} data-lon=${lon} data-name=${name}>
			    ${name}, ${country}
			 </li>
	`;

		console.log(lat, lon);

		searchResultsContainer.insertAdjacentHTML("afterbegin", citytHtml);
	});

	document.querySelectorAll(".search__list").forEach(e => {
		e.addEventListener("click", handleListClick);
	});
}

const fetchCurForcast = async (lat, lon) => {
	const response = await fetch(
		` https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=983fe9217aa2f17f99c9d6dd7d01dd07`
	)
		.then(res => res.json())
		.catch(err => console.log(err));

	return response;
};

function renderListHtml({
	name,
	country,
	coord: { lat, lon },
	desc,
	temp,
	temp_max,
	temp_min,
	icon,
}) {
	let html = ` <div class="list__card history__list  searched__items shadow-light" data-lat=${lat} data-lon=${lon} data-name=${name} data-temp=${temp} data-temp_min=${temp_min} data-temp_max=${temp_max} data-desc=${desc}>
	<h2>${name},${country}</h2>
	 <div class="list__card--specs">
		 <div class="list__specs--left">
			 <img src='../images/weather/${icon}.svg' class='list__card--icon' alt='weather_icon' />
			 <div class="list__descContainer">
			 <span class="description">${desc}</span>
			 <span class="maxmin--temp">${KelvinToCelcius(temp_min)}°C.${KelvinToCelcius(
		temp_max
	)}°C</span>
			 </div>
		 </div>
		 <div class="list__specs--right temp">
			 ${KelvinToCelcius(temp)}°C
		 </div>
	 </div>
  </div>`;

	return html;
}
async function setLocalStorage(lat, lon) {
	// searchedCitiesHistoryContainer.innerHTML = spinner;
	let searchedArray =
		(await JSON.parse(localStorage.getItem("searchedArray"))) || [];

	const {
		name,
		sys: { country },
		coord,
		main: { temp, temp_min, temp_max },
		weather: [{ main: desc, icon }],
	} = await fetchCurForcast(lat, lon);

	const item = { name, country, coord, temp, temp_min, temp_max, desc, icon };

	searchedArray.push(item);

	await localStorage.setItem("searchedArray", JSON.stringify(searchedArray));
}

async function fetchCurrentGeoForecastUI(coords) {
	const res = await fetchCurForcast(coords.latitude, coords.longitude);

	renderCurForeCast(res);
}

function renderErrorUI(errMsg) {
	console.log(errMsg);
	CurForeCastView.innerHTML = `<p class='warn'>${errMsg}</p>`;
}

function destructHelper(data) {
	const {
		id,
		dt: date,
		coord: { lat, lon },
		name,
		main: { feels_like, humidity, temp, temp_max, temp_min },
		sys: { country },
		weather: [{ description, main, icon }],
	} = data;

	// prettier-ignore

	return {
		id,
		date,
		lat,
		lon,
		name,
		country,
		temp,
		temp_max,
		temp_min,
		main,
		icon,
	};
}

function renderCurForeCast(data) {
	// prettier-ignore
	const {
		id,
		date,
		lat,
		lon,
		name,
		temp,
		temp_max, 
		temp_min,
		country,
		main,
		icon
	} = destructHelper(data);

	console.log(icon);

	let html = `
                <div class="card__container fadeIn">

	              <h2 class="cur__detail-name">${name},${country}</h2>
					<div class="cur__detail-icon">
						<img class="icon" src='../images/weather/${icon}.svg' alt="weather_icon"/>
						<span class="cur__detail-temp">${KelvinToCelcius(temp)}°C
						</span>
					</div>
					<span class="description cur-description">${main}</span>
					<span class="maxmin--temp">${KelvinToCelcius(temp_min)}°C.${KelvinToCelcius(
		temp_max
	)}°C</span>
	</div>
	`;

	CurForeCastView.innerHTML = "";

	CurForeCastView.dataset.lat = lat;
	CurForeCastView.dataset.lon = lon;

	CurForeCastView.insertAdjacentHTML("afterbegin", html);
}

async function getDetailedForecastData(lat, lon) {
	detailedForeCastCur.innerHTML = spinner;
	detailedForeCastList.innerHTML = spinner;

	const curForCastData = await fetchCurForcast(lat, lon);

	const dataForNext5days = await fetch(
		`https://proxxy.herokuapp.com/api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=983fe9217aa2f17f99c9d6dd7d01dd07`
	)
		.then(res => res.json())
		.catch(err => console.log(err));

	Promise.all([curForCastData, dataForNext5days]).then(res => {
		renderDetailedForecastView(res);
	});
}

function renderDetailedForecastView(data) {
	const [currentData, dataForNext5days] = data;

	const { temp, temp_max, temp_min, main, name, icon } = destructHelper(
		currentData
	);

	detailedForeCastTitle.textContent = name;

	let curHtml = `
				<h2 class="cur__detail-name">Current Weather</h2>
				<div class="cur__detail-icon">
					<img class="icon" src='../images/weather/${icon}.svg' alt="weather_icon"/>
					<span class="cur__detail-temp">${KelvinToCelcius(temp)}°C</span>
				</div>
				<p class="description cur-description">${main}</p>
				<span class="maxmin--temp">${KelvinToCelcius(temp_min)}°C.${KelvinToCelcius(
		temp_max
	)}°C</span>
			 `;

	close.classList.add("close__icon--show");

	if (!data) {
		throw alert("error occured please refresh");
	}

	detailedForeCastCur.innerHTML = "";
	detailedForeCastList.innerHTML = "";

	detailedForeCastCur.insertAdjacentHTML("afterbegin", curHtml);

	dataForNext5days.list
		.filter(d => new Date(d.dt_txt) > new Date())
		.reverse()
		.forEach(el => {
			const {
				dt_txt,
				main: { temp, temp_max, temp_min },

				weather: [{ main: desc, icon }],
			} = el;

			let date = new Date(dt_txt);
			let curDate = date.getDate();
			let curDay = days[date.getDay()];
			let curMonth = months[date.getMonth()];
			let curTime = date.getHours();

			let timeStr = `${String(curTime).padEnd(00)}:00 ${
				curTime < 12 ? "am" : "pm"
			}`;

			let html = ` <div class="list__card shadow-light fadeIn">
		               <span class="list__card--dateAndTime">${curDay},${curDate}, ${curMonth}, ${timeStr} </span>
		                 <div class="list__card--specs">
						     <div class="list__specs--left">
							   <img src='../images/weather/${icon}.svg' class='list__card--icon' alt='weather_icon' />
							   <div class="list__descContainer">
							   <span class="description">${desc}</span>
							   <span class="maxmin--temp">${temp_min}.${temp_max}</span>
							   </div>
							 </div>
						     <div class="list__specs--right temp">
							   ${temp}°C
							 </div>
						 </div>
		            </div>`;

			detailedForeCastList.insertAdjacentHTML("afterbegin", html);
		});
}

async function displayLoacalStorageItems() {
	searchedCitiesHistoryContainer.innerHTML = spinner;
	const searchedArray = JSON.parse(await localStorage.getItem("searchedArray"));

	if (!searchedArray) {
		return (searchedCitiesHistoryContainer.innerHTML =
			"<p class='warn'>You have no saved cities. Click the button above to add them!</p>");
	}

	setTimeout(() => {
		searchedCitiesHistoryContainer.innerHTML = "";
		searchedArray.forEach(el => {
			console.log(el);
			searchedCitiesHistoryContainer.insertAdjacentHTML(
				"afterbegin",
				renderListHtml(el)
			);
		});

		document.querySelectorAll(".history__list").forEach(list => {
			list.addEventListener("click", e => {
				const el = e.target.closest(".history__list");

				const { lat, lon, ...curDetail } = el.dataset;

				getDetailedForecastData(lat, lon, curDetail);
				//----------------------------------------------------------
				othersContainer.style.display = CurForeCastView.style.display = "none";
				Tabs.classList.remove("hide");
				close.classList.remove("hidden");
				detailedForeCastViewContainer.classList.remove("hidden");
			});
		});
	}, 700);
}

async function clearLocalStorage() {
	await localStorage.removeItem("searchedArray");
	displayLoacalStorageItems();
}

clearSavedLocationsBtn.addEventListener("click", clearLocalStorage);

function GetDetailedForecastOfCurLoaction(e) {
	const el = e.target.closest(".cur__Forecast--overview");

	const { lat, lon } = el.dataset;

	getDetailedForecastData(lat, lon);

	othersContainer.style.display = CurForeCastView.style.display = "none";
	Tabs.classList.remove("hide");

	close.classList.remove("hidden");
	detailedForeCastViewContainer.classList.remove("hidden");
}

CurForeCastView.addEventListener("click", GetDetailedForecastOfCurLoaction);

function clearTabView() {
	detailedForeCastViewContainer.classList.add("hidden");
	detailedForeCastList.innerHTML = "";

	detailedForeCastTitle.textContent = "";
	// ------ search view ------------------//
	searchedCitiesHistoryContainer.innerHTML = "";
}

function handleCloseAction() {
	close.classList.add("hidden");
	Tabs.classList.add("hide");

	clearTabView();

	detailedForeCastCur.style.display = "none";

	setTimeout(() => {
		detailedForeCastCur.style.display = "flex";
		searchResultsContainer.innerHTML = "";
	}, 1000);

	searchView.classList.add("hidden");

	othersContainer.style.display = CurForeCastView.style.display = "flex";
	init();
}

close.addEventListener("click", handleCloseAction);

form.addEventListener("submit", e => {
	e.preventDefault();
	searchResultsContainer.innerHTML = spinner;
	searchCities(formInput.value);
	formInput.value = "";
});

function showSearchView() {
	Tabs.classList.remove("hide");
	detailedForeCastCur.style.display = "none";

	searchView.classList.remove("hidden");

	close.classList.remove("hidden");

	othersContainer.style.display = CurForeCastView.style.display = "none";
	//--------------------------------------------------------///
	document.querySelectorAll(".search__list").forEach(e => {
		e.addEventListener("click", handleListClick);
	});
}

addCitiesBtn.addEventListener("click", showSearchView);

function init() {
	getLocation();
	CurForeCastView.innerHTML = spinner;
	displayLoacalStorageItems();
}

init();
