import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonButton,
  IonSpinner,
  useIonToast,
  IonIcon
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { alertCircleOutline, checkmarkCircleOutline, timeOutline } from 'ionicons/icons';
import HeaderBanner from '../components/HeaderBanner';
import FooterBanner from '../components/FooterBanner';

export default function MisTramites() {
  const history = useHistory();
  const [presentToast] = useIonToast();
  const [tramites, setTramites] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarTramites();
  }, []);

  const cargarTramites = async () => {
    try {
      const sessionData = localStorage.getItem('user_session');
      if (!sessionData) {
        history.push('/login');
        return;
      }

      const userObj = JSON.parse(sessionData);
      const user = Array.isArray(userObj) ? userObj[0] : userObj;

      const response = await fetch(`https://tramitessantodomingo-production-5cb4.up.railway.app/api/tramites/usuario/${user.id}`);
      const data = await response.json();

      if (data.ok) {
        setTramites(data.tramites);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error(error);
      presentToast({ message: 'Error al cargar tus trámites', duration: 3000, color: 'danger' });
    } finally {
      setCargando(false);
    }
  };

  const renderEstado = (estado: string) => {
    if (!estado) return <IonBadge color="primary" style={{ padding: '8px' }}><IonIcon icon={timeOutline}/> En Revisión</IonBadge>;
    
    switch (estado.toLowerCase()) {
      case 'aprobado':
        return <IonBadge color="success" style={{ padding: '8px' }}><IonIcon icon={checkmarkCircleOutline}/> Aprobado</IonBadge>;
      case 'observado':
      case 'requiere modificación':
        return <IonBadge color="warning" style={{ padding: '8px', color: '#000' }}><IonIcon icon={alertCircleOutline}/> Requiere Corrección</IonBadge>;
      default:
        return <IonBadge color="primary" style={{ padding: '8px' }}><IonIcon icon={timeOutline}/> {estado}</IonBadge>;
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen style={{ '--background': '#f5f5f5' }}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          
          <HeaderBanner 
            title="Mis Trámites"
            backgroundImage="/assets/headerTramites.png"
            buttonText="Volver al Perfil"
            buttonRoute="/profile"
            showSecondaryButton={false} 
          />

          <main style={{ flex: 1, padding: '20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            
            {cargando ? (
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <IonSpinner name="crescent" />
                <p>Cargando tus solicitudes...</p>
              </div>
            ) : tramites.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
                <h3>No tienes trámites en curso</h3>
                <p>Cuando solicites un trámite, aparecerá aquí.</p>
              </div>
            ) : (
              tramites.map((tramite) => (
                <IonCard key={tramite.id} style={{ marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                  <IonCardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                    <div>
                      <IonCardTitle style={{ fontSize: '1.2rem', color: '#1b3a6b', fontWeight: 'bold' }}>
                        {tramite.nombre_tramite}
                      </IonCardTitle>
                      <small style={{ color: '#666' }}>
                        Solicitud #{tramite.id} • {tramite.fecha_solicitud ? new Date(tramite.fecha_solicitud).toLocaleDateString() : 'Sin fecha'}
                      </small>
                    </div>
                    <div>
                      {renderEstado(tramite.estado)}
                    </div>
                  </IonCardHeader>

                  <IonCardContent style={{ padding: '15px' }}>
                    
                    {/* SI EL TRÁMITE TIENE UN ERROR, MOSTRAMOS EL MENSAJE DEL ADMIN Y EL BOTÓN */}
                    {tramite.estado && (tramite.estado.toLowerCase() === 'observado' || tramite.estado.toLowerCase() === 'requiere modificación') && (
                      <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #ffc107', marginBottom: '15px' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#856404', fontSize: '1rem' }}>
                          <IonIcon icon={alertCircleOutline} style={{ verticalAlign: 'middle', marginRight: '5px' }}/>
                          Mensaje del Administrador:
                        </h4>
                        <p style={{ margin: 0, color: '#856404' }}>
                          {tramite.observacion || "Por favor, revisa y modifica los datos de tu solicitud."}
                        </p>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      {tramite.estado && (tramite.estado.toLowerCase() === 'observado' || tramite.estado.toLowerCase() === 'requiere modificación') && (
                        <IonButton 
                          fill="solid" 
                          color="warning"
                          onClick={() => alert(`Próximamente: Ir a editar el trámite ${tramite.id}`)}
                        >
                          Corregir Trámite
                        </IonButton>
                      )}
                      
                      <IonButton fill="outline" color="primary" onClick={() => alert("Próximamente: Ver comprobante en PDF")}>
                        Ver Detalles
                      </IonButton>
                    </div>

                  </IonCardContent>
                </IonCard>
              ))
            )}

          </main>

          <FooterBanner />
        </div>
      </IonContent>
    </IonPage>
  );
}