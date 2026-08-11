import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { initToolbar } from '@21st-extension/toolbar'
import './index.css'
import App from './App.jsx'

if (process.env.NODE_ENV === 'development') {
  initToolbar({})
}

import { SpeedInsights } from "@vercel/speed-insights/react"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <SpeedInsights />
    </BrowserRouter>
  </StrictMode>,
)
