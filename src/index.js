import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from './store'
import App from './App.jsx'
import './index.css'

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '')

axios.defaults.baseURL = API_BASE_URL
axios.interceptors.request.use((config) => {
  if (typeof config.url === 'string') {
    if (config.url.startsWith('http://127.0.0.1:8000')) {
      config.url = config.url.replace('http://127.0.0.1:8000', API_BASE_URL)
    } else if (config.url.startsWith('http://localhost:8000')) {
      config.url = config.url.replace('http://localhost:8000', API_BASE_URL)
    }
  }

  return config
})

const root = ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
