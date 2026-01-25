import { useAuth } from "@/contexts/auth/useAuth.js"
import { register } from "@/lib/authActions.js"
import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"

function Register() {
  const [userData, setUserData] = useState({ name: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const { user, userLogin } = useAuth()
  const navigate = useNavigate()

  if (user) {
    return <Navigate to="/dashboard" />
  }

  async function handleRegister(e) {
    e.preventDefault()

    setLoading(true)
    try {
      const data = await register(userData.name, userData.email, userData.password)
      if (!data) {
        throw new Error("Unable to register")
      }
      userLogin(data)
      navigate("/dashboard")
    } catch (error) {
      console.log("Error while registering", error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div>
      <form onSubmit={handleRegister}>
        <input placeholder="Name" type="text" value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} required />
        <input placeholder="Email" type="email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} required />
        <input placeholder="Password" type="password" value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} required />
        <button type="submit">{loading ? "Submitting..." : "Submit"}</button>
      </form>
    </div>
  )
}

export default Register