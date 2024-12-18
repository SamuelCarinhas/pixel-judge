import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LandingPage from './pages/LandingPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <LandingPage /> } />
        <Route path="/home" element={ <HomePage /> } />
        <Route path="*" element={ <>Not Found</> } />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
