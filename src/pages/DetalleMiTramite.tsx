import React, { useState, useEffect, useRef } from 'react';
import {
  IonPage, IonContent, IonButton, IonSpinner,
  useIonToast, IonIcon, IonInput, IonItem, IonLabel, IonGrid, IonRow, IonCol
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import {
  documentOutline, arrowBackOutline,
  cloudUploadOutline, saveOutline
} from 'ionicons/icons';
import ConstructionAlert from '../components/ConstructionAlert';
import { authService } from '../services/authService';

const ASSETS = {
  fondo:        'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/FondoSantoDomigno.png',
  logo:         'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/LogoSantoDomingoAzul.png',
  ubicacion:    'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UbicacionBlanco.png',
  reloj:        'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/RelojBlanco.png',
  phone:        'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PhoneBlanco.png',
  perfilBlanco: 'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PerfilBlanco.png',
  tramite:      'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/TramiteBlanco.png',
  calendario:   'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/CalendarioBlanco.png',
  puerta:       'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PuertaSalir.png',
  usuarioGris:  'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UsuarioGris.png',
  camara:       'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/CamaraBlanco.png',
  nube:         'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/NubeBlanco.png',
};

export default function DetalleMiTramite() {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [presentToast] = useIonToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tramite, setTramite]                       = useState<any>(null);
  const [cargando, setCargando]                     = useState(true);
  const [procesando, setProcesando]                 = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);

  const [editPatente, setEditPatente] = useState('');
  const [editMarca, setEditMarca]     = useState('');
  const [editModelo, setEditModelo]   = useState('');
  const [editAnio, setEditAnio]       = useState('');

  const handleLogout = () => { authService.logout(); history.push('/tramites'); };

  useEffect(() => { cargarDetalle(); }, [id]);

  const cargarDetalle = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/tramites/detalle/${id}`
      );
      const data = await response.json();
      if (data.ok) {
        setTramite(data.tramite);
        setEditPatente(data.tramite.patente || '');
        setEditMarca(data.tramite.marca || '');
        setEditModelo(data.tramite.modelo || '');
        setEditAnio(data.tramite.anio || '');
      } else throw new Error(data.error);
    } catch (error) {
      presentToast({ message: 'Error al cargar el detalle', duration: 3000, color: 'danger' });
      history.goBack();
    } finally {
      setCargando(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0)
      setArchivoSeleccionado(event.target.files[0]);
  };

  const enviarCorreccion = async () => {
    if (!editPatente || !editMarca || !editModelo || !editAnio) {
      presentToast({ message: 'Todos los campos de texto son obligatorios', duration: 3000, color: 'warning' });
      return;
    }
    setProcesando(true);
    const formData = new FormData();
    formData.append('patente', editPatente);
    formData.append('marca', editMarca);
    formData.append('modelo', editModelo);
    formData.append('anio', editAnio);
    if (archivoSeleccionado) formData.append('documento', archivoSeleccionado);
    try {
      const response = await fetch(
        `http://localhost:3000/api/tramites/${id}/corregir`,
        { method: 'PUT', body: formData }
      );
      const data = await response.json();
      if (data.ok) {
        presentToast({ message: 'Corrección enviada con éxito', duration: 3000, color: 'success' });
        history.push('/mis-tramites');
      } else throw new Error(data.error);
    } catch (error) {
      presentToast({ message: 'Error al enviar la corrección', duration: 3000, color: 'danger' });
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) return (
    <IonPage>
      <IonContent style={{ '--background': '#001830' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <IonSpinner name="crescent" style={{ color: '#fff' }} />
        </div>
      </IonContent>
    </IonPage>
  );

  if (!tramite) return null;

  const requiereModificacion = tramite.estado === 'observado' || tramite.estado === 'requiere modificación';

  const getEstadoConfig = (estado: string) => {
    switch ((estado || '').toLowerCase()) {
      case 'aprobado': case 'completado':
        return { label: 'Completado', color: '#4cde80', bg: 'rgba(76,222,128,0.12)' };
      case 'rechazado':
        return { label: 'Rechazado', color: '#ff5c5c', bg: 'rgba(255,92,92,0.12)' };
      case 'pendiente':
        return { label: 'Pendiente', color: '#f0a500', bg: 'rgba(240,165,0,0.12)' };
      case 'observado': case 'requiere modificación':
        return { label: 'Requiere Corrección', color: '#ffcc00', bg: 'rgba(255,204,0,0.12)' };
      default:
        return { label: estado || 'En Revisión', color: '#5bb8ff', bg: 'rgba(91,184,255,0.12)' };
    }
  };

  const estadoCfg = getEstadoConfig(tramite.estado);

  return (
    <IonPage>
      <IonContent scrollY={true} style={{ '--background': '#001830' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          * { box-sizing: border-box; }

          .dt-root {
            display: flex; min-height: 100vh;
            font-family: 'Inter', sans-serif; background: #001830;
          }

          /* ── SIDEBAR ── */
          .dt-sidebar {
            width: 200px; flex-shrink: 0; background: #002050;
            display: flex; flex-direction: column; align-items: flex-start;
            padding: 20px 12px; gap: 4px;
            position: sticky; top: 0; height: 100vh;
          }
          .dt-sidebar-logo { width: 90px; margin-bottom: 24px; filter: brightness(0) invert(1); }
          .dt-nav-btn {
            --background: transparent; --background-hover: rgba(255,255,255,0.10);
            --color: rgba(255,255,255,0.75); --border-radius: 8px;
            --padding-start: 10px; --padding-end: 10px;
            --padding-top: 10px; --padding-bottom: 10px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.88rem; font-weight: 500; width: 100%; margin: 0; justify-content: flex-start;
          }
          .dt-nav-btn.active-nav { --background: rgba(255,255,255,0.14); --color: #fff; font-weight: 700; }
          .dt-nav-icon { width: 20px; height: 20px; margin-right: 10px; flex-shrink: 0; filter: brightness(0) invert(1); opacity: 0.80; }
          .dt-sidebar-spacer { flex: 1; }
          .dt-nav-logout {
            --background: transparent; --background-hover: rgba(255,255,255,0.08);
            --color: rgba(255,255,255,0.55); --border-radius: 8px;
            --padding-start: 10px; --padding-end: 10px;
            --padding-top: 10px; --padding-bottom: 10px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.88rem; font-weight: 500; width: 100%; margin: 0; justify-content: flex-start;
          }

          /* ── COLUMNA DERECHA ── */
          .dt-right { flex: 1; display: flex; flex-direction: column; min-width: 0; }

          /* ── HEADER ── */
          .dt-header {
            position: relative; min-height: 200px;
            background-image: url('${ASSETS.fondo}');
            background-size: cover; background-position: center center; background-repeat: no-repeat;
            display: flex; align-items: flex-end; padding: 24px 28px;
          }
          .dt-header::after { content: ''; position: absolute; inset: 0; background: rgba(0,10,40,0.55); }
          .dt-header-content { position: relative; z-index: 2; flex: 1; }
          .dt-header-content h1 { font-size: 1.8rem; font-weight: 700; color: #fff; margin: 0 0 2px; font-family: 'Inter', sans-serif; }
          .dt-header-content p  { font-size: 0.85rem; font-weight: 300; color: rgba(255,255,255,0.70); margin: 0; font-family: 'Inter', sans-serif; }
          .dt-photo-area { position: absolute; top: 16px; right: 20px; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 8px; }
          .dt-photo-box  { width: 110px; height: 110px; background: #c0c8d0; border-radius: 10px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
          .dt-photo-box img { width: 80px; height: 80px; opacity: 0.6; }
          .dt-photo-btn  {
            --background: #002050; --background-hover: #003080; --color: #fff; --border-radius: 8px;
            --padding-start: 10px; --padding-end: 10px; --padding-top: 6px; --padding-bottom: 6px;
            text-transform: none; font-family: 'Inter', sans-serif; font-size: 0.78rem; font-weight: 500; width: 110px; margin: 0;
          }
          .dt-photo-btn img { width: 14px; height: 14px; margin-right: 6px; filter: brightness(0) invert(1); }

          /* ── CONTENIDO ── */
          .dt-content { background: #001830; padding: 28px 32px; flex: 1; }

          /* Botón volver */
          .btn-volver {
            --background: transparent; --background-hover: rgba(255,255,255,0.08);
            --color: rgba(255,255,255,0.65);
            --border-color: rgba(255,255,255,0.20); --border-width: 1px; --border-style: solid;
            --border-radius: 8px; --padding-start: 14px; --padding-end: 14px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.88rem; font-weight: 500; margin: 0 0 20px;
          }

          /* Card principal */
          .dt-card {
            background: #002050; border: 1px solid #003070;
            border-radius: 14px; overflow: hidden; margin-bottom: 20px;
          }
          .dt-card-header {
            padding: 20px 24px; background: #003060;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
          }
          .dt-card-header h2 {
            font-size: 1.2rem; font-weight: 700; color: #fff; margin: 0;
            font-family: 'Inter', sans-serif;
          }
          .dt-estado-badge {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 6px 14px; border-radius: 20px;
            font-size: 0.82rem; font-weight: 600; font-family: 'Inter', sans-serif;
          }
          .dt-card-body { padding: 24px; }

          /* Sección datos */
          .dt-seccion-titulo {
            font-size: 0.78rem; font-weight: 700; color: rgba(255,255,255,0.45);
            text-transform: uppercase; letter-spacing: 1px;
            margin: 0 0 14px; font-family: 'Inter', sans-serif;
            padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.06);
          }
          .dt-dato-row {
            display: flex; align-items: baseline; gap: 8px; margin-bottom: 10px;
          }
          .dt-dato-label {
            font-size: 0.82rem; font-weight: 600; color: rgba(255,255,255,0.50);
            font-family: 'Inter', sans-serif; min-width: 110px; flex-shrink: 0;
          }
          .dt-dato-valor {
            font-size: 0.92rem; font-weight: 500; color: #fff;
            font-family: 'Inter', sans-serif;
          }
          .dt-patente-badge {
            display: inline-block; background: #003060; border: 1px solid #005090;
            border-radius: 6px; padding: 3px 10px;
            font-size: 0.88rem; font-weight: 700; color: #fff;
            font-family: 'Inter', sans-serif; letter-spacing: 1px;
          }

          /* Observación */
          .dt-obs-box {
            background: rgba(255,204,0,0.08); border: 1px solid rgba(255,204,0,0.30);
            border-left: 4px solid #ffcc00; border-radius: 10px;
            padding: 16px 20px; margin-bottom: 20px;
          }
          .dt-obs-box h3 { font-size: 0.92rem; font-weight: 700; color: #ffcc00; margin: 0 0 6px; font-family: 'Inter', sans-serif; }
          .dt-obs-box p  { font-size: 0.85rem; color: rgba(255,204,0,0.80); margin: 0; font-family: 'Inter', sans-serif; line-height: 1.5; }
          .dt-obs-box small { font-size: 0.78rem; color: rgba(255,204,0,0.55); font-style: italic; margin-top: 8px; display: block; }

          /* IonItem oscuro para edición */
          .dt-edit-item {
            --background: #001830; --border-color: #003070;
            --border-radius: 8px; --border-style: solid; --border-width: 1px;
            --color: #fff; --padding-start: 12px; --inner-padding-end: 12px;
            --highlight-color-focused: #5bb8ff;
            border-radius: 8px; margin-bottom: 10px;
          }
          .dt-edit-item ion-label { color: rgba(255,255,255,0.55) !important; font-family: 'Inter', sans-serif !important; font-size: 0.78rem !important; }
          .dt-edit-item ion-input { --color: #fff; --placeholder-color: rgba(255,255,255,0.25); font-family: 'Inter', sans-serif; }

          /* Botones acción */
          .btn-ver-doc {
            --background: transparent; --background-hover: rgba(91,184,255,0.10);
            --color: #5bb8ff;
            --border-color: #5bb8ff; --border-width: 1px; --border-style: solid;
            --border-radius: 8px; --padding-start: 20px; --padding-end: 20px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.88rem; font-weight: 500; margin: 0;
          }
          .btn-subir-doc {
            --background: transparent; --background-hover: rgba(255,255,255,0.06);
            --color: rgba(255,255,255,0.70);
            --border-color: rgba(255,255,255,0.25); --border-width: 1px; --border-style: solid;
            --border-radius: 8px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.88rem; font-weight: 500; margin: 0; width: 100%;
          }
          .btn-enviar {
            --background: #1a7a3e; --background-hover: #22a050; --color: #fff;
            --border-radius: 8px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.92rem; font-weight: 600; margin: 0; width: 100%;
          }
          .dt-divider {
            height: 1px; background: rgba(255,255,255,0.06); margin: 20px 0;
          }

          /* ── FOOTER ── */
          .dt-footer {
            background: #003060; border-top: 1px solid rgba(255,255,255,0.10);
            padding: 28px 36px 16px;
            display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px;
          }
          .dt-footer-block { display: flex; flex-direction: column; gap: 4px; font-family: 'Inter', sans-serif; }
          .dt-footer-block strong { color: #fff; font-size: 1rem; font-weight: 700; }
          .dt-footer-block span   { color: rgba(255,255,255,0.75); font-size: 0.88rem; font-weight: 300; }
          .dt-footer-icon-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
          .dt-footer-icon-row img { width: 22px; height: 22px; }
          .dt-footer-divider { width: 1px; background: rgba(255,255,255,0.20); align-self: stretch; }
          .dt-footer-copy { text-align: center; color: rgba(255,255,255,0.35); font-size: 0.75rem; font-weight: 300; padding: 12px 0 8px; background: #003060; font-family: 'Inter', sans-serif; }

          /* Bottom nav móvil */
          .dt-bottom-nav { display: none; }

          /* ══════════════ MÓVIL ══════════════ */
          @media (max-width: 600px) and (orientation: portrait) {
            .dt-root { flex-direction: column; }
            .dt-sidebar { display: none; }
            .dt-header { min-height: 150px; padding: 16px; }
            .dt-header-content h1 { font-size: 1.4rem; }
            .dt-photo-area { top: 10px; right: 12px; }
            .dt-photo-box { width: 80px; height: 80px; }
            .dt-photo-box img { width: 55px; height: 55px; }
            .dt-photo-btn { width: 80px; font-size: 0.72rem; }
            .dt-content { padding: 16px 14px; }
            .dt-card-header { flex-direction: column; align-items: flex-start; }
            .dt-footer { flex-direction: column; padding: 20px 20px 12px; gap: 16px; }
            .dt-footer-divider { display: none; }
            .dt-bottom-nav {
              display: flex; justify-content: space-around;
              background: #003060; border-top: 1px solid rgba(255,255,255,0.15);
              padding: 10px 4px 14px; position: sticky; bottom: 0; z-index: 20; width: 100%; gap: 2px;
            }
            .dt-bottom-btn {
              --background: transparent; --color: rgba(255,255,255,0.70);
              --border-radius: 8px; text-transform: none; font-family: 'Inter', sans-serif;
              font-size: 0.65rem; font-weight: 500; flex: 1; margin: 0;
            }
            .dt-bottom-btn.active-nav { --color: #fff; }
            .dt-bottom-icon { width: 22px; height: 22px; filter: brightness(0) invert(1); opacity: 0.75; display: block; margin: 0 auto 3px; }
          }
        `}</style>

        <div className="dt-root">

          {/* SIDEBAR */}
          <div className="dt-sidebar">
            <img className="dt-sidebar-logo" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />
            <IonButton className="dt-nav-btn" fill="clear" onClick={() => history.push('/profile')}>
              <img className="dt-nav-icon" src={ASSETS.perfilBlanco} alt="" />Mi perfil
            </IonButton>
            <IonButton className="dt-nav-btn active-nav" fill="clear" onClick={() => history.push('/mis-tramites')}>
              <img className="dt-nav-icon" src={ASSETS.tramite} alt="" />Mis trámites
            </IonButton>
            <IonButton className="dt-nav-btn" fill="clear" onClick={() => history.push('/mis-agendas')}>
              <img className="dt-nav-icon" src={ASSETS.calendario} alt="" />Mis agendas
            </IonButton>
            <div className="dt-sidebar-spacer" />
            <IonButton className="dt-nav-logout" fill="clear" onClick={handleLogout}>
              <img className="dt-nav-icon" src={ASSETS.puerta} alt="" />Cerrar sesión
            </IonButton>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="dt-right">

            {/* Header */}
            <div className="dt-header">
              <div className="dt-header-content">
                <h1>Detalle Solicitud #{tramite.solicitud_id}</h1>
                <p>Revisa el estado y los datos de tu trámite</p>
              </div>
              <div className="dt-photo-area">
                <div className="dt-photo-box">
                  <img src={ASSETS.usuarioGris} alt="Foto perfil" />
                </div>
                <ConstructionAlert>
                  <IonButton className="dt-photo-btn" fill="clear">
                    <img src={ASSETS.camara} alt="" />Agregar foto
                  </IonButton>
                </ConstructionAlert>
              </div>
            </div>

            {/* Contenido */}
            <div className="dt-content">

              {/* Botón volver */}
              <IonButton className="btn-volver" fill="outline" onClick={() => history.push('/mis-tramites')}>
                <IonIcon slot="start" icon={arrowBackOutline} />
                Volver a Mis Trámites
              </IonButton>

              {/* Card detalle */}
              <div className="dt-card">

                {/* Header card */}
                <div className="dt-card-header">
                  <h2>{tramite.nombre_tramite}</h2>
                  <span
                    className="dt-estado-badge"
                    style={{ background: estadoCfg.bg, color: estadoCfg.color, border: `1px solid ${estadoCfg.color}55` }}
                  >
                    {estadoCfg.label}
                  </span>
                </div>

                <div className="dt-card-body">

                  {/* Mensaje observación */}
                  {requiereModificacion && (
                    <div className="dt-obs-box">
                      <h3>Se requieren modificaciones</h3>
                      <p><strong>Mensaje del Admin:</strong> {tramite.observacion}</p>
                      <small>* Puedes corregir los datos del vehículo a continuación o subir un nuevo documento si fue solicitado.</small>
                    </div>
                  )}

                  {/* Datos del vehículo */}
                  <p className="dt-seccion-titulo">Datos del Vehículo</p>

                  {requiereModificacion ? (
                    /* Vista edición */
                    <IonGrid style={{ padding: 0 }}>
                      <IonRow>
                        <IonCol size="12" sizeMd="6">
                          <IonItem lines="full" className="dt-edit-item">
                            <IonLabel position="stacked">Patente</IonLabel>
                            <IonInput value={editPatente} onIonChange={e => setEditPatente(e.detail.value!)} />
                          </IonItem>
                        </IonCol>
                        <IonCol size="12" sizeMd="6">
                          <IonItem lines="full" className="dt-edit-item">
                            <IonLabel position="stacked">Marca</IonLabel>
                            <IonInput value={editMarca} onIonChange={e => setEditMarca(e.detail.value!)} />
                          </IonItem>
                        </IonCol>
                        <IonCol size="12" sizeMd="6">
                          <IonItem lines="full" className="dt-edit-item">
                            <IonLabel position="stacked">Modelo</IonLabel>
                            <IonInput value={editModelo} onIonChange={e => setEditModelo(e.detail.value!)} />
                          </IonItem>
                        </IonCol>
                        <IonCol size="12" sizeMd="6">
                          <IonItem lines="full" className="dt-edit-item">
                            <IonLabel position="stacked">Año</IonLabel>
                            <IonInput type="number" value={editAnio} onIonChange={e => setEditAnio(e.detail.value!)} />
                          </IonItem>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  ) : (
                    /* Vista solo lectura */
                    <>
                      <div className="dt-dato-row">
                        <span className="dt-dato-label">Patente</span>
                        <span className="dt-patente-badge">{tramite.patente}</span>
                      </div>
                      <div className="dt-dato-row">
                        <span className="dt-dato-label">Marca / Modelo</span>
                        <span className="dt-dato-valor">{tramite.marca} – {tramite.modelo}</span>
                      </div>
                      <div className="dt-dato-row">
                        <span className="dt-dato-label">Año</span>
                        <span className="dt-dato-valor">{tramite.anio}</span>
                      </div>
                    </>
                  )}

                  <div className="dt-divider" />

                  {/* Ver documento actual */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: requiereModificacion ? 20 : 0 }}>
                    <IonButton
                      className="btn-ver-doc"
                      fill="outline"
                      onClick={() => window.open(tramite.url_revision_tecnica, '_blank')}
                    >
                      <IonIcon slot="start" icon={documentOutline} />
                      Ver Documento Actual
                    </IonButton>
                  </div>

                  {/* Zona corrección */}
                  {requiereModificacion && (
                    <>
                      <input
                        type="file" accept="image/*,.pdf"
                        ref={fileInputRef} onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                      <IonButton
                        className="btn-subir-doc"
                        fill="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <IonIcon slot="start" icon={cloudUploadOutline} />
                        {archivoSeleccionado ? archivoSeleccionado.name : 'Subir nuevo documento (Opcional)'}
                      </IonButton>

                      <div style={{ marginTop: 12 }}>
                        <IonButton
                          className="btn-enviar"
                          disabled={procesando}
                          onClick={enviarCorreccion}
                        >
                          {procesando
                            ? <IonSpinner name="dots" />
                            : <><IonIcon slot="start" icon={saveOutline} /> Guardar y Enviar Corrección</>
                          }
                        </IonButton>
                      </div>
                    </>
                  )}

                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="dt-footer">
              <div className="dt-footer-block">
                <div className="dt-footer-icon-row"><img src={ASSETS.ubicacion} alt="" /><strong>Dirección</strong></div>
                <span>Avenida Santa Teresa N°1.</span>
                <span>Santo Domingo, Chile</span>
              </div>
              <div className="dt-footer-divider" />
              <div className="dt-footer-block">
                <div className="dt-footer-icon-row"><img src={ASSETS.phone} alt="" /><strong>Emergencias 24 horas:</strong></div>
                <span>+563 2238 1603 • +563 5220 4200</span>
                <span>Seguridad: 1458 • contacto@santodomingo.cl</span>
              </div>
              <div className="dt-footer-divider" />
              <div className="dt-footer-block">
                <div className="dt-footer-icon-row"><img src={ASSETS.reloj} alt="" /><strong>Horario</strong></div>
                <span>Lunes a Viernes: 08:45am a 14:00 pm</span>
                <span>Sábado: 09:30am a 13:30pm</span>
              </div>
            </div>
            <div className="dt-footer-copy">
              ©2026 Municipalidad de Santo Domingo &nbsp;•&nbsp; Política de Privacidad
            </div>

            {/* Bottom nav móvil */}
            <div className="dt-bottom-nav">
              <IonButton className="dt-bottom-btn" fill="clear" onClick={() => history.push('/profile')}>
                <img className="dt-bottom-icon" src={ASSETS.perfilBlanco} alt="" />Mi perfil
              </IonButton>
              <IonButton className="dt-bottom-btn active-nav" fill="clear" onClick={() => history.push('/mis-tramites')}>
                <img className="dt-bottom-icon" src={ASSETS.tramite} alt="" />Mis trámites
              </IonButton>
              <IonButton className="dt-bottom-btn" fill="clear" onClick={() => history.push('/mis-agendas')}>
                <img className="dt-bottom-icon" src={ASSETS.calendario} alt="" />Mis agendas
              </IonButton>
              <IonButton className="dt-bottom-btn" fill="clear" onClick={handleLogout}>
                <img className="dt-bottom-icon" src={ASSETS.puerta} alt="" />Cerrar sesión
              </IonButton>
            </div>

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
