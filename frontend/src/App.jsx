import { Outlet } from "react-router-dom"
import { Toaster } from "sonner"

function App() {
  return (
    <div className="font-sans min-h-screen bg-background">
      <Toaster position="top-center" richColors />
      <Outlet />
    </div>
  )
}

export default App