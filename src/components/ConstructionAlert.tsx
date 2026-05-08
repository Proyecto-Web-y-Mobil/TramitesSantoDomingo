import React, { useState } from 'react';
import { IonAlert } from '@ionic/react';

interface Props {
  children: React.ReactNode;
  header?: string;
  message?: string;
}

const ConstructionAlert: React.FC<Props> = ({ 
  children, 
  header = "🚧 En construcción", 
  message = "Esta funcionalidad estará disponible próximamente." 
}) => {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <>
      <div onClick={() => setShowAlert(true)} style={{ cursor: 'pointer', height: '100%', width: '100%' }}>
        {children}
      </div>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={header}
        message={message}
        buttons={['Aceptar']}
      />
    </>
  );
};

export default ConstructionAlert;