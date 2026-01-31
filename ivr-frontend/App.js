import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech'; // Importer Expo Speech

export default function App() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [uri, setUri] = useState(null);
  const [transcription, setTranscription] = useState(null);
  const [responseText, setResponseText] = useState(null);

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Erreur', 'Permission d’accès au micro refusée');
        return;
      }

      setIsRecording(true);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        staysActiveInBackground: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
      });

      setRecording(newRecording);
    } catch (err) {
      console.error('Erreur lors de l’enregistrement :', err);
      Alert.alert('Erreur', 'Impossible de démarrer l’enregistrement.');
      setIsRecording(false);
    }
  }

  async function stopRecording() {
    try {
      if (recording) {
        setIsRecording(false);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setUri(uri);
        setRecording(null);
        await sendAudioToBackend(uri);
      }
    } catch (err) {
      console.error('Erreur lors de l’arrêt de l’enregistrement :', err);
      Alert.alert('Erreur', 'Impossible d’arrêter l’enregistrement.');
    }
  }

  async function sendAudioToBackend(uri) {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: 'audio.m4a',
        type: 'audio/m4a',
      });

      const response = await fetch('http://192.168.15.232:8000/process-audio/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur de communication avec le serveur');
      }

      const data = await response.json();
      setTranscription(data.transcription);
      setResponseText(data.action[0]?.text);
      speakText(data.action[0]?.text); 
    } catch (err) {
      console.error('Erreur lors de l’envoi de l’audio :', err);
      Alert.alert('Erreur', 'Échec de l’envoi de l’audio au backend.');
    }
  }

  function speakText(text) {
    if (text) {
      try {
        Speech.speak(text, {
          language: 'fr-FR',
          rate: 0.5, 
        });
      } catch (err) {
        console.error('Erreur lors de la synthèse vocale :', err);
        Alert.alert('Erreur', 'Impossible de lire le texte vocalement.');
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎙️ Enregistreur Audio</Text>
      <TouchableOpacity
        style={[styles.button, isRecording ? styles.recordingButton : null]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {isRecording ? 'Arrêter l’enregistrement' : 'Démarrer'}
        </Text>
      </TouchableOpacity>

      {uri && (
        <View style={styles.audioContainer}>
          <Text style={styles.audioText}>Audio enregistré avec succès 🎉</Text>
        </View>
      )}

      {transcription && (
        <View style={styles.transcriptionContainer}>
          <Text style={styles.transcriptionText}>Transcription :</Text>
          <Text style={styles.transcriptionText}>{transcription}</Text>
        </View>
      )}

      {responseText && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseText}>Texte reçu :</Text>
          <Text style={styles.responseText}>{responseText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#1DB954',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  recordingButton: {
    backgroundColor: '#D32F2F',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  audioContainer: {
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 15,
    padding: 20,
  },
  audioText: {
    fontSize: 16,
    color: '#B3B3B3',
  },
  transcriptionContainer: {
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: '#2e2e2e',
    borderRadius: 15,
    padding: 20,
  },
  transcriptionText: {
    color: '#fff',
    fontSize: 16,
  },
  responseContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 20,
  },
  responseText: {
    color: '#fff',
    fontSize: 16,
  },
});
