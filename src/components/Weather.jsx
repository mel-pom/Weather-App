import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Weather.css";

const API_BASE = "https://api.openweathermap.org/data/2.5/weather";

const Weather = ({ defaultCity = "London" }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const [units, setUnits] = useState("metric"); // 👈 added state for unit toggle (metric = °C)
  const [loading, setLoading] = useState(false); // 👈 added loading state
  const abortRef = useRef(null);

  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY ?? import.meta.env.VITE_APP_ID;


  const parseWeather = (data) => ({
    humidity: data?.main?.humidity ?? null,
    windSpeed: data?.wind?.speed ?? null,
    temperature: Number.isFinite(data?.main?.temp) ? Math.round(data.main.temp) : null,
    feelsLike: Number.isFinite(data?.main?.feels_like) ? Math.round(data.main.feels_like) : null,
    location: data?.name ?? null,
    country: data?.sys?.country ?? null,
    description: data?.weather?.[0]?.description ?? null,
    icon: data?.weather?.[0]?.icon ?? null,
    updatedAt: new Date(),
  });

  const search = useCallback(
    async (city) => {
      const trimmed = city?.trim();
      if (!trimmed || !apiKey) return;
      setLoading(true);
      setError(null);

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const url = `${API_BASE}?q=${encodeURIComponent(trimmed)}&units=${units}&appid=${apiKey}`;
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          let msg = `Request failed (${res.status})`;
          try {
            const errBody = await res.json();
            if (errBody?.message) msg = errBody.message;
          } catch {
            // intentionally ignored
          }
          throw new Error(msg);
        }

        const data = await res.json();
        setWeatherData(parseWeather(data));
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error fetching weather:", err);
        setWeatherData(null);
        setError(
          err?.message
            ? err.message.charAt(0).toUpperCase() + err.message.slice(1)
            : "Failed to fetch weather."
        );
      } finally {
        setLoading(false);
      }
    },
    [apiKey, units]
  );

  useEffect(() => {
    search(defaultCity);
    return () => abortRef.current?.abort();
  }, [defaultCity, search]);

  // 👇 re-fetch current city when units change
  useEffect(() => {
    if (weatherData?.location) {
      search(weatherData.location);
    }
  }, [units]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleKeyDown = (e) => {
    if (e.key === "Enter") search(query);
  };

  const toggleUnits = () => {
    setUnits((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search city (e.g. London)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Search city"
        />
        
        <button
          className="unit-toggle"
          onClick={toggleUnits}
          aria-label="Toggle units"
        >
          {units === "metric" ? "°C → °F" : "°F → °C"}
        </button>
      </div>

      {!apiKey && (
        <div className="error">
          Missing API key. Add <code>VITE_OPENWEATHER_KEY</code> to your <code>.env</code>.
        </div>
      )}

      {error && <div className="error">{error}</div>}

      {loading && (
        <div className="loading" aria-live="polite">
          Loading...
        </div>
      )}

      {weatherData && (
        <div className="weather-card" role="region" aria-live="polite">
          <h2 className="location">
            {weatherData.location}
            {weatherData.country ? `, ${weatherData.country}` : ""}
          </h2>

          <div className="temp-row">
            {weatherData.icon && (
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                alt={weatherData.description ? `Icon: ${weatherData.description}` : "Weather icon"}
                loading="lazy"
              />
            )}
            <span className="temp">
              {weatherData.temperature ?? "--"}°
              {units === "metric" ? "C" : "F"}
            </span>
          </div>

          <div className="details">
            {weatherData.description && (
              <span className="capitalize">{weatherData.description}</span>
            )}
            <span>Feels like: {weatherData.feelsLike ?? "--"}°</span>
            <span>Humidity: {weatherData.humidity ?? "--"}%</span>
            <span>
              Wind: {weatherData.windSpeed ?? "--"} {units === "metric" ? "m/s" : "mph"}
            </span>
          </div>

          {weatherData.updatedAt && (
            <div className="updated">
              Updated: {weatherData.updatedAt.toLocaleTimeString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Weather;
