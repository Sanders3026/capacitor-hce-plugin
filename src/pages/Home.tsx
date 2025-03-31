import React from 'react';
import { useNfc } from '../functions/MyFunctions';
import Modal from '../components/AndroidSheet';
import { NfcScreen } from '../components/NfcTagView';
import "../css/StartButton.css"


const Home: React.FC = () => {
  const { startEmulation } = useNfc(); 

  return (
    <div>
      <NfcScreen />
      <button className="start-button" onClick={startEmulation}>
        <img src="icon_padding.png" alt="Start"/>
      </button>
      <Modal />
    </div>
  );
};

export default Home;