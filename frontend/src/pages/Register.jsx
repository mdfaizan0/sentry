import { useState } from "react"
import { Navigate, useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"
import { Mail, Lock, User, ArrowRight, Sun, Moon } from "lucide-react"
import { useAuth } from "../contexts/auth/useAuth"
import { register } from "../lib/authActions"
import { useTheme } from "../contexts/theme/useTheme"
import { motion } from "framer-motion"

function Register() {
  const [userData, setUserData] = useState({ name: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const { user, userLogin } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  if (user) {
    return <Navigate to="/dashboard" />
  }

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await register(userData.name, userData.email, userData.password)
      if (!data) throw new Error("Unable to create account")
      userLogin(data)
      toast.success("Account created successfully!")
      navigate("/dashboard")
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }

  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-6 font-sans">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="w-12 h-12 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" className="text-primary" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/80" />
              </svg>
            </div>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Join the Sentry</h1>
          <p className="text-muted-foreground mt-2">Start your journey into bug-free production</p>
        </div>

        <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={toggleTheme} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-foreground transition-colors">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80 ml-1" htmlFor="name">Full Name</label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors">
                  <User size={18} />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80 ml-1" htmlFor="email">Email Address</label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80 ml-1" htmlFor="password">Password</label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                  value={userData.password}
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">Already have an account?</span>{" "}
            <Link to="/login" className="font-bold text-primary hover:underline decoration-2 underline-offset-4 transition-all">
              Log in instead
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground uppercase tracking-widest font-semibold opacity-50">
          © 2026 Sentry Security
        </p>
      </motion.div>
    </div>
  )
}

export default Register
