# IVR – AI-Powered Interactive Voice Response System

## Context / Problem

Traditional Interactive Voice Response (IVR) systems rely on rigid menu structures and limited keyword recognition, leading to frustrating user experiences. This project addresses this limitation by building an intelligent, conversational IVR system that understands natural language queries in French, processes voice input in real-time, and provides contextual responses through an AI-powered conversational agent.

The system enables users to interact naturally with voice-based applications, improving accessibility and user experience for customer service, information retrieval, and automated assistance scenarios.

## Global Architecture

The project is split into two main components:

### Backend (FastAPI)
- Receives audio files from the mobile application
- Applies noise reduction for improved audio quality
- Transcribes speech to text using OpenAI's Whisper model
- Sends transcriptions to Rasa NLU for intent recognition
- Returns conversational responses from the Rasa chatbot

### Frontend (React Native)
- Mobile application for iOS and Android
- Records user voice input via microphone
- Sends audio files to the backend API
- Displays transcriptions and responses
- Converts text responses back to speech using Text-to-Speech (TTS)

**Data Flow:**
```
User Voice → Mobile App → Backend API → Whisper (STT) → Rasa (NLU) → Response → Mobile App → TTS
```

## Tech Stack

### Backend
- **Python 3.8+**
- **FastAPI** – Modern web framework for building APIs
- **Whisper (OpenAI)** – State-of-the-art speech-to-text model
- **Rasa** – Open-source conversational AI framework with CamemBERT for French NLU
- **noisereduce** – Audio noise reduction library
- **pydub** – Audio file format conversion
- **soundfile** – Audio file I/O operations

### Frontend
- **React Native** – Cross-platform mobile development
- **Expo** – React Native development platform
- **expo-av** – Audio recording functionality
- **expo-speech** – Text-to-speech synthesis

### AI/ML Components
- **Whisper Large Model** – Multilingual speech recognition
- **CamemBERT** – French language understanding (via Rasa)
- **Rasa NLU** – Intent classification and entity extraction

## Key Features

1. **Voice Recording** – Capture high-quality audio input from users via mobile device
2. **Noise Reduction** – Automatically clean audio to improve transcription accuracy
3. **Speech-to-Text (STT)** – Convert French voice input to text using Whisper
4. **Natural Language Understanding** – Process user intent using Rasa with CamemBERT
5. **Conversational AI** – Generate contextual responses based on user queries
6. **Text-to-Speech (TTS)** – Convert responses back to voice for audio playback
7. **Real-time Processing** – Seamless end-to-end voice interaction flow
8. **Cross-platform Support** – Works on both iOS and Android devices

## Installation & Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js and npm
- Expo CLI (`npm install -g expo-cli`)
- Rasa installed and configured
- FFmpeg (for audio processing)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/moussaballatogolaai-prog/ai-voice-ivr.git
   cd ivr-backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install fastapi uvicorn whisper noisereduce pydub soundfile numpy requests
   ```

4. **Create audio directory**
   ```bash
   mkdir audio
   ```

5. **Start Rasa server** (in a separate terminal)
   ```bash
   rasa run --enable-api --cors "*" --port 5005
   ```

6. **Launch the FastAPI backend**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ivr-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update backend URL**
   - Open `App.js`
   - Replace `http://192.168.15.232:8000` with your backend IP address

4. **Start the Expo development server**
   ```bash
   expo start
   ```

5. **Run on device/emulator**
   - Scan QR code with Expo Go app (iOS/Android)
   - Or press `a` for Android emulator, `i` for iOS simulator

### Testing the System

1. Ensure both backend and Rasa are running
2. Launch the mobile app
3. Press "Démarrer" to start recording
4. Speak in French (e.g., "Quelle est la météo aujourd'hui?")
5. Press "Arrêter l'enregistrement" to stop
6. View transcription and response
7. Listen to the AI response via TTS

## Limitations & Future Improvements

### Current Limitations
- **Single-turn conversations** – No conversation history or context retention
- **Language support** – Currently only supports French
- **Network dependency** – Requires stable internet connection for Whisper and Rasa
- **Local processing** – Backend runs locally, not suitable for production scale
- **No authentication** – Open API without user authentication
- **Limited error handling** – Basic error messages without detailed logging

### Planned Improvements

1. **Multi-turn Dialogue Management**
   - Implement conversation context tracking
   - Add session management for personalized interactions
   - Store conversation history in database

2. **Multilingual Support**
   - Add support for English, Arabic, and other languages
   - Implement automatic language detection

3. **Performance Optimization**
   - Cache Whisper model in memory
   - Implement asynchronous processing queue
   - Add response streaming for faster feedback

4. **Enhanced NLU**
   - Train custom Rasa models for domain-specific intents
   - Improve entity extraction accuracy
   - Add sentiment analysis

5. **Production Deployment**
   - Containerize with Docker
   - Deploy on cloud infrastructure (AWS/GCP/Azure)
   - Add load balancing and auto-scaling
   - Implement proper logging and monitoring

6. **Security & Privacy**
   - Add JWT authentication
   - Encrypt audio transmissions
   - Implement rate limiting
   - Add GDPR-compliant data handling

7. **User Experience**
   - Add voice activity detection (VAD) for automatic recording start/stop
   - Implement real-time transcription feedback
   - Add support for voice commands (wake words)
   - Improve TTS voice quality with custom models

8. **Analytics & Insights**
   - Track user interaction metrics
   - Analyze common intents and queries
   - Generate conversation analytics dashboard

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## License

This project is licensed under the MIT License.

---

**Built with ❤️ using FastAPI, Whisper, Rasa, and React Native**
