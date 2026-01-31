import whisper

try:
    model = whisper.load_model("base")
    result = model.transcribe('./audio/test.wav',language="fr")
    print (result['text'])
except Exception as e :
    print(f"Erreur lors de la trancription : {e}")
