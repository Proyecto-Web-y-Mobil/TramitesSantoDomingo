import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, 
  IonCardContent, IonButton, IonSpinner, useIonToast, IonIcon, IonBadge, IonTextarea, IonItem
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { documentOutline, checkmarkCircleOutline, alertCircleOutline, arrowBackOutline, closeCircleOutline } from 'ionicons/icons';
import HeaderBanner from '../components/HeaderBanner';

export default function AdminRevisarTramite() {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [presentToast] = useIonToast();
  
  const [tramite, setTramite] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  
  // Usamos 'observado' que ahora sí es legal en la base de datos
  const [accionPendiente, setAccionPendiente] = useState<'observado' | 'rechazado' | null>(null);
  const [textoMensaje, setTextoMensaje] = useState('');
  const [procesando, setProcesando] = useState(false);

  // 🔒 CANDADO DE SEGURIDAD PARA ADMINISTRADORES
  useEffect(() => {
    const verificarPermisosAdmin = () => {
      const sessionData = localStorage.getItem('user_session');
      
      // 1. Si no hay sesión en absoluto, lo mandamos al login de funcionarios
      if (!sessionData) {
        history.push('/login-funcionario');
        return;
      }

      const userObj = JSON.parse(sessionData);
      const user = Array.isArray(userObj) ? userObj[0] : userObj;

      // 2. Si hay sesión pero no dice exactamente 'funcionario', es un ciudadano intruso.
      // Lo expulsamos silenciosamente al menú de trámites logueado.
      if (user.rol !== 'funcionario') {
        history.replace('/tramites-user');
      }
    };

    verificarPermisosAdmin();
  }, [history]);

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
    if ((nuevoEstado === 'observado' || nuevoEstado === 'rechazado') && !textoMensaje.trim()) {
      presentToast({ message: `Debes escribir el motivo para ${nuevoEstado === 'rechazado' ? 'rechazar' : 'observar'} el trámite`, duration: 3000, color: 'warning' });
      return;
    }

    setProcesando(true);
    try {
      const response = await fetch(`https://tramitessantodomingo-production-5cb4.up.railway.app/api/admin/tramites/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: nuevoEstado,
          observacion: (nuevoEstado === 'observado' || nuevoEstado === 'rechazado') ? textoMensaje : null
        })
      });
      
      const data = await response.json();
      
      // Mostramos error si el backend o la BD se quejan
      if (data.ok) {
        presentToast({ 
          message: nuevoEstado === 'aprobado' ? 'Trámite Aprobado Exitosamente' : `Trámite marcado como ${nuevoEstado}`, 
          duration: 3000, 
          color: nuevoEstado === 'rechazado' ? 'danger' : 'success' 
        });
        history.push('/admin/tramites'); 
      } else {
        presentToast({ message: `Error de la Base de Datos: ${data.error}`, duration: 5000, color: 'danger' });
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

  const colorCaja = accionPendiente === 'rechazado' ? '#f8d7da' : '#fff3cd';
  const colorBorde = accionPendiente === 'rechazado' ? '#dc3545' : '#ffc107';
  const colorTexto = accionPendiente === 'rechazado' ? '#721c24' : '#856404';

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
                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                  <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: 0, color: '#1b3a6b' }}>Datos del Solicitante</h3>
                  <p><strong>Nombre:</strong> {tramite.nombres} {tramite.apellido_p} {tramite.apellido_m}</p>
                  <p><strong>RUT:</strong> {tramite.rut}</p>
                  <p><strong>Correo:</strong> {tramite.correo}</p>
                </div>

                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                  <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: 0, color: '#1b3a6b' }}>Detalles del Vehículo</h3>
                  <p><strong>Patente:</strong> <IonBadge color="dark">{tramite.patente}</IonBadge></p>
                  <p><strong>Marca / Modelo:</strong> {tramite.marca} - {tramite.modelo}</p>
                  <p><strong>Año:</strong> {tramite.anio}</p>
                </div>
              </div>

              <div style={{ textAlign: 'center', margin: '30px 0' }}>
                <IonButton fill="outline" color="primary" size="large" onClick={() => window.open(tramite.url_revision_tecnica, '_blank')}>
                  <IonIcon slot="start" icon={documentOutline} /> Ver Documento Adjunto
                </IonButton>
              </div>

              {/* CONTROLES DE ACCIÓN */}
              {tramite.estado === 'pendiente' || tramite.estado === 'corregido' ? (
                <>
                  <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />
                  
                  {!accionPendiente ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                      <IonButton color="danger" onClick={() => setAccionPendiente('rechazado')} style={{ flex: 1 }}>
                        <IonIcon slot="start" icon={closeCircleOutline} /> Rechazar
                      </IonButton>
                      
                      <IonButton color="warning" onClick={() => setAccionPendiente('observado')} style={{ flex: 1 }}>
                        <IonIcon slot="start" icon={alertCircleOutline} /> Solicitar Cambio
                      </IonButton>
                      
                      <IonButton color="success" onClick={() => actualizarEstado('aprobado')} disabled={procesando} style={{ flex: 1 }}>
                        <IonIcon slot="start" icon={checkmarkCircleOutline} /> Aprobar
                      </IonButton>
                    </div>
                  ) : (
                    <div style={{ backgroundColor: colorCaja, padding: '15px', borderRadius: '8px', borderLeft: `5px solid ${colorBorde}` }}>
                      <h4 style={{ color: colorTexto, marginTop: 0 }}>
                        {accionPendiente === 'rechazado' ? 'Motivo del Rechazo Definitivo:' : '¿Qué debe modificar el ciudadano?'}
                      </h4>
                      <IonItem lines="none" style={{ '--background': 'white', borderRadius: '6px', border: `1px solid ${colorBorde}` }}>
                        <IonTextarea 
                          rows={4}
                          placeholder={accionPendiente === 'rechazado' ? "Ej: El vehículo no corresponde a esta comuna." : "Ej: El documento está borroso, por favor vuelva a subirlo."}
                          value={textoMensaje}
                          onIonChange={e => setTextoMensaje(e.detail.value!)}
                        />
                      </IonItem>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                        <IonButton color="medium" fill="clear" onClick={() => { setAccionPendiente(null); setTextoMensaje(''); }}>Cancelar</IonButton>
                        <IonButton color={accionPendiente === 'rechazado' ? 'danger' : 'warning'} onClick={() => actualizarEstado(accionPendiente)} disabled={procesando}>
                          Confirmar {accionPendiente === 'rechazado' ? 'Rechazo' : 'Observación'}
                        </IonButton>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <IonBadge color={tramite.estado === 'aprobado' ? 'success' : (tramite.estado === 'rechazado' ? 'danger' : 'warning')} style={{ padding: '10px', fontSize: '1rem', marginBottom: '15px' }}>
                    Este trámite ya fue {tramite.estado}
                  </IonBadge>
                  
                  {(tramite.estado === 'observado' || tramite.estado === 'rechazado') && tramite.observacion && (
                    <div style={{ backgroundColor: tramite.estado === 'rechazado' ? '#f8d7da' : '#fff3cd', padding: '15px', borderRadius: '8px', textAlign: 'left', marginTop: '10px' }}>
                      <p style={{ margin: 0, fontWeight: 'bold', color: tramite.estado === 'rechazado' ? '#721c24' : '#856404' }}>Mensaje enviado al ciudadano:</p>
                      <p style={{ margin: '5px 0 0 0', color: tramite.estado === 'rechazado' ? '#721c24' : '#856404' }}>{tramite.observacion}</p>
                    </div>
                  )}
                </div>
              )}

            </IonCardContent>
          </IonCard>
        </main>
      </IonContent>
    </IonPage>
  );
}