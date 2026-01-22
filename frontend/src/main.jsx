import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Loading from './components/Loading'
import AuthProvider from './contexts/auth/AuthProvider.jsx'
import ProtectedRoute from './routes/ProtectedRoute'
import Error from './pages/Error'

const Home = lazy(() => import("./pages/Home.jsx"))
const Login = lazy(() => import("./pages/Login.jsx"))
const Register = lazy(() => import("./pages/Register.jsx"))
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"))

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      { path: "/", element: <Suspense fallback={<Loading />}><Home /></Suspense> },
      { path: "/login", element: <Suspense fallback={<Loading />}><Login /></Suspense> },
      { path: "/register", element: <Suspense fallback={<Loading />}><Register /></Suspense> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/dashboard", element: <Suspense fallback={<Loading />}><Dashboard /></Suspense> }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
)
