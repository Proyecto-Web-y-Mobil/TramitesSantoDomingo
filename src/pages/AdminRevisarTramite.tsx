import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonButton, IonSpinner,
  useIonToast, IonIcon, IonTextarea, IonItem, IonGrid, IonRow, IonCol, useIonViewWillEnter
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import {
  checkmarkCircleOutline, alertCircleOutline,
  closeCircleOutline, eyeOutline, personOutline, mailOutline,
  carOutline, calendarOutline, documentTextOutline, warningOutline
} from 'ionicons/icons';
import { authService } from '../services/authService';

const ASSETS = {
  fondo:  'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/FondoSantoDomigno.png',
  logo:   'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/LogoSantoDomingoAzul.png',
  puerta: 'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PuertaSalir.png',
};

export default function AdminRevisarTramite() {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [presentToast] = useIonToast();

  const [tramite, setTramite]             = useState<any>(null);
  const [cargando, setCargando]           = useState(true);
  const [accionPendiente, setAccionPendiente] = useState<'observado' | 'rechazado' | null>(null);
  const [textoMensaje, setTextoMensaje]   = useState('');
  const [procesando, setProcesando]       = useState(false);
  const [nombreAdmin, setNombreAdmin]     = useState('');

  // 🔒 Validación de seguridad
  useEffect(() => {
    const sessionData = localStorage.getItem('user_session');
    if (!sessionData) { history.push('/login-funcionario'); return; }
    const userObj = JSON.parse(sessionData);
    const user = Array.isArray(userObj) ? userObj[0] : userObj;
    if (user.rol !== 'funcionario') { history.replace('/tramites-user'); return; }
    setNombreAdmin(`${user.nombres} ${user.apellidoP || user.apellido_p || ''}`);
  }, [history]);
  
  useEffect(() => { cargarDetalle(); }, [id]);

  // 🔥 Resetear estados al entrar a la página para evitar la caché
  useIonViewWillEnter(() => {
    setAccionPendiente(null);
    setTextoMensaje('');
  });

  const cargarDetalle = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/tramites/${id}`);
      const data = await response.json();
      if (data.ok) setTramite(data.tramite);
      else throw new Error(data.error);
    } catch (error) {
      presentToast({ message: 'Error al cargar el detalle', duration: 3000, color: 'danger' });
      history.goBack();
    } finally {
      setCargando(false);
    }
  };

  const actualizarEstado = async (nuevoEstado: string) => {
    if ((nuevoEstado === 'observado' || nuevoEstado === 'rechazado') && !textoMensaje.trim()) {
      presentToast({
        message: `Debes escribir el motivo para ${nuevoEstado === 'rechazado' ? 'rechazar' : 'observar'} el trámite`,
        duration: 3000, color: 'warning'
      });
      return;
    }
    setProcesando(true);
    try {
      const response = await fetch(`http://localhost:3000/api/admin/tramites/${id}/estado`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            estado: nuevoEstado,
            observacion: (nuevoEstado === 'observado' || nuevoEstado === 'rechazado') ? textoMensaje : null
          })
        }
      );
      const data = await response.json();
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

  const handleCerrarSesion = () => { 
    authService.logout(); 
    window.location.href = '/login-funcionario'; 
  };

  if (cargando) return (
    <IonPage>
      <IonContent style={{ '--background': '#f0f2f5' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <IonSpinner name="crescent" />
        </div>
      </IonContent>
    </IonPage>
  );

  if (!tramite) return null;

  const yaGestionado = tramite.estado !== 'pendiente' && tramite.estado !== 'corregido';

  // 🔥 HOMOLOGACIÓN DE ESTADOS: Agrupamos 'aprobado', 'completado' y 'finalizado' bajo la misma etiqueta visual
  const getEstadoCfg = (estado: string) => {
    switch ((estado || '').toLowerCase()) {
      case 'aprobado':  
      case 'completado': 
      case 'finalizado':
        return { label: 'Aprobado',  color: '#27ae60', bg: '#f0fff5', border: '#b7e9c8' };
      case 'rechazado': return { label: 'Rechazado', color: '#c0392b', bg: '#fff0f0', border: '#f5c6c6' };
      case 'observado': case 'requiere modificación':
        return { label: 'Observado', color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
      case 'corregido': return { label: 'Corregido', color: '#8e44ad', bg: '#f9f0ff', border: '#d8b4fe' };
      default:          return { label: 'Pendiente', color: '#1a73c8', bg: '#eef4ff', border: '#c5d8f8' };
    }
  };

  const estadoCfg = getEstadoCfg(tramite.estado);

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': '#f0f2f5' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          * { box-sizing: border-box; }

          .ar-root {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            display: flex; flex-direction: row;
            font-family: 'Inter', sans-serif;
            background: #f0f2f5; overflow: hidden;
          }

          /* SIDEBAR */
          .ar-sidebar {
            width: 200px; flex-shrink: 0; background: #002050;
            display: flex; flex-direction: column;
            align-items: center; padding: 28px 16px 24px; height: 100%;
          }
          .ar-sidebar-logo { width: 120px; filter: brightness(0) invert(1); }

          /* COLUMNA DERECHA */
          .ar-right { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow-y: auto; }

          /* HEADER */
          .ar-header {
            flex-shrink: 0; position: relative; min-height: 130px;
            background-image: url('${ASSETS.fondo}');
            background-size: cover; background-position: center;
            display: flex; align-items: center;
            padding: 20px 32px; justify-content: space-between;
            gap: 16px; flex-wrap: wrap;
          }
          .ar-header::after {
            content: ''; position: absolute; inset: 0;
            background: rgba(0,10,40,0.58);
          }
          .ar-header-texts { position: relative; z-index: 2; }
          .ar-header-texts h1 {
            font-size: 2rem; font-weight: 800; color: #fff;
            margin: 0 0 4px; font-family: 'Inter', sans-serif; line-height: 1;
          }
          .ar-header-texts .bienvenido {
            font-size: 0.82rem; color: rgba(255,255,255,0.80); margin: 0 0 1px;
            font-family: 'Inter', sans-serif;
          }
          .ar-header-texts .bienvenido strong { font-weight: 600; font-style: italic; color: #fff; }
          .ar-header-texts .subtitulo {
            font-size: 0.76rem; font-weight: 600;
            color: rgba(255,255,255,0.65); margin: 0; font-family: 'Inter', sans-serif;
          }
          .ar-header-btns {
            position: relative; z-index: 2;
            display: flex; flex-direction: column; gap: 8px; align-items: flex-end;
          }
          .btn-cerrar {
            --background: #003060; --background-hover: #00428a; --color: #fff;
            --border-radius: 8px; --padding-start: 14px; --padding-end: 14px;
            --padding-top: 8px; --padding-bottom: 8px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.82rem; font-weight: 600; margin: 0;
          }
          .btn-volver {
            --background: #003060; --background-hover: #00428a; --color: #fff;
            --border-radius: 8px; --padding-start: 14px; --padding-end: 14px;
            --padding-top: 8px; --padding-bottom: 8px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.88rem; font-weight: 700; margin: 0; min-width: 130px;
          }
          .ar-btn-icon {
            width: 16px; height: 16px; filter: brightness(0) invert(1); margin-right: 6px;
          }

          /* CONTENIDO */
          .ar-main { padding: 28px 40px; max-width: 960px; width: 100%; margin: 0 auto; }

          /* Sección título */
          .ar-section-titulo {
            font-size: 0.72rem; font-weight: 700; color: rgba(0,48,96,0.45);
            text-transform: uppercase; letter-spacing: 1px;
            margin: 0 0 12px; font-family: 'Inter', sans-serif;
            padding-bottom: 6px; border-bottom: 1px solid #e8edf5;
          }

          /* Cards de datos */
          .ar-data-grid {
            display: grid; grid-template-columns: 1fr 1fr;
            gap: 16px; margin-bottom: 16px;
          }
          .ar-data-card {
            background: #fff; border: 1px solid #e0e7ef;
            border-radius: 14px; padding: 22px 24px;
          }
          .ar-data-card h3 {
            font-size: 0.95rem; font-weight: 700; color: #003060;
            margin: 0 0 16px; font-family: 'Inter', sans-serif;
          }
          .ar-data-row {
            display: flex; align-items: center; gap: 12px; margin-bottom: 12px;
          }
          .ar-data-row:last-child { margin-bottom: 0; }
          .ar-data-icon { color: #003060; font-size: 1.1rem; flex-shrink: 0; }
          .ar-data-label {
            font-size: 0.82rem; font-weight: 700; color: #003060;
            font-family: 'Inter', sans-serif; min-width: 100px;
          }
          .ar-data-value {
            font-size: 0.85rem; color: #6b7280;
            font-family: 'Inter', sans-serif;
          }
          .ar-patente-badge {
            background: #eef4ff; color: #003060; border: 1.5px solid #c5d8f8;
            border-radius: 6px; padding: 2px 10px;
            font-size: 0.85rem; font-weight: 700; font-family: 'Inter', sans-serif;
            letter-spacing: 1px;
          }

          /* Card documento adjunto */
          .ar-doc-card {
            background: #fff; border: 1px solid #e0e7ef;
            border-radius: 14px; padding: 18px 24px;
            display: flex; align-items: center; gap: 16px;
            margin-bottom: 16px;
          }
          .ar-doc-icon { color: #003060; font-size: 2rem; flex-shrink: 0; }
          .ar-doc-texts { flex: 1; }
          .ar-doc-texts h4 {
            font-size: 0.92rem; font-weight: 700; color: #003060;
            margin: 0 0 3px; font-family: 'Inter', sans-serif;
          }
          .ar-doc-texts p {
            font-size: 0.78rem; color: #9ca3af; margin: 0;
            font-family: 'Inter', sans-serif;
          }
          .btn-ver-doc {
            --background: transparent; --background-hover: rgba(0,48,96,0.06);
            --color: #6b7280;
            --border-color: #d0d8e4; --border-width: 1px; --border-style: solid;
            --border-radius: 8px; --padding-start: 14px; --padding-end: 14px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.82rem; font-weight: 500; margin: 0; flex-shrink: 0;
          }

          /* Aviso importante */
          .ar-aviso {
            background: #fffbeb; border: 1.5px solid #fde68a;
            border-radius: 10px; padding: 14px 18px;
            display: flex; align-items: center; gap: 10px;
            margin-bottom: 16px;
          }
          .ar-aviso ion-icon { color: #d97706; font-size: 1.2rem; flex-shrink: 0; }
          .ar-aviso span {
            font-size: 0.82rem; color: #92400e;
            font-family: 'Inter', sans-serif; line-height: 1.4;
          }

          /* Zona ya gestionado */
          .ar-gestionado {
            background: #fff; border: 1px solid #e0e7ef;
            border-radius: 14px; padding: 22px 24px; margin-bottom: 16px;
          }

          /* Botones de acción */
          .ar-acciones { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
          .btn-rechazar {
            --background: #fef0f0; --background-hover: #fde4e4; --color: #c0392b;
            --border-color: #f5c6c6; --border-width: 1.5px; --border-style: solid;
            --border-radius: 10px; --padding-start: 20px; --padding-end: 20px;
            --padding-top: 12px; --padding-bottom: 12px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.92rem; font-weight: 600; margin: 0; flex: 1;
          }
          .btn-solicitar {
            --background: #fffbeb; --background-hover: #fef3c7; --color: #d97706;
            --border-color: #fde68a; --border-width: 1.5px; --border-style: solid;
            --border-radius: 10px; --padding-start: 20px; --padding-end: 20px;
            --padding-top: 12px; --padding-bottom: 12px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.92rem; font-weight: 600; margin: 0; flex: 1;
          }
          .btn-aprobar {
            --background: #f0fff5; --background-hover: #dcfce7; --color: #27ae60;
            --border-color: #b7e9c8; --border-width: 1.5px; --border-style: solid;
            --border-radius: 10px; --padding-start: 20px; --padding-end: 20px;
            --padding-top: 12px; --padding-bottom: 12px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.92rem; font-weight: 600; margin: 0; flex: 1;
          }

          /* Zona de texto para rechazo/observación */
          .ar-textarea-box {
            border-radius: 12px; padding: 18px 20px; margin-bottom: 16px;
          }
          .ar-textarea-box h4 {
            font-size: 0.88rem; font-weight: 700; margin: 0 0 10px;
            font-family: 'Inter', sans-serif;
          }
          .ar-textarea-item {
            --background: white; --border-radius: 8px;
            border-radius: 8px; margin-bottom: 12px;
          }
          .ar-textarea-actions { display: flex; justify-content: flex-end; gap: 10px; }
          .btn-cancelar {
            --background: transparent; --background-hover: rgba(0,0,0,0.05);
            --color: #6b7280; --border-radius: 8px;
            --padding-start: 16px; --padding-end: 16px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.85rem; font-weight: 500; margin: 0;
          }
          .btn-confirmar-rechazo {
            --background: #c0392b; --background-hover: #a93226; --color: #fff;
            --border-radius: 8px; --padding-start: 16px; --padding-end: 16px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.85rem; font-weight: 600; margin: 0;
          }
          .btn-confirmar-obs {
            --background: #d97706; --background-hover: #b45309; --color: #fff;
            --border-radius: 8px; --padding-start: 16px; --padding-end: 16px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.85rem; font-weight: 600; margin: 0;
          }

          /* MÓVIL */
          @media (max-width: 600px) {
            .ar-root { flex-direction: column; overflow-y: auto; }
            .ar-sidebar { display: none; }
            .ar-right { overflow-y: unset; }
            .ar-header { min-height: 110px; padding: 14px 16px; }
            .ar-header-texts h1 { font-size: 1.4rem; }
            .ar-main { padding: 16px 12px; }
            .ar-data-grid { grid-template-columns: 1fr; }
            .ar-acciones { flex-direction: column; }
            .ar-doc-card { flex-direction: column; align-items: flex-start; }
          }
        `}</style>

        <div className="ar-root">

          {/* SIDEBAR */}
          <div className="ar-sidebar">
            <img className="ar-sidebar-logo" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />
          </div>

          {/* COLUMNA DERECHA */}
          <div className="ar-right">

            {/* HEADER */}
            <div className="ar-header">
              <div className="ar-header-texts">
                <h1>Revisión solicitud #{tramite.solicitud_id}</h1>
                <p className="bienvenido">Bienvenido, <strong>{nombreAdmin || 'Cargando...'}</strong></p>
                <p className="subtitulo">Gestiona y administra los trámites y servicios municipales</p>
              </div>
              <div className="ar-header-btns">
                <IonButton className="btn-cerrar" onClick={handleCerrarSesion}>
                  <img className="ar-btn-icon" src={ASSETS.puerta} alt="" />
                  Cerrar sesión
                </IonButton>
                <IonButton className="btn-volver" onClick={() => history.push('/admin/tramites')}>
                  ← Volver
                </IonButton>
              </div>
            </div>

            {/* CONTENIDO */}
            <div className="ar-main">

              {/* Datos en dos columnas */}
              <IonGrid style={{ padding: 0, marginBottom: 16 }}>
                <IonRow>
                  {/* Datos del solicitante */}
                  <IonCol size="12" sizeMd="6">
                    <div className="ar-data-card">
                      <h3>Datos del solicitante</h3>
                      <div className="ar-data-row">
                        <IonIcon icon={personOutline} className="ar-data-icon" />
                        <span className="ar-data-label">Nombre:</span>
                        <span className="ar-data-value">{tramite.nombres} {tramite.apellido_p} {tramite.apellido_m}</span>
                      </div>
                      <div className="ar-data-row">
                        <IonIcon icon={personOutline} className="ar-data-icon" />
                        <span className="ar-data-label">RUT:</span>
                        <span className="ar-data-value">{tramite.rut}</span>
                      </div>
                      <div className="ar-data-row">
                        <IonIcon icon={mailOutline} className="ar-data-icon" />
                        <span className="ar-data-label">Correo:</span>
                        <span className="ar-data-value">{tramite.correo}</span>
                      </div>
                    </div>
                  </IonCol>

                  {/* Detalles del vehículo */}
                  <IonCol size="12" sizeMd="6">
                    <div className="ar-data-card">
                      <h3>Detalles del vehículo</h3>
                      <div className="ar-data-row">
                        <IonIcon icon={carOutline} className="ar-data-icon" />
                        <span className="ar-data-label">Patente:</span>
                        <span className="ar-patente-badge">{tramite.patente}</span>
                      </div>
                      <div className="ar-data-row">
                        <IonIcon icon={carOutline} className="ar-data-icon" />
                        <span className="ar-data-label">Marca/Modelo:</span>
                        <span className="ar-data-value">{tramite.marca} - {tramite.modelo}</span>
                      </div>
                      <div className="ar-data-row">
                        <IonIcon icon={calendarOutline} className="ar-data-icon" />
                        <span className="ar-data-label">Año:</span>
                        <span className="ar-data-value">{tramite.anio}</span>
                      </div>
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>

              {/* Documento adjunto */}
              <div className="ar-doc-card">
                <IonIcon icon={documentTextOutline} className="ar-doc-icon" />
                <div className="ar-doc-texts">
                  <h4>Documento adjunto</h4>
                  <p>Revisa el documento ingresado por el solicitante</p>
                </div>
                <IonButton
                  className="btn-ver-doc"
                  fill="outline"
                  onClick={() => window.open(tramite.url_revision_tecnica, '_blank')}
                >
                  <IonIcon slot="start" icon={eyeOutline} />
                  Ver documento adjunto
                </IonButton>
              </div>

              {/* Zona de acción */}
              {yaGestionado ? (
                <div className="ar-gestionado">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span
                      style={{
                        display: 'inline-block', padding: '5px 14px',
                        borderRadius: 20, fontSize: '0.85rem', fontWeight: 700,
                        color: estadoCfg.color, background: estadoCfg.bg,
                        border: `1.5px solid ${estadoCfg.border}`,
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      Este trámite ya fue {estadoCfg.label}
                    </span>
                  </div>
                  {(tramite.estado === 'observado' || tramite.estado === 'rechazado') && tramite.observacion && (
                    <div style={{
                      background: tramite.estado === 'rechazado' ? '#fff0f0' : '#fffbeb',
                      border: `1px solid ${tramite.estado === 'rechazado' ? '#f5c6c6' : '#fde68a'}`,
                      borderRadius: 10, padding: '14px 18px',
                    }}>
                      <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '0.82rem', fontFamily: 'Inter', color: tramite.estado === 'rechazado' ? '#c0392b' : '#92400e' }}>
                        Mensaje enviado al ciudadano:
                      </p>
                      <p style={{ margin: 0, fontSize: '0.85rem', fontFamily: 'Inter', color: tramite.estado === 'rechazado' ? '#c0392b' : '#92400e' }}>
                        {tramite.observacion}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Aviso */}
                  {!accionPendiente && (
                    <div className="ar-aviso">
                      <IonIcon icon={warningOutline} />
                      <span>Importante: Revisa la información y el documento adjunto antes de aprobar, rechazar o solicitar cambio</span>
                    </div>
                  )}

                  {/* Botones principales */}
                  {!accionPendiente ? (
                    <div className="ar-acciones">
                      <IonButton className="btn-rechazar" fill="solid"
                        onClick={() => setAccionPendiente('rechazado')}>
                        <IonIcon slot="start" icon={closeCircleOutline} />
                        Rechazar
                      </IonButton>
                      <IonButton className="btn-solicitar" fill="solid"
                        onClick={() => setAccionPendiente('observado')}>
                        <IonIcon slot="start" icon={alertCircleOutline} />
                        Solicitar cambio
                      </IonButton>
                      <IonButton className="btn-aprobar" fill="solid"
                        disabled={procesando}
                        onClick={() => actualizarEstado('aprobado')}>
                        <IonIcon slot="start" icon={checkmarkCircleOutline} />
                        Aprobar
                      </IonButton>
                    </div>
                  ) : (
                    /* Caja de texto para motivo */
                    <div
                      className="ar-textarea-box"
                      style={{
                        background: accionPendiente === 'rechazado' ? '#fff0f0' : '#fffbeb',
                        border: `1.5px solid ${accionPendiente === 'rechazado' ? '#f5c6c6' : '#fde68a'}`,
                      }}
                    >
                      <h4 style={{ color: accionPendiente === 'rechazado' ? '#c0392b' : '#92400e' }}>
                        {accionPendiente === 'rechazado'
                          ? 'Motivo del rechazo definitivo:'
                          : '¿Qué debe modificar el ciudadano?'}
                      </h4>
                      <IonItem lines="none" className="ar-textarea-item"
                        style={{ border: `1px solid ${accionPendiente === 'rechazado' ? '#f5c6c6' : '#fde68a'}` }}>
                        <IonTextarea
                          rows={4}
                          placeholder={accionPendiente === 'rechazado'
                            ? 'Ej: El vehículo no corresponde a esta comuna.'
                            : 'Ej: El documento está borroso, por favor vuelva a subirlo.'}
                          value={textoMensaje}
                          onIonChange={e => setTextoMensaje(e.detail.value!)}
                        />
                      </IonItem>
                      <div className="ar-textarea-actions">
                        <IonButton className="btn-cancelar" fill="clear"
                          onClick={() => { setAccionPendiente(null); setTextoMensaje(''); }}>
                          Cancelar
                        </IonButton>
                        <IonButton
                          className={accionPendiente === 'rechazado' ? 'btn-confirmar-rechazo' : 'btn-confirmar-obs'}
                          disabled={procesando}
                          onClick={() => actualizarEstado(accionPendiente)}
                        >
                          {procesando
                            ? <IonSpinner name="dots" />
                            : `Confirmar ${accionPendiente === 'rechazado' ? 'rechazo' : 'observación'}`
                          }
                        </IonButton>
                      </div>
                    </div>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}