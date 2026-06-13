import React from 'react';
import {
  IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, 
  IonCardContent, IonButton, IonIcon, IonList, IonItem, IonLabel
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { calendarOutline, timeOutline, locationOutline, checkmarkCircleOutline, arrowForwardOutline, arrowBackOutline } from 'ionicons/icons';
import HeaderBanner from '../components/HeaderBanner';
import FooterBanner from '../components/FooterBanner';

export default function TallerZumbaInfo() {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent fullscreen style={{ '--background': '#f5f5f5' }}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          
          <HeaderBanner 
            title="Talleres DIDECO"
            backgroundImage="/assets/headerTramites.png" 
            buttonText="Volver a Talleres"
            buttonRoute="/talleres" 
            showSecondaryButton={false} 
          />

          <main style={{ flex: 1, padding: '20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            
            <IonButton fill="clear" onClick={() => history.goBack()} style={{ marginBottom: '10px' }}>
              <IonIcon slot="start" icon={arrowBackOutline} /> Volver
            </IonButton>

            <IonCard style={{ borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
              {/* Puedes reemplazar esta URL con la imagen real que usaste en tu menú */}
              <img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop" alt="Clase de Zumba" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
              
              <IonCardHeader style={{ backgroundColor: '#1b3a6b', color: 'white' }}>
                <IonCardTitle style={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>Taller de Zumba Fit</IonCardTitle>
                <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Departamento de Desarrollo Comunitario (DIDECO)</p>
              </IonCardHeader>

              <IonCardContent style={{ padding: '20px', fontSize: '1.1rem', color: '#333' }}>
                <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
                  Únete a nuestro taller de Zumba y mejora tu condición física mientras te diviertes al ritmo de la música. 
                  Nuestras clases están diseñadas para liberar estrés, quemar calorías y fomentar la vida sana en la comuna.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                    <IonIcon icon={calendarOutline} style={{ color: '#1b3a6b', fontSize: '1.5rem', marginBottom: '5px' }} />
                    <h4 style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Días</h4>
                    <p style={{ margin: 0 }}>Martes y Jueves</p>
                  </div>
                  <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                    <IonIcon icon={timeOutline} style={{ color: '#1b3a6b', fontSize: '1.5rem', marginBottom: '5px' }} />
                    <h4 style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Horario</h4>
                    <p style={{ margin: 0 }}>18:30 - 19:45 hrs</p>
                  </div>
                  <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                    <IonIcon icon={locationOutline} style={{ color: '#1b3a6b', fontSize: '1.5rem', marginBottom: '5px' }} />
                    <h4 style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Lugar</h4>
                    <p style={{ margin: 0 }}>Gimnasio Municipal</p>
                  </div>
                </div>

                <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginTop: '30px', color: '#1b3a6b' }}>Requisitos de Inscripción</h3>
                <IonList lines="none" style={{ backgroundColor: 'transparent' }}>
                  <IonItem style={{ '--background': 'transparent' }}>
                    <IonIcon icon={checkmarkCircleOutline} slot="start" color="success" />
                    <IonLabel className="ion-text-wrap">Ser mayor de 18 años y residente de la comuna.</IonLabel>
                  </IonItem>
                  <IonItem style={{ '--background': 'transparent' }}>
                    <IonIcon icon={checkmarkCircleOutline} slot="start" color="success" />
                    <IonLabel className="ion-text-wrap">Uso obligatorio de ropa deportiva y zapatillas adecuadas.</IonLabel>
                  </IonItem>
                  <IonItem style={{ '--background': 'transparent' }}>
                    <IonIcon icon={checkmarkCircleOutline} slot="start" color="success" />
                    <IonLabel className="ion-text-wrap">Salud compatible con actividad física aeróbica intensa.</IonLabel>
                  </IonItem>
                  <IonItem style={{ '--background': 'transparent' }}>
                    <IonIcon icon={checkmarkCircleOutline} slot="start" color="warning" />
                    <IonLabel className="ion-text-wrap" style={{ fontWeight: 'bold', color: '#856404' }}>Atención: Cupos limitados (Máximo 30 personas).</IonLabel>
                  </IonItem>
                </IonList>

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                  <IonButton 
                    color="primary" 
                    size="large" 
                    expand="block"
                    onClick={() => history.push('/talleres/zumba/inscripcion')}
                  >
                    Ir al Formulario de Inscripción <IonIcon slot="end" icon={arrowForwardOutline} />
                  </IonButton>
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