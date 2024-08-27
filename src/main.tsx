import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './context/AuthContext/AuthContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/default/HomePage/HomePage'
import NotFoundPage from './pages/default/NotFoundPage/UnauthorizedPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <HomePage /> } />
          <Route path="*" element={ <NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
