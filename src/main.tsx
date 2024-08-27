import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './context/AuthContext/AuthContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/default/HomePage/HomePage'
import NotFoundPage from './pages/default/NotFoundPage/NotFoundPage'
import PageContainer from './components/containers/PageContainer/PageContainer'
import UnauthorizedPage from './pages/default/UnauthorizedPage/UnauthorizedPage'
import LogoutPage from './pages/default/LogoutPage/LogoutPage'
import ProtectedRoute from './utils/ProtectedRoute/ProtectedRoute'
import { AuthRole } from './context/AuthContext/IAuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <PageContainer> <HomePage /> </PageContainer> } />
          <Route path={'/unauthorized'} element={<PageContainer> <UnauthorizedPage/> </PageContainer>}/>
          <Route path={'/logout'} element={<PageContainer> <LogoutPage/> </PageContainer>}/>
          <Route element={ <ProtectedRoute roles={[AuthRole.ADMIN]}/> }>
              <Route path={'/test'} element={<PageContainer> <HomePage/> </PageContainer>}/>
          </Route>
          <Route path="*" element={ <NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
