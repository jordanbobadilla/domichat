# backend/voice-service/generate_voice.py
def generate_dominican_voice(text: str, accent: str) -> str:
    # TODO: integrar Tortoise TTS aquí
    dummy_output = "dummy_audio.wav"
    with open(dummy_output, "wb") as f:
        f.write(b"\x00\x00")  # WAV vacío de prueba
    return dummy_output
