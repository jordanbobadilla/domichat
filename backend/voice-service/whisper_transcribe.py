# backend/voice-service/whisper_transcribe.py
import whisper
from pydub import AudioSegment

model = whisper.load_model("base")

def transcribe_audio(audio_path: str) -> str:
    # Convertir a WAV compatible si no lo es
    if not audio_path.endswith(".wav"):
        sound = AudioSegment.from_file(audio_path)
        audio_path = audio_path.replace(".mp3", ".wav")
        sound.export(audio_path, format="wav")

    result = model.transcribe(audio_path, language="es")
    return result["text"]
