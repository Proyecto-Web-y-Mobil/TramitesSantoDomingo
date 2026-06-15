import React, { useState, useEffect, useMemo } from 'react';
import {
  IonPage, IonContent, IonButton, IonIcon, IonSpinner,
  useIonToast, useIonViewWillEnter, IonItem, IonSelect, IonSelectOption
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  documentTextOutline, searchOutline, funnelOutline
} from 'ionicons/icons';
import { authService } from '../services/authService';

const ASSETS = {
  fondo:  'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/FondoSantoDomigno.png',
  logo:   'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/LogoSantoDomingoAzul.png',
  puerta: 'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PuertaSalir.png',
};

const TRAMITES_POR_PAG = 4;

export default function AdminTramites() {
  const history = useHistory();
  const [presentToast] = useIonToast();
  const [tramites, setTramites]       = useState<any[]>([]);
  const [cargando, setCargando]       = useState(true);
  const [nombreAdmin, setNombreAdmin] = useState('');

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda]         = useState('');
  const [filtrosActivos, setFiltrosActivos] = useState({ estado: 'todos', busqueda: '' });

  // Paginación
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    const sessionData = localStorage.getItem('user_session');
    if (!sessionData) { history.push('/login-funcionario'); return; }
    const userObj = JSON.parse(sessionData);
    const user = Array.isArray(userObj) ? userObj[0] : userObj;
    if (user.rol !== 'funcionario') { history.replace('/tramites-user'); return; }
    setNombreAdmin(`${user.nombres} ${user.apellidoP}`);
  }, [history]);

  useIonViewWillEnter(() => { cargarTramites(); });

  const cargarTramites = async () => {
    try {
      setCargando(true);
      // 🔥 CORRECCIÓN: Apuntando al backend de Docker local
      const response = await fetch('http://localhost:3000/api/admin/tramites');
      const data = await response.json();
      if (data.ok) setTramites(data.tramites);
      else throw new Error(data.error);
    } catch (error) {
      presentToast({ message: 'Error al cargar los trámites', duration: 3000, color: 'danger' });
    } finally {
      setCargando(false);
    }
  };

  const handleCerrarSesion = () => { authService.logout(); history.push('/login-funcionario'); };

  const aplicarFiltros = () => {
    setFiltrosActivos({ estado: filtroEstado, busqueda });
    setPagina(1);
  };

  // Filtrado
  const tramitesFiltrados = useMemo(() => {
    return tramites.filter(t => {
      const estadoMatch = filtrosActivos.estado === 'todos'
        ? true
        : (t.estado || 'pendiente').toLowerCase() === filtrosActivos.estado.toLowerCase();
      const q = filtrosActivos.busqueda.toLowerCase();
      const busquedaMatch = q
        ? (
          `${t.nombres} ${t.apellido_p} ${t.apellido_m}`.toLowerCase().includes(q) ||
          (t.rut || '').toLowerCase().includes(q) ||
          String(t.solicitud_id).includes(q)
        )
        : true;
      return estadoMatch && busquedaMatch;
    });
  }, [tramites, filtrosActivos]);

  const totalPags   = Math.max(1, Math.ceil(tramitesFiltrados.length / TRAMITES_POR_PAG));
  const tramitesPag = tramitesFiltrados.slice((pagina - 1) * TRAMITES_POR_PAG, pagina * TRAMITES_POR_PAG);

  const getEstadoCfg = (estado: string) => {
    switch ((estado || 'pendiente').toLowerCase()) {
      case 'aprobado':
        return { label: 'Aprobado',   color: '#27ae60', bg: '#f0fff5', border: '#b7e9c8' };
      case 'rechazado':
        return { label: 'Rechazado',  color: '#c0392b', bg: '#fff0f0', border: '#f5c6c6' };
      case 'corregido':
        return { label: 'Corregido',  color: '#8e44ad', bg: '#f9f0ff', border: '#d8b4fe' };
      case 'observado': case 'requiere modificación':
        return { label: 'Observado',  color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
      default:
        return { label: 'Pendiente',  color: '#1a73c8', bg: '#eef4ff', border: '#c5d8f8' };
    }
  };

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': '#f0f2f5' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          * { box-sizing: border-box; }

          .at-root {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            display: flex; flex-direction: row;
            font-family: 'Inter', sans-serif;
            background: #f0f2f5;
            overflow: hidden;
          }

          /* ── SIDEBAR ── */
          .at-sidebar {
            width: 200px; flex-shrink: 0;
            background: #002050;
            display: flex; flex-direction: column;
            align-items: center;
            padding: 28px 16px 24px;
            height: 100%;
          }
          .at-sidebar-logo { width: 120px; filter: brightness(0) invert(1); }

          /* ── COLUMNA DERECHA ── */
          .at-right {
            flex: 1; display: flex; flex-direction: column;
            min-width: 0; overflow-y: auto;
          }

          /* ── HEADER ── */
          .at-header {
            flex-shrink: 0; position: relative;
            min-height: 130px;
            background-image: url('${ASSETS.fondo}');
            background-size: cover; background-position: center;
            display: flex; align-items: center;
            padding: 20px 32px;
            justify-content: space-between;
            gap: 16px; flex-wrap: wrap;
          }
          .at-header::after {
            content: ''; position: absolute; inset: 0;
            background: rgba(0,10,40,0.58);
          }
          .at-header-texts { position: relative; z-index: 2; }
          .at-header-texts h1 {
            font-size: 2.2rem; font-weight: 800; color: #fff;
            margin: 0 0 4px; font-family: 'Inter', sans-serif; line-height: 1;
          }
          .at-header-texts .bienvenido {
            font-size: 0.85rem; font-weight: 400;
            color: rgba(255,255,255,0.80); margin: 0 0 1px;
            font-family: 'Inter', sans-serif;
          }
          .at-header-texts .bienvenido strong { font-weight: 600; font-style: italic; color: #fff; }
          .at-header-texts .subtitulo {
            font-size: 0.78rem; font-weight: 600;
            color: rgba(255,255,255,0.65); margin: 0;
            font-family: 'Inter', sans-serif;
          }
          .at-header-btns {
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
            font-size: 0.88rem; font-weight: 700; margin: 0;
            min-width: 140px;
          }
          .at-btn-icon {
            width: 16px; height: 16px;
            filter: brightness(0) invert(1); margin-right: 6px;
          }

          /* ── CONTENIDO ── */
          .at-main { padding: 28px 36px; }

          .at-titulo {
            font-size: 1.1rem; font-weight: 700; color: #003060;
            margin: 0 0 20px; font-family: 'Inter', sans-serif;
          }

          /* Filtros */
          .at-filtros {
            display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;
            background: #fff; border: 1px solid #e0e7ef;
            border-radius: 12px; padding: 16px 20px; align-items: center;
          }
          .at-filtro-select {
            --background: transparent; --border-color: #d0d8e4;
            --border-radius: 8px; --border-style: solid; --border-width: 1px;
            --color: #003060; --padding-start: 10px; --inner-padding-end: 8px;
            --min-height: 42px; border-radius: 8px; flex: 1; min-width: 180px;
          }
          .at-filtro-select ion-select {
            --color: #003060; font-family: 'Inter', sans-serif; font-size: 0.88rem;
          }
          .at-search-wrap {
            flex: 2; min-width: 220px; display: flex; align-items: center;
            border: 1px solid #d0d8e4; border-radius: 8px;
            background: #f7f9fc; padding: 0 12px; height: 42px;
          }
          .at-search-wrap ion-icon { color: #9ca3af; font-size: 1.1rem; margin-right: 8px; flex-shrink: 0; }
          .at-search-input {
            flex: 1; border: none; background: transparent;
            font-family: 'Inter', sans-serif; font-size: 0.88rem; color: #003060;
            outline: none;
          }
          .at-search-input::placeholder { color: #b0b8c4; }
          .btn-filtrar {
            --background: #003060; --background-hover: #00428a; --color: #fff;
            --border-radius: 8px; --padding-start: 16px; --padding-end: 16px;
            --padding-top: 10px; --padding-bottom: 10px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.85rem; font-weight: 600; margin: 0; flex-shrink: 0;
          }

          /* Tabla */
          .at-tabla {
            background: #fff; border: 1px solid #e0e7ef;
            border-radius: 12px; overflow: hidden;
          }
          .at-fila {
            display: grid;
            grid-template-columns: 2fr 1.8fr 1.4fr 1fr;
            padding: 18px 20px; align-items: center;
            border-bottom: 1px solid #f0f2f5;
            transition: background 0.15s;
          }
          .at-fila:last-child { border-bottom: none; }
          .at-fila:hover { background: #f7f9ff; }

          .at-col-tramite-titulo {
            font-size: 0.92rem; font-weight: 700; color: #003060;
            font-family: 'Inter', sans-serif; margin: 0 0 3px;
          }
          .at-col-tramite-sub {
            font-size: 0.76rem; color: #6b7280;
            font-family: 'Inter', sans-serif; margin: 0;
          }

          .at-col-label {
            font-size: 0.78rem; font-weight: 700; color: #003060;
            font-family: 'Inter', sans-serif; margin: 0 0 3px;
          }
          .at-col-value {
            font-size: 0.82rem; color: #4b5563;
            font-family: 'Inter', sans-serif; margin: 0;
          }

          .at-estado-badge {
            display: inline-block; padding: 4px 12px;
            border-radius: 20px; font-size: 0.78rem; font-weight: 600;
            font-family: 'Inter', sans-serif; margin-bottom: 8px;
            border: 1.5px solid transparent;
          }
          .btn-revisar {
            --background: #003060; --background-hover: #00428a; --color: #fff;
            --border-radius: 8px; --padding-start: 12px; --padding-end: 12px;
            --padding-top: 8px; --padding-bottom: 8px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.80rem; font-weight: 600; margin: 0; width: 100%;
          }

          /* Vacío / cargando */
          .at-vacio {
            padding: 60px 20px; text-align: center; color: #6b7280;
            font-family: 'Inter', sans-serif;
          }
          .at-vacio h3 { font-size: 1rem; font-weight: 600; margin: 0 0 6px; color: #374151; }
          .at-vacio p  { font-size: 0.85rem; margin: 0; }

          /* Paginación */
          .at-paginacion {
            display: flex; justify-content: space-between; align-items: center;
            padding: 14px 20px; border-top: 1px solid #f0f2f5; background: #fff;
          }
          .at-pag-info {
            font-size: 0.78rem; color: #9ca3af; font-family: 'Inter', sans-serif;
          }
          .at-pag-btns { display: flex; gap: 4px; }
          .btn-pag {
            --background: transparent; --background-hover: rgba(0,48,96,0.08);
            --color: #6b7280; --border-radius: 6px;
            --border-width: 1px; --border-style: solid; --border-color: #e0e7ef;
            --padding-start: 8px; --padding-end: 8px;
            --padding-top: 4px; --padding-bottom: 4px;
            margin: 0; height: 30px; min-width: 30px;
            font-family: 'Inter', sans-serif; font-size: 0.78rem; text-transform: none;
          }
          .btn-pag.activa { --background: #003060; --color: #fff; --border-color: #003060; }

          /* ══════════ MÓVIL ══════════ */
          @media (max-width: 600px) {
            .at-root { flex-direction: column; overflow-y: auto; }
            .at-sidebar { display: none; }
            .at-right { overflow-y: unset; }
            .at-header { min-height: 110px; padding: 14px 16px; }
            .at-header-texts h1 { font-size: 1.5rem; }
            .at-main { padding: 16px 12px; }
            .at-filtros { flex-direction: column; gap: 10px; }
            .at-fila { grid-template-columns: 1fr; gap: 8px; padding: 14px 16px; }
            .at-paginacion { flex-direction: column; gap: 10px; }
          }
        `}</style>

        <div className="at-root">

          {/* SIDEBAR */}
          <div className="at-sidebar">
            <img className="at-sidebar-logo" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />
          </div>

          {/* COLUMNA DERECHA */}
          <div className="at-right">

            {/* HEADER */}
            <div className="at-header">
              <div className="at-header-texts">
                <h1>Administrador</h1>
                <p className="bienvenido">Bienvenido, <strong>{nombreAdmin || 'Cargando...'}</strong></p>
                <p className="subtitulo">Gestiona y administra los trámites y servicios municipales</p>
              </div>
              <div className="at-header-btns">
                <IonButton className="btn-cerrar" onClick={handleCerrarSesion}>
                  <img className="at-btn-icon" src={ASSETS.puerta} alt="" />
                  Cerrar sesión
                </IonButton>
                <IonButton className="btn-volver" onClick={() => history.push('/admin-dashboard')}>
                  ← Volver
                </IonButton>
              </div>
            </div>

            {/* CONTENIDO */}
            <div className="at-main">
              <p className="at-titulo">Todos los trámites</p>

              {/* Filtros */}
              <div className="at-filtros">
                <IonItem lines="none" className="at-filtro-select">
                  <IonIcon icon={funnelOutline} style={{ color: '#9ca3af', marginRight: 8, fontSize: '1rem' }} />
                  <IonSelect
                    value={filtroEstado}
                    onIonChange={e => setFiltroEstado(e.detail.value)}
                    placeholder="Todos los trámites"
                    interface="popover"
                  >
                    <IonSelectOption value="todos">Todos los trámites</IonSelectOption>
                    <IonSelectOption value="pendiente">Pendiente</IonSelectOption>
                    <IonSelectOption value="aprobado">Aprobado</IonSelectOption>
                    <IonSelectOption value="rechazado">Rechazado</IonSelectOption>
                    <IonSelectOption value="observado">Observado</IonSelectOption>
                    <IonSelectOption value="corregido">Corregido</IonSelectOption>
                  </IonSelect>
                </IonItem>

                <div className="at-search-wrap">
                  <IonIcon icon={searchOutline} />
                  <input
                    className="at-search-input"
                    placeholder="Búsqueda por nombre, RUT o Nº de solicitud"
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && aplicarFiltros()}
                  />
                </div>

                <IonButton className="btn-filtrar" onClick={aplicarFiltros}>
                  Filtrar
                </IonButton>
              </div>

              {/* Tabla */}
              <div className="at-tabla">
                {cargando ? (
                  <div className="at-vacio"><IonSpinner name="crescent" /></div>
                ) : tramitesFiltrados.length === 0 ? (
                  <div className="at-vacio">
                    <h3>No hay trámites</h3>
                    <p>Las solicitudes de los ciudadanos aparecerán aquí.</p>
                  </div>
                ) : (
                  <>
                    {tramitesPag.map((tramite) => {
                      const cfg = getEstadoCfg(tramite.estado);
                      return (
                        <div key={tramite.solicitud_id} className="at-fila">

                          {/* Trámite */}
                          <div>
                            <p className="at-col-tramite-titulo">{tramite.nombre_tramite}</p>
                            <p className="at-col-tramite-sub">Solicitud #{tramite.solicitud_id}</p>
                            <p className="at-col-tramite-sub">
                              Ingreso: {tramite.fecha_solicitud
                                ? new Date(tramite.fecha_solicitud).toLocaleDateString('es-CL')
                                : 'Sin fecha'}
                            </p>
                          </div>

                          {/* Solicitante */}
                          <div>
                            <p className="at-col-label">Solicitante</p>
                            <p className="at-col-value">
                              {tramite.nombres} {tramite.apellido_p} {tramite.apellido_m}
                            </p>
                            <p className="at-col-value">RUT: {tramite.rut}</p>
                          </div>

                          {/* Fecha */}
                          <div>
                            <p className="at-col-label">Fecha de ingreso</p>
                            <p className="at-col-value">
                              {tramite.fecha_solicitud
                                ? new Date(tramite.fecha_solicitud).toLocaleDateString('es-CL')
                                : 'Sin fecha'}
                            </p>
                          </div>

                          {/* Estado + acción */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
                            <span
                              className="at-estado-badge"
                              style={{
                                color: cfg.color,
                                background: cfg.bg,
                                borderColor: cfg.border,
                              }}
                            >
                              {cfg.label}
                            </span>
                            <IonButton
                              className="btn-revisar"
                              onClick={() => history.push(`/admin/tramites/revisar/${tramite.solicitud_id}`)}
                            >
                              <IonIcon slot="start" icon={documentTextOutline} />
                              Revisar trámite
                            </IonButton>
                          </div>

                        </div>
                      );
                    })}

                    {/* Paginación */}
                    <div className="at-paginacion">
                      <span className="at-pag-info">
                        Mostrando {(pagina - 1) * TRAMITES_POR_PAG + 1} a{' '}
                        {Math.min(pagina * TRAMITES_POR_PAG, tramitesFiltrados.length)} de{' '}
                        {tramitesFiltrados.length} solicitudes
                      </span>
                      <div className="at-pag-btns">
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