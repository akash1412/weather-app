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
		err => console.log(err)
	);
}

function searchCities(query) {
	fetch(
		// `https://cors-anywhere.herokuapp.com/https://get-cities-ids.herokuapp.com/?q=${query}`,
		`https://proxxy.herokuapp.com/https://get-cities-ids.herokuapp.com/?q=${query}`,
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	)
		.then(res => res.json())
		.then(cities => renderSearchResults(cities))
		.catch(err => console.log(err));
}

async function handleListClick(e) {
	const { lat: latitude, lon: longitude, date, name } = e.target.closest(
		".search__list"
	).dataset;

	await setLocalStorage({ latitude, longitude });
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

		searchResultsContainer.insertAdjacentHTML("afterbegin", citytHtml);
	});

	document.querySelectorAll(".search__list").forEach(e => {
		e.addEventListener("click", handleListClick);
	});
}

const fetchCurForcast = async coords => {
	const response = await fetch(
		` https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=983fe9217aa2f17f99c9d6dd7d01dd07`
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
}) {
	let html = ` <div class="list__card history__list searched__items shadow-light" data-lat=${lat} data-lon=${lon} data-name=${name} data-temp=${temp} data-temp_min=${temp_min} data-temp_max=${temp_max} data-desc=${desc}>
	<h2>${name},${country}</h2>
	 <div class="list__card--specs"> 
		 <div class="list__specs--left">
			 <img src='/sun.svg' class='list__card--icon' />
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
async function setLocalStorage(coords) {
	// searchedCitiesHistoryContainer.innerHTML = spinner;
	let searchedArray =
		(await JSON.parse(localStorage.getItem("searchedArray"))) || [];

	const {
		name,
		sys: { country },
		coord,
		main: { temp, temp_min, temp_max },
		weather: [{ main: desc }],
	} = await fetchCurForcast(coords);

	// searchedCitiesHistoryContainer.innerHTML = "";

	// searchedCitiesHistoryContainer.insertAdjacentHTML(
	// 	"beforeend",
	// 	renderListHtml({ name, country, coord, desc, temp, temp_max, temp_min })
	// );

	const item = { name, country, coord, temp, temp_min, temp_max, desc };

	searchedArray.push(item);

	await localStorage.setItem("searchedArray", JSON.stringify(searchedArray));
}

async function fetchCurrentGeoForecastUI(coords) {
	const res = await fetchCurForcast(coords);

	renderCurForeCast(res);
}

function renderCurForeCast(data) {
	const {
		id,
		dt: date,
		coord: { lat, lon },
		name,
		main: { feels_like, humidity, temp, temp_max, temp_min },
		sys: { country },
		weather: [{ description, main, icon }],
	} = data;

	let html = ` 
                <div class="card__container fadeIn">
				
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
	</div>
	`;

	CurForeCastView.innerHTML = "";

	const vals = [
		"date",
		"lat",
		"lon",
		"name",
		"temp",
		"temp_min",
		"temp_max",
		"desc",
	];
	[date, lat, lon, name, temp, temp_min, temp_min, main].forEach(
		(prop, idx) => (CurForeCastView.dataset[vals[idx]] = prop)
	);

	CurForeCastView.insertAdjacentHTML("afterbegin", html);
}

function getDetailedForecastData(lat, lon, curDetail) {
	detailedForeCastCur.innerHTML = spinner;

	fetch(
		`https://proxxy.herokuapp.com/api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=8648a8b8952ada626637f7455c003c32`
		// `api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&dt=${dt}&appid=983fe9217aa2f17f99c9d6dd7d01dd07`
		// `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&dt=${dt}&appid=983fe9217aa2f17f99c9d6dd7d01dd07`
	)
		.then(res => res.json())
		.then(data => {
			renderDetailedForecastView({ ...data, curDetail });
		})
		.catch(err => console.log(err));
}

function renderDetailedForecastView(data) {
	const { city, list, curDetail } = data;

	detailedForeCastTitle.textContent = city.name;
	let curHtml = `
				<h2 class="cur__detail-name">Current Weather</h2>
				<div class="cur__detail-icon">
					<img class="icon" src="./sun.svg" alt="icon"/>
					<span class="cur__detail-temp">${KelvinToCelcius(curDetail.temp)}°C</span>
				</div>
				<p class="description cur-description">${curDetail.desc}</p>
				<span class="maxmin--temp">${KelvinToCelcius(
					curDetail.temp_min
				)}°C.${KelvinToCelcius(curDetail.temp_max)}°C</span>
			 `;

	close.classList.add("close__icon--show");

	if (!data) {
		throw alert("error occured please refresh");
	}

	detailedForeCastCur.innerHTML = "";

	detailedForeCastCur.insertAdjacentHTML("afterbegin", curHtml);

	list.reverse().forEach(el => {
		const {
			dt_txt,
			main: { temp, temp_max, temp_min },

			weather: [{ main: desc }],
		} = el;

		let date = new Date(dt_txt);
		let curDate = date.getDate();
		let curDay = days[date.getDay()];
		let curMonth = months[date.getMonth()];
		let curTime = date.getHours();

		let timeStr = `${String(curTime).padEnd(00)}:00 ${
			curTime < 12 ? "am" : "pm"
		}`;

		let html = ` <div class="list__card shadow-light">
		               <span class="list__card--dateAndTime">${curDay},${curDate}, ${curMonth}, ${timeStr} </span>
		                 <div class="list__card--specs"> 
						     <div class="list__specs--left">
							   <img src='/sun.svg' class='list__card--icon' />
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
	const searchedArray = JSON.parse(await localStorage.getItem("searchedArray"));

	if (!searchedArray) {
		return (searchedCitiesHistoryContainer.innerHTML =
			"you have not searched locations");
	}
	searchedCitiesHistoryContainer.innerHTML = "";
	searchedArray.forEach(el => {
		searchedCitiesHistoryContainer.insertAdjacentHTML(
			"beforeend",
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
}

CurForeCastView.addEventListener("click", e => {
	const el = e.target.closest(".cur__Forecast--overview");

	const { date, lat, lon, ...curDetail } = el.dataset;

	getDetailedForecastData(lat, lon, curDetail);

	othersContainer.style.display = CurForeCastView.style.display = "none";
	Tabs.classList.remove("hide");
	close.classList.remove("hidden");
	detailedForeCastViewContainer.classList.remove("hidden");
});

function handleCloseAction() {
	close.classList.add("hidden");
	Tabs.classList.add("hide");
	detailedForeCastViewContainer.classList.add("hidden");
	detailedForeCastList.innerHTML = "";
	detailedForeCastCur.style.display = "none";
	searchedCitiesHistoryContainer.innerHTML = "";
	detailedForeCastTitle.textContent = "";
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
	searchedCitiesHistoryContainer.innerHTML = spinner;
	displayLoacalStorageItems();
}

init();
