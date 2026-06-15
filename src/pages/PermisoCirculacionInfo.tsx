import React from 'react';
import { 
  IonPage, 
  IonContent, 
  IonButton, 
  IonCard, 
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon
} from "@ionic/react";
import { useHistory } from 'react-router-dom';
import { documentTextOutline, timeOutline, cashOutline, alertCircleOutline } from 'ionicons/icons';
import FooterBanner from '../components/FooterBanner';
import HeaderBanner from '../components/HeaderBanner';

export default function PermisoCirculacionInfo() {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
          
          <HeaderBanner 
            title="Información del Trámite"
            backgroundImage="/assets/headerTramites.png"
            buttonText="Volver"
            buttonRoute="/tramites-user"
            showSecondaryButton={false} 
          />

          <main style={{ flex: 1, padding: '20px', display: 'flex', justifyContent: 'center' }}>
            <IonCard style={{ maxWidth: '800px', width: '100%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <IonCardHeader style={{ backgroundColor: '#1b3a6b', color: 'white' }}>
                <IonCardTitle style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  Renovación Permiso de Circulación
                </IonCardTitle>
              </IonCardHeader>

              <IonCardContent style={{ padding: '20px', fontSize: '1.1rem', color: '#333' }}>
                <p style={{ marginBottom: '20px' }}>
                  Este trámite permite a los propietarios de vehículos motorizados renovar su permiso de circulación anual en la Municipalidad, requisito obligatorio para transitar por las calles del país.
                </p>

                <h3 style={{ color: '#1b3a6b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IonIcon icon={documentTextOutline} /> Requisitos Obligatorios
                </h3>
                <ul style={{ lineHeight: '1.8', marginBottom: '20px' }}>
                  <li>Permiso de circulación anterior pagado en la municipalidad.</li>
                  <li><strong>Certificado de revisión técnica</strong> y de gases vigente (Deberá adjuntar una copia en el siguiente paso).</li>
                  <li>Seguro Obligatorio de Accidentes Personales (SOAP) vigente.</li>
                  <li>No registrar multas de tránsito impagas.</li>
                </ul>

                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
                  <div style={{ flex: 1, minWidth: '200px', backgroundColor: '#e9ecef', padding: '15px', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#1b3a6b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <IonIcon icon={timeOutline} /> Duración
                    </h4>
                    <p style={{ margin: 0 }}>Aprobación inmediata tras la validación de los documentos (aprox. 48 horas hábiles).</p>
                  </div>
                  <div style={{ flex: 1, minWidth: '200px', backgroundColor: '#e9ecef', padding: '15px', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#1b3a6b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <IonIcon icon={cashOutline} /> Valor Estimado
                    </h4>
                    <p style={{ margin: 0 }}>Depende de la tasación oficial del vehículo según el SII para el año en curso.</p>
                  </div>
                </div>

                <div style={{ backgroundColor: '#fff3cd', borderLeft: '4px solid #ffc107', padding: '15px', marginBottom: '30px', color: '#856404' }}>
                  <IonIcon icon={alertCircleOutline} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                  <strong>Importante:</strong> Tenga a mano el PDF o fotografía clara de su Revisión Técnica antes de comenzar.
                </div>

                <IonButton 
                  expand="block" 
                  size="large"
                  onClick={() => history.push('/tramite/permiso-circulacion/formulario')}
                  style={{ '--background': '#28a745', fontWeight: 'bold', height: '55px' }}
                >
                  Comenzar Trámite
                </IonButton>
              </IonCardContent>
            </IonCard>
          </main>

          <FooterBanner />

        </div>
      </IonContent>
    </IonPage>
  );
}