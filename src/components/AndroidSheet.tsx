import React from "react";
import {
  IonModal,
  IonIcon,
  IonText,
  IonButton,
} from "@ionic/react";
import { Capacitor } from "@capacitor/core";
import {useNfc} from "../functions/MyFunctions"; 
import { radioOutline, checkmarkDoneCircleOutline, alertCircleOutline } from "ionicons/icons";
import "../css/Modal.css";

const Modal: React.FC = () => {
  const { stopEmulation, started, scanCompleted, scanError } = useNfc();
  const isAndroid = Capacitor.getPlatform() === "android";

  return (
    <IonModal
      isOpen={isAndroid && started}
      onDidDismiss={stopEmulation}
      className="bottom-sheet-modal"
      backdropDismiss={true}
    >
      <div className="modal-content">
        <div className="icon-container">
          <IonIcon
            icon={scanError ? alertCircleOutline : scanCompleted ? checkmarkDoneCircleOutline : radioOutline}
            color={scanError ? "danger" : scanCompleted ? "success" : "primary"}
            className={`status-icon ${scanCompleted || scanError ? "scale-up" : "pulse"}`}
          />
        </div>

        <div className="text-container">
          <IonText color={scanError ? "danger" : scanCompleted ? "success" : "medium"}>
            <h1 className="title">
              {scanError ? 'Notikusi kļūda.!' : scanCompleted ? 'Success!' : 'Ready to Scan'}
            </h1>
          </IonText>
          <IonText color="medium">
            <p className="description">
              {scanError 
                ? 'Notikusi kļūda. Lūdzu mēģiniet vēlreiz!'
                : scanCompleted 
                ? 'Apstiprināts!'
                : 'Novietojiet ierīci virs NFC lasītāja.'}
            </p>
          </IonText>
        </div>

        <IonButton
          expand="block"
          fill="outline"
          color="medium"
          onClick={stopEmulation}
          className="cancel-button"
        >
          Cancel
        </IonButton>
      </div>
    </IonModal>
  );
};

export default Modal;