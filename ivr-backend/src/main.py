from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import whisper
import requests
import os
from pydub import AudioSegment
import noisereduce as nr
import soundfile as sf
import numpy as np

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# load Whisper
model = whisper.load_model("large")

def convert_to_wav(input_path: str, output_path: str):
    """convert audio in WAV."""
    audio = AudioSegment.from_file(input_path)
    audio.export(output_path, format="wav")

def reduce_noise(input_path: str, output_path: str):
    """apply nose reduction to a audio file."""
    audio_data, sample_rate = sf.read(input_path)
    
    reduced_audio = nr.reduce_noise(y=audio_data, sr=sample_rate)

    sf.write(output_path, reduced_audio, sample_rate)

@app.post("/process-audio/")
async def process_audio(file: UploadFile = File(...)):
    try:
        temp_path = f"./audio/{file.filename}"
        with open(temp_path, "wb") as audio_file:
            audio_file.write(await file.read())

        # Check file extension
        if temp_path.endswith(".wav"):
            wav_path = temp_path
        else:
            wav_path = temp_path.rsplit(".", 1)[0] + ".wav"
            convert_to_wav(temp_path, wav_path)

       
        denoised_path = wav_path

        transcription = model.transcribe(denoised_path, language="fr")["text"]

        #send transcription to  Rasa
        rasa_response = requests.post(
            "http://localhost:5005/webhooks/rest/webhook",  # Adresse Rasa
            json={"sender": "user", "message": transcription},
        ).json()

        return {"transcription": transcription, "action": rasa_response}
    except Exception as e:
        return {"error": str(e)}
    finally:
        for path in [temp_path, wav_path, denoised_path]:
            if os.path.exists(path):
                os.remove(path)
