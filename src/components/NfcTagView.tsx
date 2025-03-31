import React, { useEffect, useState } from 'react';
import { useNfc } from '../functions/MyFunctions';
import "../css/style.css";

export const NfcScreen: React.FC = () => {
  const { started, scanCompleted, scanError } = useNfc();
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (started) {
      setShowOverlay(true);
    }
    if (!started) {
      setShowOverlay(false);
    }

    if (scanCompleted) {
      const timer = setTimeout(() => {
        setShowOverlay(false); 
      }, 2000);

      return () => {
        clearTimeout(timer); 
      };
    }

    return () => {
    };
  }, [scanCompleted, started]);

  return (
    showOverlay && !scanError && (
      <div className={`nfc-tag-overlay ${!started ? "slide-up" : ""}`}>
        <div className="nfc-tag">
          <img 
            src="icon_padding.png" 
            alt="NFC Tag" 
            style={{ width: '80%', height: '80%', objectFit: 'contain' }}
          />
        </div>
      </div>
    )
  );
};