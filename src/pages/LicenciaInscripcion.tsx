import React, { useState } from 'react';
import {
  IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, 
  IonCardContent, IonButton, IonIcon, IonItem, IonLabel, IonSelect, IonSelectOption, IonDatetime, useIonToast, IonSpinner
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, calendarOutline, checkmarkCircleOutline } from 'ionicons/icons';
import HeaderBanner from '../components/HeaderBanner';
import FooterBanner from '../components/FooterBanner';

export default function LicenciaInscripcion() {
  const history = useHistory();
  const [presentToast] = useIonToast();
  
  const [cargando, setCargando] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('');
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>('');
  
  // Limitar la selección a días futuros (desde mañana)
  const fechaMinima = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const confirmarReserva = async () => {
    if (!fechaSeleccionada || !horaSeleccionada) {
      presentToast({ message: 'Debe seleccionar una fecha y un horario.', duration: 3000, color: 'warning' });
      return;
    }

    setCargando(true);
    
    try {
      const sessionData = localStorage.getItem('user_session');
      const userObj = sessionData ? JSON.parse(sessionData) : null;
      const usuario = Array.isArray(userObj) ? userObj[0] : userObj;

      if (!usuario) {
        throw new Error('Debe iniciar sesión para agendar una hora.');
      }

      // PAYLOAD ACTUALIZADO: Solo enviamos lo que el backend usará para tu tabla
      const payload = {
        usuario_id: usuario.id,
        fecha_cita: fechaSeleccionada.split('T')[0], // Aseguramos que solo envíe YYYY-MM-DD
        hora_cita: horaSeleccionada
      };

      const response = await fetch('http://localhost:3000/api/agendamientos/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.ok) {
        presentToast({ message: '¡Hora reservada con éxito! Revise su correo.', duration: 4000, color: 'success' });
        history.push('/tramites-presenciales');
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      presentToast({ message: error.message || 'Error al conectar con el servidor', duration: 4000, color: 'danger' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen style={{ '--background': '#f5f5f5' }}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          
          <HeaderBanner 
            title="Agendar Hora"
            backgroundImage="/assets/headerTramites.png" 
            buttonText="Volver"
            buttonRoute="/tramites-presenciales/licencia-b/info" 
            showSecondaryButton={false} 
          />

          <main style={{ flex: 1, padding: '20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <IonButton fill="clear" onClick={() => history.goBack()} style={{ marginBottom: '10px' }}>
              <IonIcon slot="start" icon={arrowBackOutline} /> Volver
            </IonButton>

            <IonCard style={{ borderRadius: '8px' }}>
              <IonCardHeader style={{ backgroundColor: '#1b3a6b', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <IonIcon icon={calendarOutline} style={{ fontSize: '2rem' }} />
                  <div>
                    <IonCardTitle style={{ color: 'white', fontSize: '1.4rem' }}>Selección de Fecha y Hora</IonCardTitle>
                    <p style={{ margin: 0, opacity: 0.9 }}>Licencia de Conducir Clase B</p>
                  </div>
                </div>
              </IonCardHeader>

              <IonCardContent style={{ padding: '20px' }}>
                <p style={{ marginBottom: '20px', color: '#555' }}>
                  Seleccione el día y el bloque horario en el que desea presentarse a rendir sus exámenes.
                </p>

                <IonItem lines="full" style={{ marginBottom: '15px' }}>
                  <IonLabel position="stacked" style={{ fontWeight: 'bold' }}>Fecha de la cita *</IonLabel>
                  <IonDatetime 
                    presentation="date" 
                    min={fechaMinima}
                    value={fechaSeleccionada}
                    onIonChange={e => setFechaSeleccionada(e.detail.value as string)}
                    style={{ marginTop: '10px' }}
                  />
                </IonItem>

                <IonItem lines="full" style={{ marginBottom: '30px' }}>
                  <IonLabel position="stacked" style={{ fontWeight: 'bold' }}>Bloque Horario *</IonLabel>
                  <IonSelect 
                    placeholder="Seleccione un horario" 
                    value={horaSeleccionada} 
                    onIonChange={e => setHoraSeleccionada(e.detail.value)}
                  >
                    <IonSelectOption value="09:00">09:00 - 10:00 hrs</IonSelectOption>
                    <IonSelectOption value="10:00">10:00 - 11:00 hrs</IonSelectOption>
                    <IonSelectOption value="11:30">11:30 - 12:30 hrs</IonSelectOption>
                    <IonSelectOption value="14:00">14:00 - 15:00 hrs</IonSelectOption>
                    <IonSelectOption value="15:30">15:30 - 16:30 hrs</IonSelectOption>
                  </IonSelect>
                </IonItem>

                <IonButton 
                  color="success" 
                  expand="block" 
                  size="large"
                  onClick={confirmarReserva}
                  disabled={cargando}
                >
                  {cargando ? <IonSpinner name="crescent" /> : <><IonIcon slot="start" icon={checkmarkCircleOutline} /> Confirmar Reserva</>}
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