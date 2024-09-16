import React, { useState, useEffect } from 'react';
import './Weather.scss'
import moment from 'moment';

const Weather = (props) => {
  const [attribute, setAttribute] = useState(props.attribute);
  const [weatherData, setWeatherData] = useState(null);
  const API_KEY = 'ca1a0b0b470c76923129d8dacf9177d6';

  useEffect(() => {
    if (props.attribute) {
        setAttribute(props.attribute);
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${props.attribute.latitude}&lon=${props.attribute.longitude}&appid=${API_KEY}`)
          .then(response => response.json())
          .then(data => setWeatherData(data));
    }
  }, [props.attribute]);

  return (
    <>
      {weatherData ? (
        <div>
          <p className='header'>{weatherData.name}</p>
          <div className="flex">
            <p className="day">{moment().format('dddd')}, <span>{moment().format('LL')}</span></p>
            <p className="description">{weatherData.weather[0].main}</p>
          </div>
          <div className="flex">
            <p className="temp">Temprature: {(weatherData.main.temp -273.15).toFixed(1)} &deg;C</p>
            <p className="temp">Humidity: {weatherData.main.humidity} %</p>
          </div>
          <div className="flex">
            <p className="wind">Wind's speed: {weatherData.wind.speed} m/s</p>
            <p className="wind">Visibility: {weatherData.visibility / 1000} Km</p>
          </div>
          <div className="flex">
            <p className="sunrise-sunset">Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-IN')}</p>
            <p className="sunrise-sunset">Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-IN')}</p>
          </div>
        </div>
      ) : (
        <p>Undefined</p>
      )}
    </>
  );
}

export default Weather;