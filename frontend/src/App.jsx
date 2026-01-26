import { Outlet } from "react-router-dom"
import { Toaster } from "sonner"

function App() {
  return (
    <div className="font-sans">
      <Toaster position="top-center" richColors />
      <Outlet />
    </div>
  )
}

export default App