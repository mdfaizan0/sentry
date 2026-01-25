import { useAuth } from "@/contexts/auth/useAuth"
import { login } from "@/lib/authActions"
import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"

function Login() {
  const [userData, setUserData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const { user, userLogin } = useAuth()
  const navigate = useNavigate()

  if (user) {
    return <Navigate to="/dashboard" />
  }

  async function handleLogin(e) {
    e.preventDefault()

    setLoading(true)
    try {
      const data = await login(userData.email, userData.password)
      if (!data) {
        throw new Error("Unable to login")
      }
      userLogin(data)
      navigate("/dashboard")
    } catch (error) {
      console.log("Error while logging in", error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="font-sans">
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
        <input type="password" placeholder="Password" value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login