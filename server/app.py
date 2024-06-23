from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import speech_recognition as sr

app = Flask(__name__)
app.config['SECRET_KEY'] = 'darwin nunez'
CORS(app,resources={r"/*":{"origins":"*"}})
io = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return render_template('index.html')

@io.on('connect')
def handle_connect():
    print('Client connected')

@io.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@io.on('audio')
def handle_audio(data):
    recognizer = sr.Recognizer()
    audio_data = sr.AudioData(data, 16000, 2)
    try:
        text = recognizer.recognize_google(audio_data)
        emit('transcription', {'text': text})
    except sr.UnknownValueError:
        emit('transcription', {'text': 'Could not understand audio'})
    except sr.RequestError:
        emit('transcription', {'text': 'Could not request results; check your network connection'})

if __name__ == '__main__':
    io.run(app, debug=True, port=5001, allow_unsafe_werkzeug=True)
