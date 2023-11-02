// src/App.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloud, faCloudSun, faCloudRain, faSnowflake, faWind } from '@fortawesome/free-solid-svg-icons';



type Weather = {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
  }[];
  wind: {
    speed: number;
  };
};

const App: React.FC = () => {
  // State to store weather data
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    // Function to fetch weather data
    const fetchWeatherData = async (latitude: number, longitude: number) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}&units=metric`
        );
        setWeather(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    // Fetch user's geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
      });
    }
  }, []);

  const getWeatherIcon = (temperature: number, humidity: number, windSpeed: number, timeOfDay: any) => {
    if (temperature > 25) {
      return <FontAwesomeIcon icon={faSun} className="sun" />;
    } else if (temperature < 10) {
      return <FontAwesomeIcon icon={faCloudSun} className="cloud" />;
    } else if (humidity > 70) {
      return <FontAwesomeIcon icon={faCloudRain} className="rain" />;
    } else if (windSpeed > 5) {
      return <FontAwesomeIcon icon={faWind} className="wind" />;
    } else {
      return <FontAwesomeIcon icon={faSnowflake} className="snow" />;
    }
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      {weather && (
        <div className="weather-info">
          <h2>Weather in {weather.name}</h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Weather: {weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default App;
