import { useState, useEffect } from "react"
import { Menu, X, Sun, Moon, User, LogOut, LayoutDashboard, Settings } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { useTheme } from "../contexts/theme/useTheme"
import { useAuth } from "../contexts/auth/useAuth"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import getInitials from "@/lib/getInitials"

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { theme, toggleTheme } = useTheme()
    const { user, userLogout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleLogout = async () => {
        userLogout()
        navigate("/login")
    }

    const publicLinks = [
        { name: "Features", href: "#features" },
        { name: "About", href: "#about" },
        { name: "Pricing", href: "#pricing" },
    ]

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "py-3 bg-background/80 backdrop-blur-md shadow-md border-b border-white/10"
                : "py-5 bg-transparent"
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" className="text-primary" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/80" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">Sentry</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-3">
                    {!user && publicLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-foreground hover:text-primary px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 no-underline"
                        >
                            {link.name}
                        </a>
                    ))}

                    <div className="flex items-center gap-3 ml-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-foreground"
                            aria-label="Toggle Theme"
                        >
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-primary/10 border border-primary/20 p-0 overflow-hidden">
                                        <div className="flex h-full w-full items-center justify-center text-primary font-bold">
                                            {getInitials(user.name) || <User size={20} />}
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link to="/dashboard" className="cursor-pointer w-full flex items-center">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-not-allowed opacity-50">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-foreground hover:text-primary px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 no-underline"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-6 py-2.5 bg-primary/20 backdrop-blur-md text-primary border border-primary/40 rounded-full text-sm font-bold hover:bg-primary/30 hover:border-primary/60 transition-all duration-300 shadow-lg shadow-primary/10 no-underline"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background/95 backdrop-blur-lg border-b border-white/10 overflow-hidden"
                    >
                        <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
                            {user ? (
                                <>
                                    <div className="px-2 py-3 border-b border-white/5">
                                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-lg font-medium text-foreground py-2 border-b border-white/5 flex items-center"
                                    >
                                        <LayoutDashboard className="mr-3 h-5 w-5" />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-lg font-medium text-destructive py-2 border-b border-white/5 flex items-center text-left"
                                    >
                                        <LogOut className="mr-3 h-5 w-5" />
                                        Log out
                                    </button>
                                </>
                            ) : (
                                <>
                                    {publicLinks.map((link) => (
                                        <a
                                            key={link.name}
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-lg font-medium text-foreground py-2 border-b border-white/5"
                                        >
                                            {link.name}
                                        </a>
                                    ))}
                                    <div className="flex flex-col gap-4 pt-4">
                                        <Link
                                            to="/login"
                                            className="text-center py-3 text-foreground font-medium border border-white/10 rounded-xl"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="text-center py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20"
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                </>
                            )}

                            {/* Theme Toggle for Mobile */}
                            <button
                                onClick={toggleTheme}
                                className="mt-4 w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-foreground flex items-center justify-center gap-2 font-medium"
                                aria-label="Toggle Theme"
                            >
                                {theme === "dark" ? (
                                    <>
                                        <Sun size={20} />
                                        <span>Light Mode</span>
                                    </>
                                ) : (
                                    <>
                                        <Moon size={20} />
                                        <span>Dark Mode</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navbar
