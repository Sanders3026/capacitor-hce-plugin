import React, { useEffect, useState } from 'react';
import { useNfc } from '../functions/MyFunctions';
import "../css/style.css';"
export const NfcScreen: React.FC = () => {
  const { started, scanError } = useNfc();
  const [showOverlay, setShowOverlay] = useState(started);

  useEffect(() => {
    if (started) {
      setShowOverlay(true);
    } else {
      const timer = setTimeout(() => {
        setShowOverlay(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [started]);

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