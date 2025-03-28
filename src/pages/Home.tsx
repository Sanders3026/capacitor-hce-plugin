import React from 'react';
import { IonButton } from '@ionic/react';
import { useNfc } from '../functions/MyFunctions';
import Modal from '../components/AndroidSheet';
import { NfcScreen } from '../components/NfcTagView';



const Home: React.FC = () => {
  const { startEmulation } = useNfc(); // Pass ref to useNfc

  return (
    <div>
      <NfcScreen />
      <IonButton
        expand="block"
        onClick={startEmulation}
        aria-label="Start NFC Emulation"
        style={{ marginTop: '2rem' }}
      >
        Start Emulation
      </IonButton>
      <Modal />
    </div>
  );
};

export default Home;