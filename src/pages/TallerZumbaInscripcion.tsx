import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, 
  IonCardContent, IonButton, IonIcon, useIonToast, IonSpinner
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, saveOutline, fitnessOutline } from 'ionicons/icons';
import HeaderBanner from '../components/HeaderBanner';
import FooterBanner from '../components/FooterBanner';

export default function TallerZumbaInscripcion() {
  const history = useHistory();
  const [presentToast] = useIonToast();
  
  const [cargando, setCargando] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const sessionData = localStorage.getItem('user_session');
    if (sessionData) {
      const userObj = JSON.parse(sessionData);
      setUsuario(Array.isArray(userObj) ? userObj[0] : userObj);
    } else {
      history.push('/login');
    }
  }, [history]);

  const enviarInscripcion = async () => {
    setCargando(true);
    try {
      // El ID del taller en la tabla talleres_dideco es 1
      const payload = {
        usuario_id: usuario.id,
        taller_id: 1 
      };

      const response = await fetch('http://localhost:3000/api/dideco/inscripcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.ok) {
        presentToast({ message: '¡Inscripción confirmada exitosamente!', duration: 3000, color: 'success' });
        history.push('/talleres'); // Lo devolvemos al menú de talleres
      } else {
        throw new Error(data.error || 'Error al procesar la inscripción');
      }
    } catch (error: any) {
      presentToast({ message: error.message, duration: 4000, color: 'danger' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen style={{ '--background': '#f5f5f5' }}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          
          <HeaderBanner 
            title="Confirmar Inscripción"
            backgroundImage="/assets/headerTramites.png" 
            buttonText="Volver a Información"
            buttonRoute="/talleres/zumba" 
            showSecondaryButton={false} 
          />

          <main style={{ flex: 1, padding: '20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            
            <IonButton fill="clear" onClick={() => history.goBack()} style={{ marginBottom: '10px' }}>
              <IonIcon slot="start" icon={arrowBackOutline} /> Volver
            </IonButton>

            <IonCard style={{ borderRadius: '8px' }}>
              <IonCardHeader style={{ backgroundColor: '#1b3a6b', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <IonIcon icon={fitnessOutline} style={{ fontSize: '2rem' }} />
                  <div>
                    <IonCardTitle style={{ color: 'white', fontSize: '1.4rem' }}>Taller de Zumba Fit</IonCardTitle>
                    <p style={{ margin: 0, opacity: 0.9 }}>Reserva de Cupo</p>
                  </div>
                </div>
              </IonCardHeader>

              <IonCardContent style={{ padding: '20px' }}>
                
                {usuario && (
                  <div style={{ backgroundColor: '#e9ecef', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#333' }}>Tus datos de inscripción</h3>
                    <p style={{ margin: '5px 0', color: '#555' }}><strong>Nombre:</strong> {usuario.nombres} {usuario.apellido_p}</p>
                    <p style={{ margin: '5px 0', color: '#555' }}><strong>RUT:</strong> {usuario.rut}</p>
                    <p style={{ margin: '5px 0', color: '#555' }}><strong>Correo:</strong> {usuario.correo}</p>
                  </div>
                )}

                <div style={{ backgroundColor: '#e2f3f5', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #17a2b8', marginBottom: '30px' }}>
                  <p style={{ margin: 0, color: '#0c5460', fontSize: '0.95rem' }}>
                    Al confirmar, se reservará un cupo a tu nombre en la tabla de <strong>DIDECO</strong>. Recuerda asistir con ropa deportiva adecuada.
                  </p>
                </div>

                <IonButton 
                  color="success" 
                  expand="block" 
                  size="large"
                  onClick={enviarInscripcion}
                  disabled={cargando}
                >
                  {cargando ? <IonSpinner name="crescent" /> : <><IonIcon slot="start" icon={saveOutline} /> Tomar Cupo Ahora</>}
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