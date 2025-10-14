import React, { useEffect, useState } from 'react'
import './Weather.css'


const Weather = () => {

  const [weatherData, setWeatherData] = useState(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (city) => {
    if (!city) return;
    setLoading(true);
    setError(null);
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
    setWeatherData({
      humidity: data?.main?.humidity ?? null,
      windSpeed: data?.wind?.speed ?? null,
      temperature: data?.main?.temp ? Math.floor(data.main.temp) : null,
      location: data?.name ?? null,
      icon: data?.weather && data.weather[0] ? data.weather[0].icon : null,
    });

  } catch (error) {
    console.error('Error fetching weather:', error);
    setError('Failed to fetch weather.');
  } finally {
    setLoading(false);
  }
  }  

  useEffect(()=>{
    search("London");
  },[])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') search(query.trim());
  };

  return (
    <div className='weather'>
      <div className="search-bar">
        <input
          type="text"
          placeholder='Search city (e.g. London)'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={() => search(query.trim())} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {weatherData && (
        <div className="weather-card">
          <h2 className="location">{weatherData.location}</h2>
          <div className="temp-row">
            {weatherData.icon && (
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                alt="weather icon"
              />
            )}
            <span className="temp">{weatherData.temperature ?? '--'}°C</span>
          </div>
          <div className="details">
            <span>Humidity: {weatherData.humidity ?? '--'}%</span>
            <span>Wind: {weatherData.windSpeed ?? '--'} m/s</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Weather