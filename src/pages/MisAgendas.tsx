import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonCard, IonCardContent, IonButton, IonIcon, 
  IonSpinner, useIonToast, IonBadge
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBackOutline, calendarOutline, timeOutline, trashOutline, locationOutline } from 'ionicons/icons';
import HeaderBanner from '../components/HeaderBanner';
import FooterBanner from '../components/FooterBanner';

export default function MisAgendas() {
  const history = useHistory();
  const [presentToast] = useIonToast();
  
  const [agendas, setAgendas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarAgendas();
  }, []);

  const cargarAgendas = async () => {
    setCargando(true);
    try {
      const sessionData = localStorage.getItem('user_session');
      if (!sessionData) {
        history.push('/login');
        return;
      }
      
      const userObj = JSON.parse(sessionData);
      const usuario = Array.isArray(userObj) ? userObj[0] : userObj;

      const response = await fetch(`https://tramitessantodomingo-production-5cb4.up.railway.app/api/agendas/usuario/${usuario.id}`);
      const data = await response.json();
      
      if (data.ok) {
        setAgendas(data.agendas);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      presentToast({ message: 'Error al cargar tus agendas', duration: 3000, color: 'danger' });
    } finally {
      setCargando(false);
    }
  };

  const cancelarAgenda = async (id: number, tipo: string, taller_id: number | null) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.');
    if (!confirmacion) return;

    try {
      const payload = { id, tipo, taller_id };

      const response = await fetch('https://tramitessantodomingo-production-5cb4.up.railway.app/api/agendas/cancelar', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.ok) {
        presentToast({ message: 'Reserva cancelada exitosamente.', duration: 3000, color: 'success' });
        // Recargar la lista para que desaparezca visualmente
        cargarAgendas();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      presentToast({ message: error.message || 'Error al cancelar la reserva', duration: 4000, color: 'danger' });
    }
  };

  // Función auxiliar para mostrar la fecha de forma legible arreglando el UTC
  const formatearFechaHora = (fechaString: string) => {
    const fechaObj = new Date(fechaString);
    const opcionesFecha: Intl.DateTimeFormatOptions = { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const opcionesHora: Intl.DateTimeFormatOptions = { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', hour12: false };
    
    return {
      dia: fechaObj.toLocaleDateString('es-CL', opcionesFecha),
      hora: fechaObj.toLocaleTimeString('es-CL', opcionesHora)
    };
  };

  return (
    <IonPage>
      <IonContent fullscreen style={{ '--background': '#f5f5f5' }}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          
          <HeaderBanner 
            title="Mis Agendas"
            backgroundImage="/assets/headerTramites.png" 
            buttonText="Volver al Perfil"
            buttonRoute="/profile" 
            showSecondaryButton={false} 
          />

          <main style={{ flex: 1, padding: '20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            
            <IonButton fill="clear" onClick={() => history.goBack()} style={{ marginBottom: '20px' }}>
              <IonIcon slot="start" icon={arrowBackOutline} /> Volver
            </IonButton>

            <h2 style={{ color: '#1b3a6b', fontWeight: 'bold', marginBottom: '20px' }}>Próximos Compromisos</h2>

            {cargando ? (
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <IonSpinner name="crescent" />
                <p>Cargando agendas...</p>
              </div>
            ) : agendas.length === 0 ? (
              <IonCard style={{ textAlign: 'center', padding: '40px 20px', borderRadius: '8px' }}>
                <IonIcon icon={calendarOutline} style={{ fontSize: '4rem', color: '#ccc', marginBottom: '10px' }} />
                <h3 style={{ color: '#666' }}>No tienes reservas activas</h3>
                <p style={{ color: '#999' }}>Tus inscripciones a talleres y horas presenciales aparecerán aquí.</p>
              </IonCard>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {agendas.map((agenda, index) => {
                  const fecha = formatearFechaHora(agenda.fecha_evento);
                  const isDideco = agenda.tipo === 'Taller DIDECO';

                  return (
                    <IonCard key={index} style={{ margin: 0, borderRadius: '8px', borderLeft: `5px solid ${isDideco ? '#28a745' : '#1a73c8'}` }}>
                      <IonCardContent style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                          
                          <div style={{ flex: 1, minWidth: '250px' }}>
                            <IonBadge color={isDideco ? "success" : "primary"} style={{ marginBottom: '10px' }}>
                              {agenda.tipo}
                            </IonBadge>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
                              {agenda.titulo}
                            </h3>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', color: '#555' }}>
                              <IonIcon icon={calendarOutline} />
                              <span style={{ textTransform: 'capitalize' }}>{fecha.dia}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', color: '#555' }}>
                              <IonIcon icon={timeOutline} />
                              <span>{fecha.hora} hrs</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555' }}>
                              <IonIcon icon={locationOutline} />
                              <span>{isDideco ? 'Gimnasio Municipal' : 'Dirección de Tránsito'}</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <IonButton 
                              color="danger" 
                              fill="outline"
                              onClick={() => cancelarAgenda(agenda.id, agenda.tipo, agenda.taller_id)}
                            >
                              <IonIcon slot="start" icon={trashOutline} />
                              Cancelar Reserva
                            </IonButton>
                          </div>

                        </div>
                      </IonCardContent>
                    </IonCard>
                  );
                })}
              </div>
            )}
          </main>
          <FooterBanner />
        </div>
      </IonContent>
    </IonPage>
  );
}