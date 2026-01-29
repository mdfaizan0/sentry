import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Loading from './components/Loading'
import AuthProvider from './contexts/auth/AuthProvider.jsx'
import { ThemeProvider } from './contexts/theme/ThemeProvider.jsx'
import ProtectedRoute from './routes/ProtectedRoute'
import Error from './pages/Error'
import DashboardLayout from './layouts/DashboardLayout'

const Home = lazy(() => import("./pages/Home.jsx"))
const Login = lazy(() => import("./pages/Login.jsx"))
const Register = lazy(() => import("./pages/Register.jsx"))
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"))
const ProjectDetail = lazy(() => import("./pages/ProjectDetail.jsx"))
const TicketDetail = lazy(() => import("./pages/TicketDetail.jsx"))
const InviteHandler = lazy(() => import("./pages/InviteHandler.jsx"))

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      { path: "/", element: <Suspense fallback={<Loading />}><Home /></Suspense> },
      { path: "/login", element: <Suspense fallback={<Loading />}><Login /></Suspense> },
      { path: "/register", element: <Suspense fallback={<Loading />}><Register /></Suspense> },
      { path: "/invite/:action", element: <Suspense fallback={<Loading />}><InviteHandler /></Suspense> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: "/dashboard", element: <Suspense fallback={<Loading />}><Dashboard /></Suspense> },
              { path: "/project/:projectId", element: <Suspense fallback={<Loading />}><ProjectDetail /></Suspense> },
              { path: "/project/:projectId/ticket/:ticketId", element: <Suspense fallback={<Loading />}><TicketDetail /></Suspense> },
            ]
          }
        ]
      },
      { path: "*", element: <Error /> }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  </ThemeProvider>
)
