import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, 
  IonCardContent, IonButton, IonSpinner, useIonToast, IonIcon, IonBadge, IonTextarea, IonItem, IonLabel
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { documentOutline, checkmarkCircleOutline, alertCircleOutline, arrowBackOutline } from 'ionicons/icons';
import HeaderBanner from '../components/HeaderBanner';

export default function AdminRevisarTramite() {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [presentToast] = useIonToast();
  
  const [tramite, setTramite] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  
  // Estados para el sistema de observaciones
  const [mostrarObservacion, setMostrarObservacion] = useState(false);
  const [textoObservacion, setTextoObservacion] = useState('');
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargarDetalle();
  }, [id]);

  const cargarDetalle = async () => {
    try {
      const response = await fetch(`https://tramitessantodomingo-production-5cb4.up.railway.app/api/admin/tramites/${id}`);
      const data = await response.json();
      if (data.ok) {
        setTramite(data.tramite);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      presentToast({ message: 'Error al cargar el detalle', duration: 3000, color: 'danger' });
      history.goBack();
    } finally {
      setCargando(false);
    }
  };

  const actualizarEstado = async (nuevoEstado: string) => {
    if (nuevoEstado === 'observado' && !textoObservacion.trim()) {
      presentToast({ message: 'Debes escribir el motivo de la observación', duration: 3000, color: 'warning' });
      return;
    }

    setProcesando(true);
    try {
      const response = await fetch(`https://tramitessantodomingo-production-5cb4.up.railway.app/api/admin/tramites/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: nuevoEstado,
          observacion: nuevoEstado === 'observado' ? textoObservacion : null
        })
      });
      
      const data = await response.json();
      if (data.ok) {
        presentToast({ 
          message: nuevoEstado === 'aprobado' ? 'Trámite Aprobado Exitosamente' : 'Observación enviada al ciudadano', 
          duration: 3000, 
          color: 'success' 
        });
        history.push('/admin/tramites'); // Volvemos a la lista
      }
    } catch (error) {
      presentToast({ message: 'Error al conectar con el servidor', duration: 3000, color: 'danger' });
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) {
    return <IonPage><IonContent><div style={{ textAlign: 'center', marginTop: '50px' }}><IonSpinner /></div></IonContent></IonPage>;
  }

  if (!tramite) return null;

  return (
    <IonPage>
      <IonContent style={{ '--background': '#f5f5f5' }}>
        <HeaderBanner 
          title={`Revisión Solicitud #${tramite.solicitud_id}`}
          backgroundImage="/assets/headerAdmin.png"
          buttonText="Volver a la Lista"
          buttonRoute="/admin/tramites"
          showSecondaryButton={false} 
        />

        <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          
          <IonButton fill="clear" onClick={() => history.goBack()} style={{ marginBottom: '10px' }}>
            <IonIcon slot="start" icon={arrowBackOutline} /> Volver
          </IonButton>

          <IonCard style={{ borderRadius: '8px', marginBottom: '20px' }}>
            <IonCardHeader style={{ backgroundColor: '#1b3a6b', color: 'white' }}>
              <IonCardTitle style={{ color: 'white', fontSize: '1.4rem' }}>{tramite.nombre_tramite}</IonCardTitle>
              <p style={{ margin: 0, opacity: 0.8 }}>Ingresado el: {new Date(tramite.fecha_solicitud).toLocaleDateString()}</p>
            </IonCardHeader>

            <IonCardContent style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                
                {/* Datos del Ciudadano */}
                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                  <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: 0, color: '#1b3a6b' }}>Datos del Solicitante</h3>
                  <p><strong>Nombre:</strong> {tramite.nombres} {tramite.apellido_p} {tramite.apellido_m}</p>
                  <p><strong>RUT:</strong> {tramite.rut}</p>
                  <p><strong>Correo:</strong> {tramite.correo}</p>
                </div>

                {/* Datos del Vehículo */}
                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                  <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: 0, color: '#1b3a6b' }}>Detalles del Vehículo</h3>
                  <p><strong>Patente:</strong> <IonBadge color="dark">{tramite.patente}</IonBadge></p>
                  <p><strong>Marca / Modelo:</strong> {tramite.marca} - {tramite.modelo}</p>
                  <p><strong>Año:</strong> {tramite.anio}</p>
                </div>
              </div>

              {/* Botón para ver el PDF/Imagen */}
              <div style={{ textAlign: 'center', margin: '30px 0' }}>
                <IonButton 
                  fill="outline" 
                  color="primary" 
                  size="large"
                  onClick={() => window.open(tramite.url_revision_tecnica, '_blank')}
                >
                  <IonIcon slot="start" icon={documentOutline} />
                  Ver Documento Adjunto
                </IonButton>
              </div>

              {/* CONTROLES DE ACCIÓN (Aprobar o Rechazar) */}
              {tramite.estado === 'pendiente' || tramite.estado === 'requiere modificación' ? (
                <>
                  <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />
                  
                  {!mostrarObservacion ? (
                    <div style={{ display: 'flex', justifyContent: 'space-around', gap: '15px', marginTop: '20px' }}>
                      <IonButton color="warning" expand="block" onClick={() => setMostrarObservacion(true)} style={{ flex: 1 }}>
                        <IonIcon slot="start" icon={alertCircleOutline} />
                        Solicitar Modificación
                      </IonButton>
                      
                      <IonButton color="success" expand="block" onClick={() => actualizarEstado('aprobado')} disabled={procesando} style={{ flex: 1 }}>
                        <IonIcon slot="start" icon={checkmarkCircleOutline} />
                        Aprobar Trámite
                      </IonButton>
                    </div>
                  ) : (
                    <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', borderLeft: '5px solid #ffc107' }}>
                      <h4 style={{ color: '#856404', marginTop: 0 }}>Escriba las observaciones para el ciudadano:</h4>
                      <IonItem lines="none" style={{ '--background': 'white', borderRadius: '6px', border: '1px solid #ffeeba' }}>
                        <IonTextarea 
                          rows={4}
                          placeholder="Ej: El documento de revisión técnica está borroso, por favor vuelva a subirlo."
                          value={textoObservacion}
                          onIonChange={e => setTextoObservacion(e.detail.value!)}
                        />
                      </IonItem>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                        <IonButton color="medium" fill="clear" onClick={() => setMostrarObservacion(false)}>Cancelar</IonButton>
                        <IonButton color="warning" onClick={() => actualizarEstado('observado')} disabled={procesando}>
                          Enviar Observación
                        </IonButton>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <IonBadge color={tramite.estado === 'aprobado' ? 'success' : 'medium'} style={{ padding: '10px', fontSize: '1rem' }}>
                    Este trámite ya fue {tramite.estado}
                  </IonBadge>
                </div>
              )}

            </IonCardContent>
          </IonCard>
        </main>
      </IonContent>
    </IonPage>
  );
}