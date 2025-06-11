import type { AppProps } from "next/app"
import { ThemeProvider } from "../context/ThemeContext"
import "../styles/globals.css"
import Sidebar from "@/components/Sidebar"

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Sidebar />
      <div style={{ marginLeft: 220 }}>
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  )
}
