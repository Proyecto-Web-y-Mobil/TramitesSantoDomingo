import React from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';

const FooterBanner: React.FC = () => {
  return (
    <div style={{ marginTop: 'auto', width: '100%' }}>
      <footer style={{ backgroundColor: '#0088d6', color: 'white', padding: '40px 20px' }}>
        <IonGrid>
          {/* Fila Superior: Dirección e Información de Copyright */}
          <IonRow style={{ alignItems: 'flex-start' }}>
            
            {/* Columna Izquierda: Dirección y Horarios */}
            <IonCol size="12" sizeMd="4" style={{ textAlign: 'left' }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '1.1rem' }}>
                Dirección: Avenida Santa Teresa N°1
              </p>
              <p style={{ margin: '0 0 5px 0' }}>Horario de atención:</p>
              <ul style={{ margin: 0, paddingLeft: '15px', listStyle: 'none', fontSize: '0.95rem', lineHeight: '1.6' }}>
                <li>• Lunes a Viernes: 08:45 am a 14:00 pm.</li>
                <li>• Sábado: 09:30 am a 13:30 pm</li>
              </ul>
            </IonCol>
            
            {/* Columna Central: Espacio vacío para equilibrar el diseño si es necesario */}
            <IonCol sizeMd="4" className="ion-hide-sm-down"></IonCol>

            {/* Columna Derecha: Copyright */}
            <IonCol size="12" sizeMd="4" style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '1.1rem' }}>
                Emergencias 24 horas:
              </p>
              <p style={{ margin: '0 0 5px 0' }}>+563 2236 1603 - +563 5222 4200</p>
              <p style={{ margin: '0 0 5px 0' }}>Seguridad: 1458</p>
              <p style={{ margin: '0' }}>contacto@santodomingo.cl</p>
            </IonCol>
          </IonRow>

          {/* Fila Inferior: Emergencias y Contacto (Centrado abajo) */}
          <IonRow style={{ marginTop: '20px' }}>
            <IonCol size="12" style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  Copyright © 2026 Municipalidad de Santo Domingo
                </p>
                <p style={{ margin: '0' }}>I. Municipalidad de Santo Domingo</p>
            </IonCol>
          </IonRow>
        </IonGrid>
      </footer>
    </div>
  );
};

export default FooterBanner;