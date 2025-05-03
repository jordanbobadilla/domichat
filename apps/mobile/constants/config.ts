// constants/config.ts

const ENV = "dev" // Cambia a 'prod' cuando publiques

const config = {
  dev: {
    BASE_URL: "http://10.0.0.10:4000/api", // tu IP local
  },
  prod: {
    BASE_URL: "https://tu-dominio.com/api", // o ngrok temporal
  },
}

export default config[ENV]
