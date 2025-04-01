import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { Capacitor } from "@capacitor/core";
import StartIosEmulation from "./IosEmulation";
import { HCECapacitorPlugin } from "..";

interface NfcContextType {
  datas: string;
  setDatas: (value: string) => void;
  started: boolean;
  scanCompleted: boolean;
  scanError: boolean;
  change: (e: CustomEvent) => void;
  startEmulation: () => Promise<void>;
  stopEmulation: () => Promise<void>;
}

const NfcContext = createContext<NfcContextType | undefined>(undefined);

export const NfcProvider = ({ children, initialValue }: { children: ReactNode; initialValue: string }) => {
  const [datas, setDatas] = useState<string>(initialValue);
  const [started, setStarted] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [scanError, setScanError] = useState(false);
  const datasRef = useRef<string>(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      console.log("Stopping NFC emulation due to inactivity.");
      showErrorScreen();
    }, 15000);
  };

  const showErrorScreen = () => {
    setScanError(true);
    setTimeout(() => [setScanError(false),stopEmulation()], 3000); 
    
  };

  useEffect(() => {
    if (Capacitor.getPlatform() === "ios") {
      let isNfcDataCompleteTriggered = false;
      
      HCECapacitorPlugin.addListener("nfcDataComplete", () => {
        setTimeout(() => setStarted(false), 3000);
        isNfcDataCompleteTriggered = true;
      });

      HCECapacitorPlugin.addListener("sessionInvalidated", () => {
        if (!isNfcDataCompleteTriggered) setStarted(false);
      });
    }
  }, []);

  const change = (e: CustomEvent) => {
    const newValue = e.detail.value || "";
    setDatas(newValue);
    datasRef.current = newValue;
  };

  const startEmulation = async () => {

    if (Capacitor.getPlatform() === "ios") {
      if (datasRef.current) {
        try {
          StartIosEmulation(datasRef.current);
          setStarted(true);
        } catch (error) {
          console.error("Error starting NFC emulation on iOS:", error);
          alert(`Failed to start NFC emulation on iOS: ${error}`);
        }
      } else {
        alert("Please enter data to emulate.");
      }
    } else if (Capacitor.getPlatform() === "android") {
      if (datasRef.current) {
        try {
          await HCECapacitorPlugin.startNfcHce({
            content: datasRef.current,
            persistMessage: false,
            mimeType: "text/plain",
          });
          setStarted(true);
          resetTimeout();
        } catch (error) {
          console.error("Error starting NFC emulation on Android:", error);
          alert(`Failed to start NFC emulation on Android: ${error}`);
        }
      }
    }
  };

  const stopEmulation = async () => {
    setStarted(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (HCECapacitorPlugin) {
      try {
        await HCECapacitorPlugin.stopNfcHce();
      } catch (error) {
        console.error("Error stopping NFC emulation:", error);
        alert("Failed to stop NFC emulation.");
      }
    }
  };

  useEffect(() => {
    if (Capacitor.getPlatform() === "android") {
      const listener = HCECapacitorPlugin.addListener("onStatusChanged", (status: any) => {
        console.log("NFC Status:", status.eventName);
        resetTimeout();

        if (status.eventName === "card-emulator-started") {
          setStarted(true);
        }
        if (status.eventName === "scan-completed") {
          setScanCompleted(true);
          setTimeout(() => setScanCompleted(false), 3000);
          setTimeout(() => setStarted(false), 2900);
        }
        if (status.eventName === "scan-error") {
          showErrorScreen();
          setScanCompleted(false);
        }
      });

      return () => {
        listener.remove();
      };
    }
  }, []);

  return (
    <NfcContext.Provider
      value={{
        datas,
        setDatas,
        started,
        scanCompleted,
        scanError,
        change,
        startEmulation,
        stopEmulation,
      }}
    >
      {children}
    </NfcContext.Provider>
  );
};

export const useNfc = () => {
  const context = useContext(NfcContext);
  if (!context) {
    throw new Error("useNfc must be used within an NfcProvider");
  }
  return context;
};