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
}
const NfcEmulation: React.FC<AppProps> = ({ data }) => {
  const paramRef = useRef<string>(data); // Create a ref

  return (
    <NfcProvider initialValue={paramRef.current}>
      <Home/> {/* Pass it to Home */}
    </NfcProvider>
  );
};

export default NfcEmulation;