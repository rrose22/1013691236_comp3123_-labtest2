import React, { useState, useEffect } from 'react';
import './Weather.css';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState(null);

  const getWeatherData = async () => {
    try {
      const weatherResponse = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=52a429c29e5d4d789fa213203233011&q=${city}`
      );

      if (!weatherResponse.ok) {
        throw new Error('City cannot be found');
      }

      const weatherData = await weatherResponse.json();
      setWeatherData(weatherData);
      setError(null);

      const forecastResponse = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=52a429c29e5d4d789fa213203233011&q=${city}&days=8`
      );

      if (!forecastResponse.ok) {
        throw new Error('Error fetching forecast data');
      }

      const forecastData = await forecastResponse.json();
      setForecastData(forecastData);
    } 
    catch (error) {
      setWeatherData(null);
      setForecastData(null);
      setError('City cannot be found');
    }
  };
  const getDayOfWeek = (dateString) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    const dayOfWeek = daysOfWeek[date.getDay()];
    return dayOfWeek;
  };

  useEffect(() => {
      getWeatherData();
  }, []); 

  return (
    <div className='main'>
      <div className='cityContainer'>
        <h1>Forecast App</h1>
        <input
          type='text'
          placeholder='Enter city name'
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeatherData}> Get Weather </button>
        {error && <p className='text-danger'>{error}</p>}
      </div>

      <div className='containerWrapper'>
        {weatherData && (
          <div className='todayContainer'>
            <h2>{weatherData.location.name}, {weatherData.location.country}</h2>
            <img
              className='weather-icon'
              src={`${weatherData.current.condition.icon}`}
              alt='Weather Icon'
            />
            <p>{weatherData.current.condition.text}</p>
            <p>Temperature: {weatherData.current.temp_c}°C</p>
            <p>Humidity: {weatherData.current.humidity}%</p>
            <p>Wind: {weatherData.current.wind_kph} km/h</p>
          </div>
        )}
        {forecastData && (
          <div className='forecastContainer'>
            <h2>8-Day Forecast</h2>
            <div className='containerWrapper'>
              {forecastData.forecast.forecastday.map((day) => (
                <div key={day.date} className='forecastDayContainer'>
                  <p>{getDayOfWeek(day.date)}</p>
                  <img
                    className='weather-icon'
                    src={`${day.day.condition.icon}`}
                    alt='Weather Icon'
                  />
                  <p>Condition: {day.day.condition.text}</p>
                  <p>Max: {day.day.maxtemp_c}°C</p>
                  <p>Min: {day.day.mintemp_c}°C</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Weather;
