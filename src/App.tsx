import { setupIonicReact } from '@ionic/react';
import Home from './pages/Home';
import { NfcProvider } from './functions/MyFunctions';
import { useRef } from 'react';

/* Core & Theme CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/display.css';
import './themes/variables.css';

setupIonicReact();
interface AppProps {
  data: string;
  IosAlertMessage: string;
}
const NfcEmulation: React.FC<AppProps> = ({ data,IosAlertMessage }) => {
  const paramRef = useRef<string>(data);

  return (
    <NfcProvider initialValue={paramRef.current} alertMessage={IosAlertMessage}>
      <Home/> 
    </NfcProvider>
  );
};

export default NfcEmulation;