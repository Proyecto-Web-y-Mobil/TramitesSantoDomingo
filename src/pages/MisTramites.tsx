import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonButton, IonSpinner,
  useIonToast, IonIcon, useIonViewWillEnter,
  IonSelect, IonSelectOption, IonItem
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  alertCircleOutline, checkmarkCircleOutline,
  timeOutline, closeCircleOutline, eyeOutline
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
  lupa:         'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/LupaBlanca.png',
  filtrar:      'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/FiltrarBlanca.png',
};

const TRAMITES_POR_PAGINA = 4;

export default function MisTramites() {
  const history = useHistory();
  const [presentToast] = useIonToast();
  const [tramites, setTramites]             = useState<any[]>([]);
  const [cargando, setCargando]             = useState(true);

  // Filtros
  const [busqueda, setBusqueda]             = useState('');
  const [estadoFiltro, setEstadoFiltro]     = useState('todos');
  const [fechaDesde, setFechaDesde]         = useState('');
  const [fechaHasta, setFechaHasta]         = useState('');
  const [filtrosActivos, setFiltrosActivos] = useState({
    busqueda: '', estado: 'todos', desde: '', hasta: ''
  });

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);

  useIonViewWillEnter(() => { cargarTramites(); });

  const cargarTramites = async () => {
    try {
      setCargando(true);
      const sessionData = localStorage.getItem('user_session');
      if (!sessionData) { history.push('/login'); return; }
      const userObj = JSON.parse(sessionData);
      const user = Array.isArray(userObj) ? userObj[0] : userObj;
      const response = await fetch(
        `https://tramitessantodomingo-production-5cb4.up.railway.app/api/tramites/usuario/${user.id}`
      );
      const data = await response.json();
      if (data.ok) setTramites(data.tramites);
      else throw new Error(data.error);
    } catch (error) {
      console.error(error);
      presentToast({ message: 'Error al cargar tus trámites', duration: 3000, color: 'danger' });
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    history.push('/tramites');
  };

  const aplicarFiltros = () => {
    setFiltrosActivos({ busqueda, estado: estadoFiltro, desde: fechaDesde, hasta: fechaHasta });
    setPaginaActual(1);
  };

  // Filtrado
  const tramitesFiltrados = useMemo(() => {
    return tramites.filter(t => {
      const nombreMatch = filtrosActivos.busqueda
        ? (t.nombre_tramite || '').toLowerCase().includes(filtrosActivos.busqueda.toLowerCase())
        : true;
      const estadoMatch = filtrosActivos.estado !== 'todos'
        ? (t.estado || '').toLowerCase() === filtrosActivos.estado.toLowerCase()
        : true;
      const fecha = t.fecha_solicitud ? new Date(t.fecha_solicitud) : null;
      const desdeMatch = filtrosActivos.desde && fecha
        ? fecha >= new Date(filtrosActivos.desde) : true;
      const hastaMatch = filtrosActivos.hasta && fecha
        ? fecha <= new Date(filtrosActivos.hasta) : true;
      return nombreMatch && estadoMatch && desdeMatch && hastaMatch;
    });
  }, [tramites, filtrosActivos]);

  const totalPaginas   = Math.max(1, Math.ceil(tramitesFiltrados.length / TRAMITES_POR_PAGINA));
  const tramitesPagina = tramitesFiltrados.slice(
    (paginaActual - 1) * TRAMITES_POR_PAGINA,
    paginaActual * TRAMITES_POR_PAGINA
  );

  const renderEstadoBadge = (estado: string) => {
    if (!estado) return (
      <span className="badge-estado badge-revision">
        <IonIcon icon={timeOutline} /> En Revisión
      </span>
    );
    switch (estado.toLowerCase()) {
      case 'aprobado':
      case 'completado':
        return <span className="badge-estado badge-aprobado"><IonIcon icon={checkmarkCircleOutline} /> Completado</span>;
      case 'rechazado':
        return <span className="badge-estado badge-rechazado"><IonIcon icon={closeCircleOutline} /> Rechazado</span>;
      case 'pendiente':
        return <span className="badge-estado badge-pendiente"><IonIcon icon={timeOutline} /> Pendiente</span>;
      case 'corregido':
        return <span className="badge-estado badge-aprobado"><IonIcon icon={checkmarkCircleOutline} /> Corregido</span>;
      case 'observado':
      case 'requiere modificación':
        return <span className="badge-estado badge-observado"><IonIcon icon={alertCircleOutline} /> Requiere Corrección</span>;
      default:
        return <span className="badge-estado badge-revision"><IonIcon icon={timeOutline} /> {estado}</span>;
    }
  };

  return (
    <IonPage>
      <IonContent scrollY={true} style={{ '--background': '#001830' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          * { box-sizing: border-box; }

          .mt-root {
            display: flex; min-height: 100vh;
            font-family: 'Inter', sans-serif; background: #001830;
          }

          /* ── SIDEBAR ── */
          .mt-sidebar {
            width: 200px; flex-shrink: 0; background: #002050;
            display: flex; flex-direction: column; align-items: flex-start;
            padding: 20px 12px; gap: 4px;
            position: sticky; top: 0; height: 100vh;
          }
          .mt-sidebar-logo {
            width: 90px; margin-bottom: 24px;
            filter: brightness(0) invert(1);
          }
          .mt-nav-btn {
            --background: transparent;
            --background-hover: rgba(255,255,255,0.10);
            --color: rgba(255,255,255,0.75);
            --border-radius: 8px;
            --padding-start: 10px; --padding-end: 10px;
            --padding-top: 10px; --padding-bottom: 10px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.88rem; font-weight: 500;
            width: 100%; margin: 0; justify-content: flex-start;
          }
          .mt-nav-btn.active-nav {
            --background: rgba(255,255,255,0.14);
            --color: #fff; font-weight: 700;
          }
          .mt-nav-icon {
            width: 20px; height: 20px; margin-right: 10px;
            flex-shrink: 0; filter: brightness(0) invert(1); opacity: 0.80;
          }
          .mt-sidebar-spacer { flex: 1; }
          .mt-nav-logout {
            --background: transparent;
            --background-hover: rgba(255,255,255,0.08);
            --color: rgba(255,255,255,0.60);
            --border-radius: 8px;
            --padding-start: 10px; --padding-end: 10px;
            --padding-top: 10px; --padding-bottom: 10px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.88rem; font-weight: 500;
            width: 100%; margin: 0; justify-content: flex-start;
          }

          /* ── COLUMNA DERECHA ── */
          .mt-right { flex: 1; display: flex; flex-direction: column; min-width: 0; }

          /* ── HEADER ── */
          .mt-header {
            position: relative; min-height: 200px;
            background-image: url('${ASSETS.fondo}');
            background-size: cover; background-position: center center;
            background-repeat: no-repeat;
            display: flex; align-items: flex-end; padding: 24px 28px;
          }
          .mt-header::after {
            content: ''; position: absolute; inset: 0;
            background: rgba(0,10,40,0.55);
          }
          .mt-header-content { position: relative; z-index: 2; flex: 1; }
          .mt-header-content h1 {
            font-size: 2rem; font-weight: 700; color: #fff;
            margin: 0 0 2px; font-family: 'Inter', sans-serif;
          }
          .mt-header-content p {
            font-size: 0.85rem; font-weight: 300;
            color: rgba(255,255,255,0.75); margin: 0;
            font-family: 'Inter', sans-serif;
          }
          .mt-photo-area {
            position: absolute; top: 16px; right: 20px; z-index: 2;
            display: flex; flex-direction: column; align-items: center; gap: 8px;
          }
          .mt-photo-box {
            width: 110px; height: 110px; background: #c0c8d0;
            border-radius: 10px; display: flex;
            align-items: center; justify-content: center; overflow: hidden;
          }
          .mt-photo-box img { width: 80px; height: 80px; opacity: 0.6; }
          .mt-photo-btn {
            --background: #002050; --background-hover: #003080; --color: #fff;
            --border-radius: 8px;
            --padding-start: 10px; --padding-end: 10px;
            --padding-top: 6px; --padding-bottom: 6px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.78rem; font-weight: 500; width: 110px; margin: 0;
          }
          .mt-photo-btn img {
            width: 14px; height: 14px; margin-right: 6px;
            filter: brightness(0) invert(1);
          }

          /* ── CONTENIDO ── */
          .mt-content { background: #001830; padding: 28px 32px; flex: 1; }

          /* Filtros */
          .mt-filtros-box {
            background: #002050; border: 1px solid #003070;
            border-radius: 12px; padding: 20px 20px 16px; margin-bottom: 20px;
          }
          .mt-filtros-row {
            display: flex; align-items: flex-end; gap: 12px; flex-wrap: wrap;
          }
          .mt-filtro-group {
            display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 160px;
          }
          .mt-filtro-label {
            font-size: 0.80rem; font-weight: 600;
            color: rgba(255,255,255,0.70); font-family: 'Inter', sans-serif;
          }
          .mt-search-wrapper {
            display: flex; align-items: center;
            background: #001830; border: 1px solid #003070;
            border-radius: 8px; padding: 0 12px; height: 44px;
          }
          .mt-search-wrapper img {
            width: 18px; height: 18px; filter: brightness(0) invert(1);
            opacity: 0.50; margin-right: 8px; flex-shrink: 0;
          }
          .mt-search-input {
            flex: 1; border: none; background: transparent;
            color: #fff; font-family: 'Inter', sans-serif; font-size: 0.88rem; outline: none;
          }
          .mt-search-input::placeholder { color: rgba(255,255,255,0.30); }

          /* Select estado */
          .mt-select-item {
            --background: #001830; --border-color: #003070;
            --border-radius: 8px; --border-style: solid; --border-width: 1px;
            --color: #fff; --padding-start: 12px; --inner-padding-end: 8px;
            --min-height: 44px; border-radius: 8px;
          }
          .mt-select-item ion-select {
            --color: #fff; --placeholder-color: rgba(255,255,255,0.30);
            font-family: 'Inter', sans-serif; font-size: 0.88rem; width: 100%;
          }

          /* Fecha */
          .mt-fecha-wrapper {
            display: flex; align-items: center;
            background: #001830; border: 1px solid #003070;
            border-radius: 8px; padding: 0 12px; height: 44px; gap: 8px;
          }
          .mt-fecha-wrapper img {
            width: 18px; height: 18px; filter: brightness(0) invert(1);
            opacity: 0.50; flex-shrink: 0;
          }
          .mt-fecha-input {
            flex: 1; border: none; background: transparent;
            color: #fff; font-family: 'Inter', sans-serif; font-size: 0.85rem;
            outline: none; min-width: 0;
          }
          .mt-fecha-input::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.5; }

          /* Botón filtrar */
          .btn-filtrar {
            --background: #003060; --background-hover: #004090; --color: #fff;
            --border-radius: 8px; --padding-start: 16px; --padding-end: 16px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.88rem; font-weight: 600;
            height: 44px; margin: 0; flex-shrink: 0; align-self: flex-end;
          }
          .btn-filtrar img {
            width: 18px; height: 18px; filter: brightness(0) invert(1); margin-right: 6px;
          }

          /* ── TABLA ── */
          .mt-tabla-box {
            background: #002050; border: 1px solid #003070;
            border-radius: 12px; overflow: hidden;
          }
          .mt-tabla-header {
            display: grid;
            grid-template-columns: 2fr 1.5fr 1fr 1.4fr 0.5fr;
            padding: 14px 20px; border-bottom: 1px solid #003070;
            background: #001830;
          }
          .mt-tabla-header span {
            font-size: 0.82rem; font-weight: 600;
            color: rgba(255,255,255,0.55); font-family: 'Inter', sans-serif;
          }
          .mt-tabla-fila {
            display: grid;
            grid-template-columns: 2fr 1.5fr 1fr 1.4fr 0.5fr;
            padding: 16px 20px; align-items: center;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            transition: background 0.15s;
          }
          .mt-tabla-fila:last-child { border-bottom: none; }
          .mt-tabla-fila:hover { background: rgba(255,255,255,0.04); }
          .mt-tabla-cell {
            font-size: 0.88rem; font-weight: 400; color: #fff;
            font-family: 'Inter', sans-serif;
          }
          .mt-tabla-cell.nombre { font-weight: 500; }
          .mt-tabla-cell.numero { color: rgba(255,255,255,0.60); font-size: 0.82rem; }
          .mt-tabla-cell.fecha  { color: rgba(255,255,255,0.60); font-size: 0.82rem; }

          /* Badges */
          .badge-estado {
            display: inline-flex; align-items: center; gap: 5px;
            padding: 5px 10px; border-radius: 6px;
            font-size: 0.80rem; font-weight: 600;
            font-family: 'Inter', sans-serif; white-space: nowrap;
          }
          .badge-aprobado  { border: 1.5px solid #4cde80; color: #4cde80; }
          .badge-rechazado { border: 1.5px solid #ff5c5c; color: #ff5c5c; }
          .badge-pendiente { border: 1.5px solid #f0a500; color: #f0a500; }
          .badge-revision  { border: 1.5px solid #5bb8ff; color: #5bb8ff; }
          .badge-observado { border: 1.5px solid #ffcc00; color: #ffcc00; }

          /* Botón ver */
          .btn-ver {
            --background: transparent;
            --background-hover: rgba(255,255,255,0.08);
            --color: rgba(255,255,255,0.80);
            --border-color: rgba(255,255,255,0.25);
            --border-width: 1px; --border-style: solid; --border-radius: 8px;
            --padding-start: 10px; --padding-end: 10px;
            --padding-top: 6px; --padding-bottom: 6px;
            margin: 0; height: 36px;
          }

          /* Vacío / cargando */
          .mt-vacio {
            padding: 60px 20px; text-align: center; font-family: 'Inter', sans-serif;
          }
          .mt-vacio h3 { font-size: 1.1rem; font-weight: 600; margin: 0 0 6px; color: rgba(255,255,255,0.60); }
          .mt-vacio p  { font-size: 0.85rem; margin: 0; color: rgba(255,255,255,0.40); }
          .mt-cargando { padding: 60px 20px; text-align: center; color: rgba(255,255,255,0.60); font-family: 'Inter', sans-serif; }

          /* ── PAGINACIÓN ── */
          .mt-paginacion {
            display: flex; justify-content: space-between; align-items: center;
            padding: 14px 20px; border-top: 1px solid #003070; background: #001a38;
          }
          .mt-paginacion-info {
            font-size: 0.80rem; color: rgba(255,255,255,0.45); font-family: 'Inter', sans-serif;
          }
          .mt-paginacion-btns { display: flex; gap: 4px; align-items: center; }
          .btn-pag {
            --background: transparent;
            --background-hover: rgba(255,255,255,0.10);
            --color: rgba(255,255,255,0.70);
            --border-radius: 6px; --border-width: 1px; --border-style: solid;
            --border-color: rgba(255,255,255,0.20);
            --padding-start: 8px; --padding-end: 8px;
            --padding-top: 4px; --padding-bottom: 4px;
            margin: 0; min-width: 32px; height: 32px;
            font-family: 'Inter', sans-serif; font-size: 0.80rem; text-transform: none;
          }
          .btn-pag.pag-activa { --background: #003060; --color: #fff; --border-color: #003060; }

          /* ── FOOTER ── */
          .mt-footer {
            background: #003060; border-top: 1px solid rgba(255,255,255,0.10);
            padding: 28px 36px 16px;
            display: flex; justify-content: space-between;
            align-items: flex-start; flex-wrap: wrap; gap: 20px;
          }
          .mt-footer-block { display: flex; flex-direction: column; gap: 4px; font-family: 'Inter', sans-serif; }
          .mt-footer-block strong { color: #fff; font-size: 1rem; font-weight: 700; }
          .mt-footer-block span { color: rgba(255,255,255,0.75); font-size: 0.88rem; font-weight: 300; }
          .mt-footer-icon-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
          .mt-footer-icon-row img { width: 22px; height: 22px; }
          .mt-footer-divider { width: 1px; background: rgba(255,255,255,0.20); align-self: stretch; }
          .mt-footer-copy {
            text-align: center; color: rgba(255,255,255,0.35);
            font-size: 0.75rem; font-weight: 300; padding: 12px 0 8px;
            background: #003060; font-family: 'Inter', sans-serif;
          }

          /* ── BOTTOM NAV móvil ── */
          .mt-bottom-nav { display: none; }

          /* ══════════ MÓVIL ══════════ */
          @media (max-width: 600px) and (orientation: portrait) {
            .mt-root { flex-direction: column; }
            .mt-sidebar { display: none; }

            .mt-header { min-height: 150px; padding: 16px; }
            .mt-header-content h1 { font-size: 1.6rem; }
            .mt-photo-area { top: 10px; right: 12px; }
            .mt-photo-box { width: 80px; height: 80px; }
            .mt-photo-box img { width: 55px; height: 55px; }
            .mt-photo-btn { width: 80px; font-size: 0.72rem; }

            .mt-content { padding: 16px 14px; }

            .mt-filtros-row { flex-direction: column; }
            .mt-filtro-group { min-width: 100%; }

            .mt-tabla-header { display: none; }
            .mt-tabla-fila {
              display: flex; flex-direction: column; gap: 8px;
              padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.08);
            }
            .mt-tabla-cell.nombre { font-size: 0.95rem; font-weight: 600; }
            .mt-fila-footer {
              display: flex; justify-content: space-between; align-items: center;
            }

            .mt-paginacion { flex-direction: column; gap: 10px; text-align: center; }

            .mt-footer { flex-direction: column; padding: 20px 20px 12px; gap: 16px; }
            .mt-footer-divider { display: none; }

            .mt-bottom-nav {
              display: flex; justify-content: space-around;
              background: #003060; border-top: 1px solid rgba(255,255,255,0.15);
              padding: 10px 0 14px; position: sticky; bottom: 0; z-index: 20; width: 100%;
            }
            .mt-bottom-btn {
              --background: transparent; --color: rgba(255,255,255,0.70);
              --border-radius: 8px; text-transform: none;
              font-family: 'Inter', sans-serif; font-size: 0.70rem; font-weight: 500;
              flex: 1; margin: 0;
            }
            .mt-bottom-btn.active-nav { --color: #fff; }
            .mt-bottom-icon {
              width: 24px; height: 24px; filter: brightness(0) invert(1);
              opacity: 0.75; display: block; margin: 0 auto 4px;
            }
          }
        `}</style>

        <div className="mt-root">

          {/* SIDEBAR */}
          <div className="mt-sidebar">
            <img className="mt-sidebar-logo" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />
            <IonButton className="mt-nav-btn" fill="clear" onClick={() => history.push('/profile')}>
              <img className="mt-nav-icon" src={ASSETS.perfilBlanco} alt="" />Mi perfil
            </IonButton>
            <IonButton className="mt-nav-btn active-nav" fill="clear" onClick={() => history.push('/mis-tramites')}>
              <img className="mt-nav-icon" src={ASSETS.tramite} alt="" />Mis trámites
            </IonButton>
            <IonButton className="mt-nav-btn" fill="clear" onClick={() => history.push('/mis-agendas')}>
              <img className="mt-nav-icon" src={ASSETS.calendario} alt="" />Mis agendas
            </IonButton>
            <div className="mt-sidebar-spacer" />
            <IonButton className="mt-nav-logout" fill="clear" onClick={handleLogout}>
              <img className="mt-nav-icon" src={ASSETS.puerta} alt="" />Cerrar sesión
            </IonButton>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="mt-right">

            {/* Header */}
            <div className="mt-header">
              <div className="mt-header-content">
                <h1>Mis trámites</h1>
                <p>Revisa el estado de tus trámites y solicitudes</p>
              </div>
              <div className="mt-photo-area">
                <div className="mt-photo-box">
                  <img src={ASSETS.usuarioGris} alt="Foto perfil" />
                </div>
                <ConstructionAlert>
                  <IonButton className="mt-photo-btn" fill="clear">
                    <img src={ASSETS.camara} alt="" />Agregar foto
                  </IonButton>
                </ConstructionAlert>
              </div>
            </div>

            {/* Contenido */}
            <div className="mt-content">

              {/* Filtros */}
              <div className="mt-filtros-box">
                <div className="mt-filtros-row">

                  <div className="mt-filtro-group">
                    <span className="mt-filtro-label">Buscar trámite</span>
                    <div className="mt-search-wrapper">
                      <img src={ASSETS.lupa} alt="" />
                      <input
                        className="mt-search-input"
                        placeholder="Ingresa el nombre del trámite"
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && aplicarFiltros()}
                      />
                    </div>
                  </div>

                  <div className="mt-filtro-group">
                    <span className="mt-filtro-label">Estado</span>
                    <IonItem lines="none" className="mt-select-item">
                      <IonSelect
                        value={estadoFiltro}
                        onIonChange={e => setEstadoFiltro(e.detail.value)}
                        placeholder="Todos los estados"
                        interface="popover"
                      >
                        <IonSelectOption value="todos">Todos los estados</IonSelectOption>
                        <IonSelectOption value="pendiente">Pendiente</IonSelectOption>
                        <IonSelectOption value="aprobado">Completado</IonSelectOption>
                        <IonSelectOption value="rechazado">Rechazado</IonSelectOption>
                        <IonSelectOption value="observado">Requiere Corrección</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </div>

                  <div className="mt-filtro-group">
                    <span className="mt-filtro-label">Fecha</span>
                    <div className="mt-fecha-wrapper">
                      <img src={ASSETS.calendario} alt="" />
                      <input
                        className="mt-fecha-input"
                        type="date"
                        value={fechaDesde}
                        onChange={e => setFechaDesde(e.target.value)}
                      />
                      <span style={{ color: 'rgba(255,255,255,0.30)', fontSize: '0.80rem' }}>–</span>
                      <input
                        className="mt-fecha-input"
                        type="date"
                        value={fechaHasta}
                        onChange={e => setFechaHasta(e.target.value)}
                      />
                    </div>
                  </div>

                  <IonButton className="btn-filtrar" onClick={aplicarFiltros}>
                    <img src={ASSETS.filtrar} alt="" />
                    Filtrar
                  </IonButton>

                </div>
              </div>

              {/* Tabla */}
              <div className="mt-tabla-box">
                {cargando ? (
                  <div className="mt-cargando">
                    <IonSpinner name="crescent" />
                    <p>Cargando tus solicitudes...</p>
                  </div>
                ) : tramitesFiltrados.length === 0 ? (
                  <div className="mt-vacio">
                    <h3>No tienes trámites</h3>
                    <p>Cuando solicites un trámite, aparecerá aquí.</p>
                  </div>
                ) : (
                  <>
                    {/* Cabecera desktop */}
                    <div className="mt-tabla-header">
                      <span>Trámite</span>
                      <span>Número</span>
                      <span>Fecha</span>
                      <span>Estado</span>
                      <span>Acciones</span>
                    </div>

                    {/* Filas — desktop */}
                    {tramitesPagina.map(tramite => (
                      <div key={tramite.id} className="mt-tabla-fila">
                        <span className="mt-tabla-cell nombre">{tramite.nombre_tramite}</span>
                        <span className="mt-tabla-cell numero">
                          {tramite.numero_tramite || `#${tramite.id}`}
                        </span>
                        <span className="mt-tabla-cell fecha">
                          {tramite.fecha_solicitud
                            ? new Date(tramite.fecha_solicitud).toLocaleDateString('es-CL')
                            : 'Sin fecha'}
                        </span>
                        <span className="mt-tabla-cell">
                          {renderEstadoBadge(tramite.estado)}
                        </span>
                        <span className="mt-tabla-cell">
                          <IonButton
                            className="btn-ver"
                            fill="outline"
                            onClick={() => history.push(`/mis-tramites/detalle/${tramite.id}`)}
                          >
                            <IonIcon icon={eyeOutline} />
                          </IonButton>
                        </span>
                      </div>
                    ))}

                    {/* Paginación */}
                    <div className="mt-paginacion">
                      <span className="mt-paginacion-info">
                        Mostrando {(paginaActual - 1) * TRAMITES_POR_PAGINA + 1} a{' '}
                        {Math.min(paginaActual * TRAMITES_POR_PAGINA, tramitesFiltrados.length)} de{' '}
                        {tramitesFiltrados.length} trámites
                      </span>
                      <div className="mt-paginacion-btns">
                        <IonButton className="btn-pag" fill="outline"
                          disabled={paginaActual === 1}
                          onClick={() => setPaginaActual(1)}>⟪</IonButton>
                        <IonButton className="btn-pag" fill="outline"
                          disabled={paginaActual === 1}
                          onClick={() => setPaginaActual(p => p - 1)}>‹</IonButton>

                        {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                          .filter(n => n === 1 || n === totalPaginas || Math.abs(n - paginaActual) <= 1)
                          .map((n, idx, arr) => (
                            <React.Fragment key={n}>
                              {idx > 0 && arr[idx - 1] !== n - 1 && (
                                <span style={{ color: 'rgba(255,255,255,0.30)', padding: '0 2px' }}>…</span>
                              )}
                              <IonButton
                                className={`btn-pag${paginaActual === n ? ' pag-activa' : ''}`}
                                fill="outline"
                                onClick={() => setPaginaActual(n)}
                              >{n}</IonButton>
                            </React.Fragment>
                          ))}

                        <IonButton className="btn-pag" fill="outline"
                          disabled={paginaActual === totalPaginas}
                          onClick={() => setPaginaActual(p => p + 1)}>›</IonButton>
                        <IonButton className="btn-pag" fill="outline"
                          disabled={paginaActual === totalPaginas}
                          onClick={() => setPaginaActual(totalPaginas)}>⟫</IonButton>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-footer">
              <div className="mt-footer-block">
                <div className="mt-footer-icon-row">
                  <img src={ASSETS.ubicacion} alt="" /><strong>Dirección</strong>
                </div>
                <span>Avenida Santa Teresa N°1.</span>
                <span>Santo Domingo, Chile</span>
              </div>
              <div className="mt-footer-divider" />
              <div className="mt-footer-block">
                <div className="mt-footer-icon-row">
                  <img src={ASSETS.phone} alt="" /><strong>Emergencias 24 horas:</strong>
                </div>
                <span>+563 2238 1603 • +563 5220 4200</span>
                <span>Seguridad: 1458 • contacto@santodomingo.cl</span>
              </div>
              <div className="mt-footer-divider" />
              <div className="mt-footer-block">
                <div className="mt-footer-icon-row">
                  <img src={ASSETS.reloj} alt="" /><strong>Horario</strong>
                </div>
                <span>Lunes a Viernes: 08:45am a 14:00 pm</span>
                <span>Sábado: 09:30am a 13:30pm</span>
              </div>
            </div>
            <div className="mt-footer-copy">
              ©2026 Municipalidad de Santo Domingo &nbsp;•&nbsp; Política de Privacidad
            </div>

            {/* Bottom nav móvil */}
            <div className="mt-bottom-nav">
              <IonButton className="mt-bottom-btn" fill="clear" onClick={() => history.push('/profile')}>
                <img className="mt-bottom-icon" src={ASSETS.perfilBlanco} alt="" />Mi perfil
              </IonButton>
              <IonButton className="mt-bottom-btn active-nav" fill="clear" onClick={() => history.push('/mis-tramites')}>
                <img className="mt-bottom-icon" src={ASSETS.tramite} alt="" />Mis trámites
              </IonButton>
              <IonButton className="mt-bottom-btn" fill="clear" onClick={() => history.push('/mis-agendas')}>
                <img className="mt-bottom-icon" src={ASSETS.calendario} alt="" />Mis agendas
              </IonButton>
              <IonButton className="mt-bottom-btn" fill="clear" onClick={handleLogout}>
                <img className="mt-bottom-icon" src={ASSETS.puerta} alt="" />Cerrar sesión
              </IonButton>
            </div>

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
