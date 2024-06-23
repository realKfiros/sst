import {FC, useEffect, useRef, useState} from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5001', {
    transports: ["websocket"],
});

const SpeechToText: FC = () => {
  const [transcription, setTranscription] = useState<string>('');
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('transcription', (data: { text: string }) => {
      setTranscription(data.text);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.off('connect');
      socket.off('transcription');
      socket.off('disconnect');
    };
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        event.data.arrayBuffer().then((buffer) => {
          socket.emit('audio', buffer);
        });
      }
    };
    mediaRecorder.current.start(1000); // Send data every second
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
  };

  return (
    <div>
      <h1>Speech to Text</h1>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <p>{transcription}</p>
    </div>
  );
};

export default SpeechToText;
