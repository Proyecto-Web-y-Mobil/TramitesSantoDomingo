import React, { useState } from 'react';
import {
  IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, 
  IonCardContent, IonButton, IonSpinner, useIonToast, IonIcon, IonBadge,
  useIonViewWillEnter
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { documentTextOutline, timeOutline, checkmarkCircleOutline, alertCircleOutline, closeCircleOutline } from 'ionicons/icons';
import HeaderBanner from '../components/HeaderBanner';

export default function AdminTramites() {
  const history = useHistory();
  const [presentToast] = useIonToast();
  const [tramites, setTramites] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  // El gancho mágico de Ionic que reemplaza a useEffect para evitar el error del F5
  useIonViewWillEnter(() => {
    cargarTramites();
  });

  const cargarTramites = async () => {
    try {
      setCargando(true);
      const response = await fetch('https://tramitessantodomingo-production-5cb4.up.railway.app/api/admin/tramites');
      const data = await response.json();
      if (data.ok) {
        setTramites(data.tramites);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      presentToast({ message: 'Error al cargar los trámites', duration: 3000, color: 'danger' });
    } finally {
      setCargando(false);
    }
  };

  const renderEstado = (estado: string) => {
    if (!estado) return <IonBadge color="primary"><IonIcon icon={timeOutline}/> Pendiente</IonBadge>;
    switch (estado.toLowerCase()) {
      case 'aprobado':
        return <IonBadge color="success"><IonIcon icon={checkmarkCircleOutline}/> Aprobado</IonBadge>;
      case 'rechazado':
        return <IonBadge color="danger"><IonIcon icon={closeCircleOutline}/> Rechazado</IonBadge>;
      case 'corregido':
        return <IonBadge color="tertiary"><IonIcon icon={checkmarkCircleOutline}/> Corregido por Usuario</IonBadge>;
      case 'observado':
      case 'requiere modificación':
        return <IonBadge color="warning" style={{ color: '#000' }}><IonIcon icon={alertCircleOutline}/> Observado</IonBadge>;
      default:
        return <IonBadge color="primary"><IonIcon icon={timeOutline}/> {estado}</IonBadge>;
    }
  };

  return (
    <IonPage>
      <IonContent style={{ '--background': '#f5f5f5' }}>
        <HeaderBanner 
          title="Gestión de Trámites"
          backgroundImage="/assets/headerAdmin.png"
          buttonText="Volver al Panel"
          buttonRoute="/admin-dashboard"
          showSecondaryButton={false} 
        />

        <main style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ color: '#1b3a6b', fontWeight: 'bold', marginBottom: '20px' }}>Todos los Trámites</h2>
          
          {cargando ? (
            <div style={{ textAlign: 'center', marginTop: '50px' }}><IonSpinner /></div>
          ) : tramites.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
              <h3>No hay trámites registrados</h3>
              <p>Las solicitudes de los ciudadanos aparecerán aquí.</p>
            </div>
          ) : (
            tramites.map((tramite) => (
              <IonCard key={tramite.solicitud_id} style={{ marginBottom: '20px', borderRadius: '8px' }}>
                <IonCardHeader style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <IonCardTitle style={{ fontSize: '1.2rem', color: '#1b3a6b' }}>
                      {tramite.nombre_tramite}
                    </IonCardTitle>
                    <small style={{ color: '#666' }}>
                      Solicitud #{tramite.solicitud_id} | Ingreso: {tramite.fecha_solicitud ? new Date(tramite.fecha_solicitud).toLocaleDateString() : 'Sin fecha'}
                    </small>
                  </div>
                  <div>
                    {renderEstado(tramite.estado)}
                  </div>
                </IonCardHeader>

                <IonCardContent style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                  
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>Solicitante:</p>
                    <p style={{ margin: 0, color: '#555' }}>
                      {tramite.nombres} {tramite.apellido_p} {tramite.apellido_m} <br/>
                      RUT: {tramite.rut}
                    </p>
                  </div>

                  <IonButton 
                    color="primary" 
                    onClick={() => history.push(`/admin/tramites/revisar/${tramite.solicitud_id}`)}
                  >
                    <IonIcon slot="start" icon={documentTextOutline} />
                    Revisar Trámite
                  </IonButton>

                </IonCardContent>
              </IonCard>
            ))
          )}
        </main>
      </IonContent>
    </IonPage>
  );
}