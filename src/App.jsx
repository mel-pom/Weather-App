import React, { useEffect, useState } from 'react'
import Weather from './components/Weather'

const THEME_KEY = 'weatherapp:theme'

const App = () => {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.setAttribute('data-theme', 'dark')
    else root.removeAttribute('data-theme')

  try { localStorage.setItem(THEME_KEY, theme) } catch (e) { console.warn('Could not persist theme', e) }
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <div className='app'>
      <div className="container">
        <header className="app-header">
          <h1>Weather App</h1>
          <p>Your daily forecast, simplified.</p>
        </header>

        <Weather defaultCity={"Kelowna"} />

        <div className="theme-toggle-wrap">
          <button className="theme-toggle" onClick={toggleTheme} aria-pressed={theme === 'dark'} aria-label="Toggle theme">
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App