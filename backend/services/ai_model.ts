import axios from "axios"
import dotenv from "dotenv"

// Inicializar configuración
dotenv.config()

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function obtenerRespuestaIA(mensaje: string): Promise<string> {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: mensaje }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    const respuesta = response.data.choices[0].message.content
    return respuesta
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.error("Error al obtener respuesta de OpenAI:", error.message)
      return "Problemas cargando el OpenAI API Key. Revisa que todo este correctamente."
    } else if (error.response?.status === 429) {
      console.error("Error al obtener respuesta de OpenAI:", error.message)
      return "Estás haciendo demasiadas solicitudes. Intenta de nuevo en unos minutos."
    } else {
      console.error("Error al obtener respuesta de OpenAI:", error.message)
      return "Ocurrió un error al procesar tu mensaje."
    }
  }
}
