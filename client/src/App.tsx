import {FC} from 'react';
import './App.css';
import SpeechToText from './SpeechToText';

const App: FC = () => {
  return (
    <div className="App">
      <SpeechToText />
    </div>
  );
};

export default App;
