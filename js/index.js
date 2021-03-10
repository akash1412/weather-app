const API_KEY = "381d904bb5f8891c68c8a3c817e855ce";

// use class to build the app
// getLocation()
//getcurrentLocation weather details
//render on the screen
const KelvinToCelcius = tempInKelv => (tempInKelv - 273).toFixed(1);

const MainContent = document.querySelector(".content__center");
const CurLocationOverview = document.querySelector(".cur__location-overview");
const detailedForeCastViewContainer = document.querySelector(
	".detailed__forecast-view"
);
const spinner = document.querySelector(".spinner");

class App {
	constructor() {
		this.getLocation();
	}
	getLocation() {
		if (!navigator.geolocation) alert("geolocation not available");
		navigator.geolocation.getCurrentPosition(
			success => {
				this.getWeatherDetails(success.coords);
				console.log(success);
			},
			err => console.log(err)
		);
	}
	getWeatherDetails(coords) {
		console.log(coords);
		fetch(
			` https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=983fe9217aa2f17f99c9d6dd7d01dd07`
		)
			.then(res => res.json())
			.then(weatherData => this.renderCurrentLocationDetail(weatherData))
			.catch(err => console.log(err));
	}
	renderCurrentLocationDetail(curData) {
		if (curData) spinner.style.display = "none";

		const {
			id,
			dt,
			name,
			main: { feels_like, humidity, temp, temp_max, temp_min },
			sys: { country },
			weather: [{ description, main, icon }],
		} = curData;

		console.log(id);
		let html = ` <div class="cur__location-detail" data-id=${id}>
        <h2 class="cur__detail-name">${name},${country}</h2>
        <div class="cur__detail-icon">
            <img class="icon" src="./sun.svg" alt="icon"/>
            <span class="cur__detail-temp">${KelvinToCelcius(temp)}C</span>
        </div>
        <p class="description cur-description">${main}</p>
        <p class="cur__maxmin--temp">${KelvinToCelcius(
					temp_min
				)}C.${KelvinToCelcius(temp_max)}C</p>
    </div> `;

		CurLocationCard.insertAdjacentHTML("afterbegin", html);
	}

	getWeatherDetailsForNext5Days(id) {
		fetch(
			`pro.openweathermap.org/data/2.5/forecast/hourly?id=${id}&appid=983fe9217aa2f17f99c9d6dd7d01dd07`
		)
			.then(res => res.json())
			.then(data => console.log(data));
	}
}

// const app = new App();

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
	// let spinner = `<div class="lds-ripple spinner">
	// 			<div></div>
	// 			<div></div>
	// 			 </div>`;

	fetch(
		` https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=983fe9217aa2f17f99c9d6dd7d01dd07`
	)
		.then(res => res.json())
		.then(data => renderCurLocationForeCast(data))
		.catch(err => console.log(err));
}

function renderCurLocationForeCast(data) {
	console.log(data);
	const {
		id,
		dt,
		coord,
		name,
		main: { feels_like, humidity, temp, temp_max, temp_min },
		sys: { country },
		weather: [{ description, main, icon }],
	} = data;

	let html = `    <h2 class="cur__detail-name">${name},${country}</h2>
					<div class="cur__detail-icon">
						<img class="icon" src="./sun.svg" alt="icon"/>
						<span class="cur__detail-temp">${KelvinToCelcius(temp)}C</span>
					</div>
					<p class="description cur-description">${main}</p>
					<p class="cur__maxmin--temp">${KelvinToCelcius(temp_min)}C.${KelvinToCelcius(
		temp_max
	)}C</p>`;

	CurLocationOverview.dataset.date = dt;
	CurLocationOverview.dataset.lat = coord.lat;
	CurLocationOverview.dataset.lon = coord.lon;

	CurLocationOverview.insertAdjacentHTML("afterbegin", html);
}

function getDetailedForecastData(lat, lon, dt) {
	fetch(
		`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&dt=${dt}&appid=983fe9217aa2f17f99c9d6dd7d01dd07`
	)
		.then(res => res.json())
		.then(data => renderDetailedForecastView(data))
		.catch(err => console.log(err));
}

function renderDetailedForecastView(data) {
	const { current, daily } = data;
	CurLocationOverview.classList.add("hidden");
	detailedForeCastViewContainer.classList.remove("hidden");
	daily.forEach(el => {
		let html = ` <div>${KelvinToCelcius(el.temp.day)}</div>`;

		detailedForeCastViewContainer.insertAdjacentHTML("afterbegin", html);
	});
}

CurLocationOverview.addEventListener("click", e => {
	const el = e.target.closest(".cur__location-overview");

	const { date, lat, lon } = el.dataset;
	getDetailedForecastData(lat, lon, date);
	el.style.display = "none";
	// el.classList.add("hidden");

	// setTimeout(() => {
	// 	el.style.display = "none";
	// }, 1000);
});

function init() {
	getLocation();
}

init();

// code to get daily & hourly forecast
// fetch(
// 	"https://api.openweathermap.org/data/2.5/onecall?lat=20.1628017&lon=85.702648&dt=1586468027&appid=983fe9217aa2f17f99c9d6dd7d01dd07"
// )
// 	.then(res => res.json())
// 	.then(data => console.log(data))
// 	.catch(err => console.log(err));
