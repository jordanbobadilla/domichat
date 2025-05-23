# backend/voice-service/app.py
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import FileResponse
from whisper_transcribe import transcribe_audio
from generate_voice import generate_dominican_voice
import os

app = FastAPI()

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    contents = await file.read()
    with open("temp_audio.mp3", "wb") as f:
        f.write(contents)
    text = transcribe_audio("temp_audio.mp3")
    return {"text": text}

@app.post("/speak")
async def speak(text: str = Form(...), accent: str = Form(...)):
    output_path = generate_dominican_voice(text, accent)
    return FileResponse(output_path, media_type="audio/wav", filename="response.wav")
