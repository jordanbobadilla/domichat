import type { AppProps } from "next/app"
import { ThemeProvider } from "../context/ThemeContext"
import "../styles/globals.css"
import Sidebar from "@/components/Sidebar"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { IoMenuOutline } from "react-icons/io5"

export default function MyApp({ Component, pageProps }: AppProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [router.pathname])

  const toggleSidebar = () => setSidebarOpen((o) => !o)

  return (
    <ThemeProvider>
      {isLoggedIn && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      {isLoggedIn && (
        <button
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: 26,
            left: 16,
            background: "none",
            border: "none",
            color: "inherit",
            fontSize: 28,
            zIndex: 1100,
            display: isMobile ? "block" : "none",
            cursor: "pointer",
          }}
        >
          <IoMenuOutline color={sidebarOpen ? "#fff" : "#000"} />
        </button>
      )}
      <div
        style={{
          marginLeft: isLoggedIn && !isMobile ? 220 : 0,
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  )
}
