import type { AppProps } from "next/app"
import { ThemeProvider } from "../context/ThemeContext"
import "../styles/globals.css"
import Sidebar from "@/components/Sidebar"
import { useEffect, useState } from "react"
import { IoMenuOutline } from "react-icons/io5"

export default function MyApp({ Component, pageProps }: AppProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setSidebarOpen(true)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => setSidebarOpen((o) => !o)

  return (
    <ThemeProvider>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <button
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          background: "none",
          border: "none",
          color: "inherit",
          fontSize: 28,
          zIndex: 1100,
          display: isMobile ? "block" : "none",
        }}
      >
        <IoMenuOutline />
      </button>
      <div
        style={{
          marginLeft: isMobile ? 0 : 220,
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  )
}
