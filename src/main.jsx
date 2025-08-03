import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../App.jsx'
import DemoPage from '../components/DemoPage.jsx'
import MidjourneyShowcase from '../components/MidjourneyShowcase.jsx'
import '../App.css'

// Simple routing
const path = window.location.pathname

let ComponentToRender
if (path === '/demo') {
  ComponentToRender = DemoPage
} else if (path === '/midjourney') {
  ComponentToRender = MidjourneyShowcase
} else if (path === '/login' || path === '/signup') {
  ComponentToRender = App
} else {
  ComponentToRender = App
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ComponentToRender />
  </React.StrictMode>,
) 