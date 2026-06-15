import React, { useState, useEffect, useMemo } from 'react';
import {
  IonPage, IonContent, IonButton, IonSpinner,
  useIonToast, IonIcon
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  documentOutline, checkmarkCircleOutline, closeCircleOutline,
  eyeOutline, warningOutline, searchOutline
} from 'ionicons/icons';
import { authService } from '../services/authService';

const ASSETS = {
  fondo:  'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/FondoSantoDomigno.png',
  logo:   'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/LogoSantoDomingoAzul.png',
  puerta: 'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PuertaSalir.png',
};

const POR_PAG = 2;

export default function ValidarResidencias() {
  const history = useHistory();
  const [presentToast] = useIonToast();
  const [usuarios, setUsuarios]       = useState<any[]>([]);
  const [cargando, setCargando]       = useState(true);
  const [nombreAdmin, setNombreAdmin] = useState('');

  // Filtros
  const [tabActiva, setTabActiva]   = useState<'pendiente' | 'aprobado' | 'rechazado'>('pendiente');
  const [busqueda, setBusqueda]     = useState('');
  const [pagina, setPagina]         = useState(1);

  // ── Lógica original intacta ──
  useEffect(() => {
    const sessionData = localStorage.getItem('user_session');
    if (!sessionData) { history.push('/login-funcionario'); return; }
    const userObj = JSON.parse(sessionData);
    const user = Array.isArray(userObj) ? userObj[0] : userObj;
    if (user.rol !== 'funcionario') { history.replace('/tramites-user'); return; }
    setNombreAdmin(`${user.nombres} ${user.apellidoP}`);
  }, [history]);

  useEffect(() => { cargarPendientes(); }, []);

  const cargarPendientes = async () => {
    try {
      setCargando(true);
      const response = await fetch(
        'https://tramitessantodomingo-production-5cb4.up.railway.app/api/admin/residencias-pendientes'
      );
      const data = await response.json();
      if (data.ok) setUsuarios(data.usuarios);
    } catch (error) {
      presentToast({ message: 'Error al cargar la lista', duration: 3000, color: 'danger' });
    } finally {
      setCargando(false);
    }
  };

  const procesarSolicitud = async (id: number, accion: 'aprobar' | 'rechazar') => {
    try {
      const url = `https://tramitessantodomingo-production-5cb4.up.railway.app/api/admin/residencias/${accion}/${id}`;
      const response = await fetch(url, { method: 'PUT' });
      const data = await response.json();
      if (data.ok) {
        presentToast({
          message: accion === 'aprobar' ? 'Residencia Aprobada' : 'Residencia Rechazada',
          duration: 3000,
          color: accion === 'aprobar' ? 'success' : 'warning'
        });
        cargarPendientes();
      }
    } catch (error) {
      presentToast({ message: 'Error de conexión con el servidor', duration: 3000, color: 'danger' });
    }
  };

  const handleCerrarSesion = () => { authService.logout(); history.push('/login-funcionario'); };

  // Filtrado por tab + búsqueda
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(u => {
      const estadoMatch = (u.estado_residencia || 'pendiente').toLowerCase() === tabActiva;
      const q = busqueda.toLowerCase();
      const busquedaMatch = q
        ? (`${u.nombres} ${u.apellido_p} ${u.apellido_m}`.toLowerCase().includes(q) ||
           (u.rut || '').toLowerCase().includes(q) ||
           (u.correo || '').toLowerCase().includes(q))
        : true;
      return estadoMatch && busquedaMatch;
    });
  }, [usuarios, tabActiva, busqueda]);

  const totalPags   = Math.max(1, Math.ceil(usuariosFiltrados.length / POR_PAG));
  const usuariosPag = usuariosFiltrados.slice((pagina - 1) * POR_PAG, pagina * POR_PAG);

  const handleTab = (tab: 'pendiente' | 'aprobado' | 'rechazado') => {
    setTabActiva(tab);
    setPagina(1);
  };

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': '#f0f2f5' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          * { box-sizing: border-box; }

          .vr-root {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            display: flex; flex-direction: row;
            font-family: 'Inter', sans-serif;
            background: #f0f2f5; overflow: hidden;
          }

          /* SIDEBAR */
          .vr-sidebar {
            width: 200px; flex-shrink: 0; background: #002050;
            display: flex; flex-direction: column;
            align-items: center; padding: 28px 16px 24px; height: 100%;
          }
          .vr-sidebar-logo { width: 120px; filter: brightness(0) invert(1); }

          /* COLUMNA DERECHA */
          .vr-right { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow-y: auto; }

          /* HEADER */
          .vr-header {
            flex-shrink: 0; position: relative; min-height: 130px;
            background-image: url('${ASSETS.fondo}');
            background-size: cover; background-position: center;
            display: flex; align-items: center;
            padding: 20px 32px; justify-content: space-between;
            gap: 16px; flex-wrap: wrap;
          }
          .vr-header::after { content: ''; position: absolute; inset: 0; background: rgba(0,10,40,0.58); }
          .vr-header-texts { position: relative; z-index: 2; }
          .vr-header-texts h1 {
            font-size: 2.2rem; font-weight: 800; color: #fff;
            margin: 0 0 4px; font-family: 'Inter', sans-serif; line-height: 1;
          }
          .vr-header-texts .bienvenido {
            font-size: 0.82rem; color: rgba(255,255,255,0.80); margin: 0 0 1px;
            font-family: 'Inter', sans-serif;
          }
          .vr-header-texts .bienvenido strong { font-weight: 600; font-style: italic; color: #fff; }
          .vr-header-texts .subtitulo {
            font-size: 0.76rem; font-weight: 600;
            color: rgba(255,255,255,0.65); margin: 0; font-family: 'Inter', sans-serif;
          }
          .vr-header-btns {
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
          .vr-btn-icon { width: 16px; height: 16px; filter: brightness(0) invert(1); margin-right: 6px; }

          /* CONTENIDO */
          .vr-main { padding: 28px 40px; flex: 1; }
          .vr-page-titulo {
            font-size: 1.9rem; font-weight: 800; color: #003060;
            margin: 0 0 4px; font-family: 'Inter', sans-serif;
          }
          .vr-page-subtitulo {
            font-size: 0.85rem; color: #6b7280; margin: 0 0 24px;
            font-family: 'Inter', sans-serif;
          }

          /* Panel principal */
          .vr-panel {
            background: #fff; border: 1px solid #e0e7ef;
            border-radius: 16px; overflow: hidden;
          }

          /* Barra tabs + búsqueda */
          .vr-topbar {
            display: flex; align-items: center; justify-content: space-between;
            padding: 16px 20px; border-bottom: 1px solid #f0f2f5; flex-wrap: wrap; gap: 12px;
          }
          .vr-tabs { display: flex; gap: 4px; }
          .btn-tab {
            --background: transparent; --background-hover: rgba(0,48,96,0.06);
            --border-radius: 6px; --padding-start: 14px; --padding-end: 14px;
            --padding-top: 7px; --padding-bottom: 7px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.85rem; font-weight: 500; margin: 0;
            --color: #6b7280;
          }
          .btn-tab.activa {
            --color: #003060; font-weight: 700;
            border-bottom: 2px solid #003060;
          }
          .vr-search-wrap {
            display: flex; align-items: center;
            border: 1px solid #d0d8e4; border-radius: 8px;
            background: #f7f9fc; padding: 0 12px; height: 38px; min-width: 280px;
          }
          .vr-search-wrap ion-icon { color: #9ca3af; font-size: 1rem; margin-right: 8px; flex-shrink: 0; }
          .vr-search-input {
            flex: 1; border: none; background: transparent;
            font-family: 'Inter', sans-serif; font-size: 0.85rem; color: #003060; outline: none;
          }
          .vr-search-input::placeholder { color: #b0b8c4; }

          /* Fila de solicitud */
          .vr-fila {
            padding: 20px 20px 0; border-bottom: 1px solid #f0f2f5;
          }
          .vr-fila:last-child { border-bottom: none; }

          .vr-fila-top {
            display: grid; grid-template-columns: 2fr 1.2fr 1.4fr;
            gap: 0; align-items: start; margin-bottom: 16px;
          }
          .vr-col-sep {
            border-left: 1px solid #e0e7ef; padding-left: 20px;
          }

          .vr-nombre {
            font-size: 0.95rem; font-weight: 700; color: #003060;
            margin: 0 0 4px; font-family: 'Inter', sans-serif;
          }
          .vr-dato {
            font-size: 0.80rem; color: #6b7280;
            margin: 0 0 2px; font-family: 'Inter', sans-serif;
          }
          .vr-dato strong { color: #1a73c8; font-weight: 500; }

          .vr-col-label {
            font-size: 0.80rem; font-weight: 700; color: #003060;
            margin: 0 0 4px; font-family: 'Inter', sans-serif;
          }
          .vr-col-value {
            font-size: 0.82rem; color: #6b7280;
            margin: 0 0 2px; font-family: 'Inter', sans-serif;
          }

          /* Documento */
          .vr-col-doc { padding-left: 20px; border-left: 1px solid #e0e7ef; }
          .btn-ver-doc {
            --background: transparent; --background-hover: rgba(0,48,96,0.06);
            --color: #6b7280;
            --border-color: #d0d8e4; --border-width: 1px; --border-style: solid;
            --border-radius: 8px; --padding-start: 12px; --padding-end: 12px;
            --padding-top: 7px; --padding-bottom: 7px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.80rem; font-weight: 500; margin: 24px 0 0;
          }

          /* Aviso */
          .vr-aviso {
            display: flex; align-items: center; gap: 8px;
            background: #fffbeb; border: 1px solid #fde68a;
            border-radius: 8px; padding: 10px 14px; margin-bottom: 14px;
          }
          .vr-aviso ion-icon { color: #d97706; font-size: 1rem; flex-shrink: 0; }
          .vr-aviso span {
            font-size: 0.78rem; color: #92400e; font-family: 'Inter', sans-serif;
          }

          /* Botones acción */
          .vr-acciones { display: flex; gap: 10px; margin-bottom: 20px; justify-content: flex-end; }
          .btn-rechazar {
            --background: #fef0f0; --background-hover: #fde4e4; --color: #c0392b;
            --border-color: #f5c6c6; --border-width: 1.5px; --border-style: solid;
            --border-radius: 10px; --padding-start: 24px; --padding-end: 24px;
            --padding-top: 11px; --padding-bottom: 11px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.88rem; font-weight: 600; margin: 0; min-width: 130px;
          }
          .btn-aprobar {
            --background: #f0fff5; --background-hover: #dcfce7; --color: #27ae60;
            --border-color: #b7e9c8; --border-width: 1.5px; --border-style: solid;
            --border-radius: 10px; --padding-start: 24px; --padding-end: 24px;
            --padding-top: 11px; --padding-bottom: 11px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.88rem; font-weight: 600; margin: 0; min-width: 130px;
          }

          /* Vacío / cargando */
          .vr-vacio {
            padding: 60px 20px; text-align: center; color: #6b7280;
            font-family: 'Inter', sans-serif;
          }
          .vr-vacio h3 { font-size: 1rem; font-weight: 600; margin: 0 0 6px; color: #374151; }
          .vr-vacio p  { font-size: 0.85rem; margin: 0; }

          /* Paginación */
          .vr-paginacion {
            display: flex; justify-content: space-between; align-items: center;
            padding: 14px 20px; border-top: 1px solid #f0f2f5;
          }
          .vr-pag-info { font-size: 0.78rem; color: #9ca3af; font-family: 'Inter', sans-serif; }
          .vr-pag-btns { display: flex; gap: 4px; }
          .btn-pag {
            --background: transparent; --background-hover: rgba(0,48,96,0.08);
            --color: #6b7280;
            --border-width: 1px; --border-style: solid; --border-color: #e0e7ef;
            --border-radius: 6px; --padding-start: 8px; --padding-end: 8px;
            --padding-top: 4px; --padding-bottom: 4px;
            margin: 0; height: 30px; min-width: 30px;
            font-family: 'Inter', sans-serif; font-size: 0.78rem; text-transform: none;
          }
          .btn-pag.activa { --background: #003060; --color: #fff; --border-color: #003060; }

          /* MÓVIL */
          @media (max-width: 600px) {
            .vr-root { flex-direction: column; overflow-y: auto; }
            .vr-sidebar { display: none; }
            .vr-right { overflow-y: unset; }
            .vr-header { min-height: 110px; padding: 14px 16px; }
            .vr-header-texts h1 { font-size: 1.5rem; }
            .vr-main { padding: 16px 12px; }
            .vr-topbar { flex-direction: column; align-items: flex-start; }
            .vr-search-wrap { min-width: unset; width: 100%; }
            .vr-fila-top { grid-template-columns: 1fr; gap: 12px; }
            .vr-col-sep { border-left: none; padding-left: 0; border-top: 1px solid #e0e7ef; padding-top: 12px; }
            .vr-col-doc { border-left: none; padding-left: 0; border-top: 1px solid #e0e7ef; padding-top: 12px; }
            .vr-acciones { justify-content: stretch; }
            .btn-rechazar, .btn-aprobar { flex: 1; }
            .vr-paginacion { flex-direction: column; gap: 10px; }
          }
        `}</style>

        <div className="vr-root">

          {/* SIDEBAR */}
          <div className="vr-sidebar">
            <img className="vr-sidebar-logo" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />
          </div>

          {/* COLUMNA DERECHA */}
          <div className="vr-right">

            {/* HEADER */}
            <div className="vr-header">
              <div className="vr-header-texts">
                <h1>Administrador</h1>
                <p className="bienvenido">Bienvenido, <strong>{nombreAdmin || 'Cargando...'}</strong></p>
                <p className="subtitulo">Gestiona y administra los trámites y servicios municipales</p>
              </div>
              <div className="vr-header-btns">
                <IonButton className="btn-cerrar" onClick={handleCerrarSesion}>
                  <img className="vr-btn-icon" src={ASSETS.puerta} alt="" />
                  Cerrar sesión
                </IonButton>
                <IonButton className="btn-volver" onClick={() => history.push('/admin-dashboard')}>
                  ← Volver
                </IonButton>
              </div>
            </div>

            {/* CONTENIDO */}
            <div className="vr-main">
              <p className="vr-page-titulo">Confirmaciones residencia</p>
              <p className="vr-page-subtitulo">
                Revisa y valida las solicitudes de confirmación de residencia enviadas por los ciudadanos
              </p>

              <div className="vr-panel">

                {/* Tabs + búsqueda */}
                <div className="vr-topbar">
                  <div className="vr-tabs">
                    {(['pendiente', 'aprobado', 'rechazado'] as const).map(tab => (
                      <IonButton
                        key={tab}
                        className={`btn-tab${tabActiva === tab ? ' activa' : ''}`}
                        fill="clear"
                        onClick={() => handleTab(tab)}
                      >
                        {tab === 'pendiente' ? 'Pendientes' : tab === 'aprobado' ? 'Aprobadas' : 'Rechazadas'}
                      </IonButton>
                    ))}
                  </div>
                  <div className="vr-search-wrap">
                    <IonIcon icon={searchOutline} />
                    <input
                      className="vr-search-input"
                      placeholder="Buscar por nombre, RUT o correo"
                      value={busqueda}
                      onChange={e => { setBusqueda(e.target.value); setPagina(1); }}
                    />
                  </div>
                </div>

                {/* Lista */}
                {cargando ? (
                  <div className="vr-vacio"><IonSpinner name="crescent" /></div>
                ) : usuariosFiltrados.length === 0 ? (
                  <div className="vr-vacio">
                    <h3>No hay solicitudes {tabActiva === 'pendiente' ? 'pendientes' : tabActiva === 'aprobado' ? 'aprobadas' : 'rechazadas'}</h3>
                    <p>{tabActiva === 'pendiente' ? 'Todos los documentos han sido revisados.' : 'No hay registros en esta categoría.'}</p>
                  </div>
                ) : (
                  <>
                    {usuariosPag.map((user) => {
                      const fecha = user.fecha_solicitud
                        ? new Date(user.fecha_solicitud).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
                        : 'Sin fecha';
                      const hora = user.fecha_solicitud
                        ? new Date(user.fecha_solicitud).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
                        : '';

                      return (
                        <div key={user.id} className="vr-fila">
                          {/* Fila superior: datos / fecha / documento */}
                          <div className="vr-fila-top">

                            {/* Datos solicitante */}
                            <div>
                              <p className="vr-nombre">{user.nombres} {user.apellido_p} {user.apellido_m}</p>
                              <p className="vr-dato">RUT: <strong>{user.rut}</strong></p>
                              <p className="vr-dato">Correo: {user.correo}</p>
                            </div>

                            {/* Fecha */}
                            <div className="vr-col-sep">
                              <p className="vr-col-label">Fecha de solicitud</p>
                              <p className="vr-col-value">{fecha}</p>
                              {hora && <p className="vr-col-value">{hora} hrs</p>}
                            </div>

                            {/* Documento */}
                            <div className="vr-col-doc">
                              <p className="vr-col-label">Documento adjunto</p>
                              <p className="vr-col-value">1 archivo</p>
                              <IonButton
                                className="btn-ver-doc"
                                fill="outline"
                                onClick={() => window.open(user.url_residencia, '_blank')}
                              >
                                <IonIcon slot="start" icon={eyeOutline} />
                                Ver documento
                              </IonButton>
                            </div>
                          </div>

                          {/* Aviso + botones solo si está pendiente */}
                          {tabActiva === 'pendiente' && (
                            <>
                              <div className="vr-aviso">
                                <IonIcon icon={warningOutline} />
                                <span>Revisa el documento adjunto antes de aprobar o rechazar la solicitud</span>
                              </div>
                              <div className="vr-acciones">
                                <IonButton
                                  className="btn-rechazar"
                                  fill="solid"
                                  onClick={() => procesarSolicitud(user.id, 'rechazar')}
                                >
                                  <IonIcon slot="start" icon={closeCircleOutline} />
                                  Rechazar
                                </IonButton>
                                <IonButton
                                  className="btn-aprobar"
                                  fill="solid"
                                  onClick={() => procesarSolicitud(user.id, 'aprobar')}
                                >
                                  <IonIcon slot="start" icon={checkmarkCircleOutline} />
                                  Aprobar
                                </IonButton>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}

                    {/* Paginación */}
                    <div className="vr-paginacion">
                      <span className="vr-pag-info">
                        Mostrando {(pagina - 1) * POR_PAG + 1} a{' '}
                        {Math.min(pagina * POR_PAG, usuariosFiltrados.length)} de{' '}
                        {usuariosFiltrados.length} solicitudes
                      </span>
                      <div className="vr-pag-btns">
                        <IonButton className="btn-pag" fill="outline"
                          disabled={pagina === 1} onClick={() => setPagina(1)}>⟪</IonButton>
                        <IonButton className="btn-pag" fill="outline"
                          disabled={pagina === 1} onClick={() => setPagina(p => p - 1)}>‹</IonButton>
                        {Array.from({ length: totalPags }, (_, i) => i + 1)
                          .filter(n => n === 1 || n === totalPags || Math.abs(n - pagina) <= 1)
                          .map((n, idx, arr) => (
                            <React.Fragment key={n}>
                              {idx > 0 && arr[idx - 1] !== n - 1 && (
                                <span style={{ padding: '0 2px', color: '#9ca3af', alignSelf: 'center' }}>…</span>
                              )}
                              <IonButton
                                className={`btn-pag${pagina === n ? ' activa' : ''}`}
                                fill="outline"
                                onClick={() => setPagina(n)}
                              >{n}</IonButton>
                            </React.Fragment>
                          ))}
                        <IonButton className="btn-pag" fill="outline"
                          disabled={pagina === totalPags} onClick={() => setPagina(p => p + 1)}>›</IonButton>
                        <IonButton className="btn-pag" fill="outline"
                          disabled={pagina === totalPags} onClick={() => setPagina(totalPags)}>⟫</IonButton>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
