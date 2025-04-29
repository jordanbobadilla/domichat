# 🇩🇴 DomiChat

**DomiChat** es un Asistente de Inteligencia Artificial dominicano, diseñado para hablar como un dominicano, entender el dialecto local y apoyar a los ciudadanos en su vida diaria. Está disponible en Web, iOS y Android.

## 🎯 Funciones principales

- ✅ Responder preguntas frecuentes
- 🏛️ Asistir en servicios ciudadanos dominicanos
- 📚 Apoyar en la educación de estudiantes de RD
- ⚙️ Asistir a trabajadores técnicos, artísticos y más
- 💳 Funciona por suscripción mediante [Portal DOM](https://portal.do)

---

## 🧱 Arquitectura

- **Frontend Web**: Next.js
- **App Móvil**: React Native con Expo
- **Backend**: Node.js + Express
- **Base de datos**: PostgreSQL
- **IA**: OpenAI (fase inicial) + modelo propio fine-tuned
- **Pagos**: Portal DOM

---

## 🚀 Instalación local

```bash
# Clonar el proyecto
git clone https://github.com/jordanbobadilla/domichat.git
cd domichat

# Instalar dependencias del backend
cd backend
npm install

# Instalar app web
cd ../apps/web
npm install

# Instalar app móvil
cd ../mobile
npm install

# Volver a la raíz
cd ../../
```

---

## 📦 Estructura de carpetas

```bash
domichat/
├── apps/               # Web y mobile
├── backend/            # API y lógica de negocio
├── model_ai/           # Entrenamiento del modelo personalizado
├── shared/             # Tipos y constantes comunes
└── .env                # Variables secretas (nunca subir)
```

---

## ⚠️ Seguridad

- Este repositorio es privado.
- `.env` y otras credenciales están en `.gitignore`.
- Se recomienda usar 2FA en GitHub y Portal DOM.
- Protege la rama `main` con reglas de protección de rama.

---

## 📌 Créditos

Desarrollado por Jordan Bobadilla Rosario, en 🇩🇴 República Dominicana.
