import { motion } from "framer-motion"
import { Shield, Zap, Target, Users, ArrowRight, CheckCircle2, BarChart3, Clock } from "lucide-react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Issue Tracking",
    description: "Catch and resolve bugs in real-time. Don't let issues slow down your deployment cycle."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Team Collaboration",
    description: "Assign tickets, leave comments, and track progress together with your entire squad."
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Project Management",
    description: "Organize your work into projects, set priorities, and keep your roadmap on track."
  }
]

const stats = [
  { label: "Issues Resolved", value: "2M+" },
  { label: "Active Users", value: "50k+" },
  { label: "Uptime", value: "99.9%" },
  { label: "Global Teams", value: "500+" }
]

function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-[-10%] w-[30%] h-[30%] bg-accent/20 blur-[100px] rounded-full" />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-8"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
            </svg>
            <span>A Modern Approach to Issue Tracking</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-8 text-balance"
          >
            Your Guardian Against <br />
            <span className="text-primary italic">Every Bug</span> That Exists
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
          >
            Sentry provides deep insights, real-time alerts, and seamless collaboration tools to help you ship flawless software faster than ever.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-bold shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 group"
            >
              Get Started for Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="#features"
              className="w-full sm:w-auto px-8 py-4 bg-background border border-border text-foreground rounded-full text-lg font-semibold hover:bg-muted transition-all"
            >
              View Demo
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6 border-y border-white/5 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Designed for Developers</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We've built Sentry from the ground up to be the most intuitive, fast, and powerful issue tracker you've ever used.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-colors group cursor-default shadow-sm hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-primary rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/30">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-primary-foreground mb-8 relative z-10">
              Ready to Secure <br /> Your Software?
            </h2>
            <p className="text-primary-foreground/80 text-lg lg:text-xl max-w-2xl mx-auto mb-12 relative z-10">
              Join thousands of teams who trust Sentry to manage their project lifecycle. Start your 14-day free trial today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
              <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-white text-primary rounded-full text-lg font-bold hover:shadow-xl transition-all">
                Sign Up Now
              </Link>
              <Link to="/about" className="text-primary-foreground font-bold hover:underline">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
                    <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
                    <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-foreground">Sentry</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Empowering developers to build better, faster, and more secure software through real-time observability.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div>
                <h4 className="font-bold mb-6">Product</h4>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li><Link to="#" className="hover:text-primary transition-colors">Integrations</Link></li>
                  <li><Link to="#" className="hover:text-primary transition-colors">Security</Link></li>
                  <li><Link to="#" className="hover:text-primary transition-colors">Changelog</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6">Company</h4>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li><Link to="#" className="hover:text-primary transition-colors">About Us</Link></li>
                  <li><Link to="#" className="hover:text-primary transition-colors">Careers</Link></li>
                  <li><Link to="#" className="hover:text-primary transition-colors">Privacy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium">
            <p>© 2026 Sentry Inc. All rights reserved.</p>
            <div className="flex gap-8">
              <Link to="#" className="hover:text-foreground">Twitter</Link>
              <Link to="#" className="hover:text-foreground">GitHub</Link>
              <Link to="#" className="hover:text-foreground">Discord</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
