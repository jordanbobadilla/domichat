import whisper
model = whisper.load_model("base")
result = model.transcribe("tu_audio.mp3", language="es")
print(result["text"])
