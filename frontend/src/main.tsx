import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './context/AuthContext/AuthContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/default/HomePage/HomePage'
import NotFoundPage from './pages/default/NotFoundPage/NotFoundPage'
import PageContainer from './components/containers/PageContainer/PageContainer'
import LogoutPage from './pages/default/LogoutPage/LogoutPage'
import ProtectedRoute from './utils/ProtectedRoute/ProtectedRoute'
import { AuthRole } from './context/AuthContext/IAuthContext'
import ContestPage from './pages/default/ContestsPage/ContestsPage'
import ForumPage from './pages/default/ForumPage/ForumPage'
import ProblemsPage from './pages/default/ProblemsPage/ProblemsPage'
import RatingPage from './pages/default/RatingPage/RatingPage'
import SignInPage from './pages/default/SignInPage/SignInPage'
import SignUpPage from './pages/default/SignUpPage/SignUpPage'
import UserPage from './pages/default/UserPage/UserPage'
import VerifyAccountPage from './pages/default/VerifyAccountPage/VerifyAccountPage'
import EditUserPage from './pages/user/EditUserPage/EditUserPage'
import AdminContainer from './components/containers/AdminContainer/AdminContainer'
import AdminUsersPage from './pages/admin/AdminUsersPage/AdminUsersPage'
import AdminLogsPage from './pages/admin/AdminLogPage/AdminLogsPage'
import AdminProblemListPage from './pages/admin/AdminProblemListPage/AdminProblemListPage'
import AdminProblemEditPage from './pages/admin/AdminProblemEditPage/AdminProblemEditPage'
import { AlertProvider } from './context/AlertContext/AlertContext'
import ProblemPage from './pages/default/ProblemPage/ProblemPage'
import SubmissionsPage from './pages/default/SubmissionsPage/SubmissionsPage'
import SubmissionPage from './pages/default/SubmissionPage/SubmissionPage'
import AdminSystemConfig from './pages/admin/AdminSystemConfig/AdminSystemConfig'
import NewForumPost from './pages/user/NewForumPost/NewForumPost'
import PostPage from './pages/default/PostPage/PostPage'
import AdminContestListPage from './pages/admin/AdminContestListPage/AdminContestListPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AlertProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ <PageContainer> <HomePage /> </PageContainer> } />
            <Route path={'/contests'} element={ <PageContainer> <ContestPage /> </PageContainer> } />
            <Route path={'/forum'} element={ <PageContainer> <ForumPage /> </PageContainer> } />
            <Route path={'/problems'} element={ <PageContainer> <ProblemsPage /> </PageContainer> } />
            <Route path={'/rating'} element={ <PageContainer> <RatingPage /> </PageContainer> } />
            <Route path={'/problem/:id'} element={ <PageContainer> <ProblemPage /> </PageContainer> } />

            <Route element={ <ProtectedRoute roles={[AuthRole.DEFAULT]}/> }>
                <Route path={'/sign-in'} element={ <PageContainer> <SignInPage /> </PageContainer> } />
                <Route path={'/sign-up'} element={ <PageContainer> <SignUpPage /> </PageContainer> } />
            </Route>
            <Route path={'/logout'} element={ <PageContainer> <LogoutPage /> </PageContainer> } />
            <Route path={'/verify-account'} element={ <PageContainer> <VerifyAccountPage /> </PageContainer> } />
            
            <Route path={'/user/:username'} element={ <PageContainer> <UserPage /> </PageContainer> } />

            <Route path={'/submissions'} element={ <PageContainer> <SubmissionsPage /> </PageContainer> } />
            <Route path={'/submission/:id'} element={ <PageContainer> <SubmissionPage /> </PageContainer> } />
            
            <Route element={ <ProtectedRoute roles={[AuthRole.USER, AuthRole.MODERATOR, AuthRole.ADMIN]} />}>
                <Route path={'/settings/profile'} element={ <PageContainer> <EditUserPage /> </PageContainer> } />
                <Route path={'/forum/new-post'} element={ <PageContainer> <NewForumPost /> </PageContainer> } />
                <Route path={'/forum/:id'} element={ <PageContainer> <PostPage /> </PageContainer> } />
            </Route>

            <Route element={ <ProtectedRoute roles={[AuthRole.ADMIN]}/> }>
                <Route path={'/admin'} element={ <PageContainer> <AdminContainer/> </PageContainer> } />
                <Route path={'/admin/logs'} element={ <PageContainer> <AdminContainer> <AdminLogsPage /> </AdminContainer> </PageContainer> } />
                <Route path={'/admin/system-config'} element={ <PageContainer> <AdminContainer> <AdminSystemConfig /> </AdminContainer> </PageContainer> } />
                <Route path={'/admin/users'} element={ <PageContainer> <AdminContainer> <AdminUsersPage /> </AdminContainer> </PageContainer> } />
                <Route path={'/admin/problems'} element={ <PageContainer> <AdminContainer> <AdminProblemListPage /> </AdminContainer> </PageContainer> } />
                <Route path={'/admin/problems/edit/:id'} element={ <PageContainer> <AdminContainer> <AdminProblemEditPage /> </AdminContainer> </PageContainer> } />
                <Route path={'/admin/contests'} element={ <PageContainer> <AdminContainer> <AdminContestListPage /> </AdminContainer> </PageContainer> } />
            </Route>
            <Route path="*" element={ <PageContainer> <NotFoundPage /> </PageContainer>} />
          </Routes>
        </BrowserRouter>
      </AlertProvider>
    </AuthProvider>
  </StrictMode>,
)
