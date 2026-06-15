import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, 
  IonCardContent, IonButton, IonIcon, IonList, IonItem, IonLabel
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowForwardOutline, arrowBackOutline, documentTextOutline, medicalOutline, carOutline, alertCircleOutline } from 'ionicons/icons';
import HeaderBanner from '../components/HeaderBanner';
import FooterBanner from '../components/FooterBanner';

export default function LicenciaInfo() {
  const history = useHistory();
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const sessionData = localStorage.getItem('user_session');
    if (sessionData) {
      const userObj = JSON.parse(sessionData);
      setUsuario(Array.isArray(userObj) ? userObj[0] : userObj);
    }
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen style={{ '--background': '#f5f5f5' }}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          
          <HeaderBanner 
            title="Dirección de Tránsito"
            backgroundImage="/assets/headerTramites.png" 
            buttonText="Volver"
            buttonRoute="/tramites-presenciales" 
            showSecondaryButton={false} 
          />

          <main style={{ flex: 1, padding: '20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <IonButton fill="clear" onClick={() => history.goBack()} style={{ marginBottom: '10px' }}>
              <IonIcon slot="start" icon={arrowBackOutline} /> Volver
            </IonButton>

            <IonCard style={{ borderRadius: '8px', marginBottom: '20px' }}>
              <IonCardHeader style={{ backgroundColor: '#1b3a6b', color: 'white' }}>
                <IonCardTitle style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>Primera Obtención - Licencia Clase B</IonCardTitle>
                <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Agendamiento para examen presencial</p>
              </IonCardHeader>

              <IonCardContent style={{ padding: '20px', fontSize: '1.1rem', color: '#333' }}>
                <p style={{ marginBottom: '20px' }}>
                  Este agendamiento es exclusivo para rendir los exámenes correspondientes a la obtención de su primera licencia de conducir Clase B (vehículos motorizados de tres o cuatro ruedas para transporte particular).
                </p>

                <div style={{ backgroundColor: '#e2f3f5', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #17a2b8', marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#0c5460', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <IonIcon icon={alertCircleOutline} /> Importante
                  </h4>
                  <p style={{ margin: 0, color: '#0c5460', fontSize: '0.95rem' }}>
                    El día de su cita debe presentarse con 15 minutos de anticipación. El no cumplimiento de los requisitos documentales significará la cancelación de la hora.
                  </p>
                </div>

                <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', color: '#1b3a6b' }}>Requisitos a presentar el día de la cita:</h3>
                <IonList lines="none" style={{ backgroundColor: 'transparent' }}>
                  <IonItem style={{ '--background': 'transparent' }}>
                    <IonIcon icon={documentTextOutline} slot="start" color="primary" />
                    <IonLabel className="ion-text-wrap">Cédula de Identidad vigente y certificado de residencia en la comuna.</IonLabel>
                  </IonItem>
                  <IonItem style={{ '--background': 'transparent' }}>
                    <IonIcon icon={documentTextOutline} slot="start" color="primary" />
                    <IonLabel className="ion-text-wrap">Certificado de estudios (Mínimo 8º básico rendido).</IonLabel>
                  </IonItem>
                  <IonItem style={{ '--background': 'transparent' }}>
                    <IonIcon icon={medicalOutline} slot="start" color="primary" />
                    <IonLabel className="ion-text-wrap">Aprobar examen médico (Psicométrico y sensométrico) en el municipio.</IonLabel>
                  </IonItem>
                  <IonItem style={{ '--background': 'transparent' }}>
                    <IonIcon icon={carOutline} slot="start" color="primary" />
                    <IonLabel className="ion-text-wrap">Aprobar examen teórico y práctico (debe traer vehículo con documentación al día).</IonLabel>
                  </IonItem>
                </IonList>

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                  {usuario && usuario.id_rol === 1 ? (
                    <IonButton color="warning" size="large" expand="block" disabled>
                      Debes validar tu residencia para agendar
                    </IonButton>
                  ) : (
                    <IonButton 
                      color="primary" 
                      size="large" 
                      expand="block"
                      onClick={() => history.push('/tramites-presenciales/licencia-b/agendar')}
                    >
                      Continuar al Agendamiento <IonIcon slot="end" icon={arrowForwardOutline} />
                    </IonButton>
                  )}
                </div>

              </IonCardContent>
            </IonCard>
          </main>
          <FooterBanner />
        </div>
      </IonContent>
    </IonPage>
  );
}