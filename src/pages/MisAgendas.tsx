import React, { useState, useEffect, useMemo } from 'react';
import {
  IonPage, IonContent, IonButton, IonIcon,
  IonSpinner, useIonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  calendarOutline, timeOutline, trashOutline,
  locationOutline, listOutline, timeOutline as clockOutline
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
};

// Colores por tipo de agenda
const TIPO_CONFIG: Record<string, { color: string; label: string }> = {
  'Taller DIDECO':      { color: '#4cde80', label: 'Taller DIDECO' },
  'Trámite Presencial': { color: '#5bb8ff', label: 'Trámite Presencial' },
  'Reunión':            { color: '#f0a500', label: 'Reunión' },
  'Cita':               { color: '#c084fc', label: 'Cita' },
};

const getTipoColor = (tipo: string) => {
  return TIPO_CONFIG[tipo]?.color ?? '#94a3b8';
};

const AGENDAS_POR_PAG = 3;
const DIAS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

export default function MisAgendas() {
  const history = useHistory();
  const [presentToast] = useIonToast();

  const [agendas, setAgendas]     = useState<any[]>([]);
  const [cargando, setCargando]   = useState(true);

  // Calendario
  const hoy = new Date();
  const [mesActual, setMesActual]   = useState(hoy.getMonth());
  const [anioActual, setAnioActual] = useState(hoy.getFullYear());
  const [diaSelec, setDiaSelec]     = useState<number | null>(hoy.getDate());

  // Vista
  const [vista, setVista] = useState<'calendario' | 'lista' | 'proximas'>('calendario');

  // Paginación panel derecho
  const [pagAgendas, setPagAgendas] = useState(1);

  useEffect(() => { cargarAgendas(); }, []);

  // Resetear página al cambiar día
  useEffect(() => { setPagAgendas(1); }, [diaSelec, mesActual, anioActual]);

  const cargarAgendas = async () => {
    setCargando(true);
    try {
      const sessionData = localStorage.getItem('user_session');
      if (!sessionData) { history.push('/login'); return; }
      const userObj = JSON.parse(sessionData);
      const usuario = Array.isArray(userObj) ? userObj[0] : userObj;
      const response = await fetch(
        `http://localhost:3000/api/agendas/usuario/${usuario.id}`
      );
      const data = await response.json();
      if (data.ok) setAgendas(data.agendas);
      else throw new Error(data.error);
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
      const response = await fetch(
        'http://localhost:3000/api/agendas/cancelar',
        { method: 'DELETE', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, tipo, taller_id }) }
      );
      const data = await response.json();
      if (data.ok) {
        presentToast({ message: 'Reserva cancelada exitosamente.', duration: 3000, color: 'success' });
        cargarAgendas();
      } else throw new Error(data.error);
    } catch (error: any) {
      presentToast({ message: error.message || 'Error al cancelar la reserva', duration: 4000, color: 'danger' });
    }
  };

  const formatearFechaHora = (fechaString: string, tipo: string) => {
    const stringSeguro = fechaString.replace(' ', 'T');
    const fechaObj = new Date(stringSeguro);
    const usarUTC = tipo === 'Taller DIDECO';
    const opFecha: Intl.DateTimeFormatOptions = {
      timeZone: usarUTC ? 'UTC' : undefined,
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    };
    const opHora: Intl.DateTimeFormatOptions = {
      timeZone: usarUTC ? 'UTC' : undefined,
      hour: '2-digit', minute: '2-digit', hour12: false
    };
    return {
      dia: fechaObj.toLocaleDateString('es-CL', opFecha),
      hora: fechaObj.toLocaleTimeString('es-CL', opHora),
      dateObj: fechaObj,
    };
  };

  const handleLogout = () => { authService.logout(); history.push('/tramites'); };

  // ── Calendario helpers ──
  const primerDiaMes = new Date(anioActual, mesActual, 1);
  // Lunes=0 … Dom=6
  const offsetInicio = (primerDiaMes.getDay() + 6) % 7;
  const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();

  // Mapa de día → agendas (solo del mes visible)
  const agendasPorDia = useMemo(() => {
    const mapa: Record<number, any[]> = {};
    agendas.forEach(ag => {
      const f = formatearFechaHora(ag.fecha_evento, ag.tipo);
      if (f.dateObj.getMonth() === mesActual && f.dateObj.getFullYear() === anioActual) {
        const d = f.dateObj.getDate();
        if (!mapa[d]) mapa[d] = [];
        mapa[d].push(ag);
      }
    });
    return mapa;
  }, [agendas, mesActual, anioActual]);

  // Agendas del día seleccionado
  const agendasDia = diaSelec ? (agendasPorDia[diaSelec] ?? []) : [];
  const totalPagsDia = Math.max(1, Math.ceil(agendasDia.length / AGENDAS_POR_PAG));
  const agendasPagina = agendasDia.slice(
    (pagAgendas - 1) * AGENDAS_POR_PAG,
    pagAgendas * AGENDAS_POR_PAG
  );

  // Agendas futuras (para vista proximas/lista)
  const agendasFuturas = useMemo(() => {
    return [...agendas]
      .map(ag => ({ ...ag, _f: formatearFechaHora(ag.fecha_evento, ag.tipo) }))
      .filter(ag => ag._f.dateObj >= new Date())
      .sort((a, b) => a._f.dateObj.getTime() - b._f.dateObj.getTime());
  }, [agendas]);

  const fechaSelecLabel = diaSelec
    ? new Date(anioActual, mesActual, diaSelec).toLocaleDateString('es-CL', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      })
    : '';

  // Construir grilla del calendario
  const celdasCalendario: (number | null)[] = [];
  for (let i = 0; i < offsetInicio; i++) celdasCalendario.push(null);
  for (let d = 1; d <= diasEnMes; d++) celdasCalendario.push(d);
  while (celdasCalendario.length % 7 !== 0) celdasCalendario.push(null);

  return (
    <IonPage>
      <IonContent scrollY={true} style={{ '--background': '#001830' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          * { box-sizing: border-box; }

          .ma-root {
            display: flex; min-height: 100vh;
            font-family: 'Inter', sans-serif; background: #001830;
          }

          /* ── SIDEBAR ── */
          .ma-sidebar {
            width: 200px; flex-shrink: 0; background: #002050;
            display: flex; flex-direction: column; align-items: flex-start;
            padding: 20px 12px; gap: 4px;
            position: sticky; top: 0; height: 100vh;
          }
          .ma-sidebar-logo {
            width: 90px; margin-bottom: 24px; filter: brightness(0) invert(1);
          }
          .ma-nav-btn {
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
          .ma-nav-btn.active-nav { --background: rgba(255,255,255,0.14); --color: #fff; font-weight: 700; }
          .ma-nav-icon { width: 20px; height: 20px; margin-right: 10px; flex-shrink: 0; filter: brightness(0) invert(1); opacity: 0.80; }
          .ma-sidebar-spacer { flex: 1; }
          .ma-nav-logout {
            --background: transparent; --background-hover: rgba(255,255,255,0.08);
            --color: rgba(255,255,255,0.55); --border-radius: 8px;
            --padding-start: 10px; --padding-end: 10px;
            --padding-top: 10px; --padding-bottom: 10px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.88rem; font-weight: 500; width: 100%; margin: 0; justify-content: flex-start;
          }

          /* ── COLUMNA DERECHA ── */
          .ma-right { flex: 1; display: flex; flex-direction: column; min-width: 0; }

          /* ── HEADER ── */
          .ma-header {
            position: relative; min-height: 200px;
            background-image: url('${ASSETS.fondo}');
            background-size: cover; background-position: center center; background-repeat: no-repeat;
            display: flex; align-items: flex-end; padding: 24px 28px;
          }
          .ma-header::after { content: ''; position: absolute; inset: 0; background: rgba(0,10,40,0.55); }
          .ma-header-content { position: relative; z-index: 2; flex: 1; }
          .ma-header-content h1 { font-size: 2rem; font-weight: 700; color: #fff; margin: 0 0 2px; font-family: 'Inter', sans-serif; }
          .ma-header-content p  { font-size: 0.85rem; font-weight: 300; color: rgba(255,255,255,0.75); margin: 0; font-family: 'Inter', sans-serif; }
          .ma-photo-area { position: absolute; top: 16px; right: 20px; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 8px; }
          .ma-photo-box  { width: 110px; height: 110px; background: #c0c8d0; border-radius: 10px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
          .ma-photo-box img { width: 80px; height: 80px; opacity: 0.6; }
          .ma-photo-btn  {
            --background: #002050; --background-hover: #003080; --color: #fff; --border-radius: 8px;
            --padding-start: 10px; --padding-end: 10px; --padding-top: 6px; --padding-bottom: 6px;
            text-transform: none; font-family: 'Inter', sans-serif; font-size: 0.78rem; font-weight: 500; width: 110px; margin: 0;
          }
          .ma-photo-btn img { width: 14px; height: 14px; margin-right: 6px; filter: brightness(0) invert(1); }

          /* ── CONTENIDO ── */
          .ma-content { background: #001830; padding: 24px 28px; flex: 1; }

          /* Tabs de vista */
          .ma-tabs {
            display: flex; align-items: center; gap: 4px;
            background: #002050; border: 1px solid #003070;
            border-radius: 10px; padding: 6px; margin-bottom: 20px;
            width: fit-content;
          }
          .ma-tab {
            --background: transparent; --background-hover: rgba(255,255,255,0.08);
            --color: rgba(255,255,255,0.55); --border-radius: 7px;
            --padding-start: 14px; --padding-end: 14px;
            --padding-top: 8px; --padding-bottom: 8px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.85rem; font-weight: 500; margin: 0;
          }
          .ma-tab.tab-activo { --background: #003060; --color: #fff; font-weight: 600; }
          .ma-tab ion-icon { margin-right: 6px; }

          /* ── LAYOUT CALENDARIO (desktop: lado a lado) ── */
          .ma-cal-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            align-items: start;
          }

          /* Caja calendario */
          .ma-cal-box {
            background: #002050; border: 1px solid #003070; border-radius: 12px;
            padding: 20px;
          }
          .ma-cal-nav {
            display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
          }
          .ma-cal-titulo { font-size: 1.1rem; font-weight: 700; color: #fff; font-family: 'Inter', sans-serif; }
          .btn-mes {
            --background: transparent; --background-hover: rgba(255,255,255,0.10);
            --color: rgba(255,255,255,0.70); --border-radius: 6px;
            --padding-start: 10px; --padding-end: 10px;
            --padding-top: 6px; --padding-bottom: 6px;
            margin: 0; font-size: 1rem;
          }
          .ma-cal-grid {
            display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;
          }
          .ma-cal-header-cell {
            text-align: center; font-size: 0.72rem; font-weight: 600;
            color: rgba(255,255,255,0.45); padding: 4px 0;
            font-family: 'Inter', sans-serif;
          }
          .ma-cal-cell {
            position: relative; aspect-ratio: 1;
            display: flex; flex-direction: column;
            align-items: center; justify-content: flex-start;
            padding-top: 6px; border-radius: 8px; cursor: pointer;
            transition: background 0.15s; font-family: 'Inter', sans-serif;
          }
          .ma-cal-cell:hover { background: rgba(255,255,255,0.07); }
          .ma-cal-cell.seleccionado { background: #003060; }
          .ma-cal-cell.hoy-cell .ma-dia-num { background: #5bb8ff; color: #001830; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; }
          .ma-cal-cell.vacio { cursor: default; }
          .ma-dia-num { font-size: 0.82rem; font-weight: 500; color: rgba(255,255,255,0.85); line-height: 1; }
          .ma-cal-dots { display: flex; gap: 2px; flex-wrap: wrap; justify-content: center; margin-top: 3px; }
          .ma-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

          /* Leyenda */
          .ma-leyenda {
            display: flex; gap: 16px; flex-wrap: wrap; margin-top: 16px;
            padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.08);
          }
          .ma-leyenda-item { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: rgba(255,255,255,0.60); font-family: 'Inter', sans-serif; }

          /* Panel agendas del día */
          .ma-panel-dia {
            background: #002050; border: 1px solid #003070; border-radius: 12px;
            display: flex; flex-direction: column;
          }
          .ma-panel-titulo {
            padding: 16px 20px 12px; border-bottom: 1px solid rgba(255,255,255,0.06);
            font-size: 0.95rem; font-weight: 600; color: #fff;
            font-family: 'Inter', sans-serif; text-transform: capitalize;
          }
          .ma-agenda-item {
            padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06);
            display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;
          }
          .ma-agenda-item:last-of-type { border-bottom: none; }
          .ma-agenda-tipo-badge {
            display: inline-block; padding: 2px 8px; border-radius: 4px;
            font-size: 0.72rem; font-weight: 600; margin-bottom: 4px;
            font-family: 'Inter', sans-serif;
          }
          .ma-agenda-titulo { font-size: 0.92rem; font-weight: 600; color: #fff; margin: 0 0 6px; font-family: 'Inter', sans-serif; }
          .ma-agenda-meta { display: flex; flex-direction: column; gap: 3px; }
          .ma-agenda-meta-row { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: rgba(255,255,255,0.60); font-family: 'Inter', sans-serif; }
          .ma-agenda-hora { font-size: 0.88rem; font-weight: 700; color: #fff; font-family: 'Inter', sans-serif; white-space: nowrap; }
          .ma-agenda-estado { font-size: 0.75rem; font-weight: 500; font-family: 'Inter', sans-serif; }
          .ma-agenda-cancelar { font-size: 0.75rem; color: #ff5c5c; cursor: pointer; background: none; border: none; font-family: 'Inter', sans-serif; font-weight: 500; padding: 0; margin-top: 4px; }
          .ma-agenda-cancelar:hover { text-decoration: underline; }
          .ma-agenda-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }

          /* Paginación panel */
          .ma-panel-pag {
            display: flex; justify-content: space-between; align-items: center;
            padding: 12px 20px; border-top: 1px solid rgba(255,255,255,0.06);
          }
          .ma-panel-pag-info { font-size: 0.75rem; color: rgba(255,255,255,0.40); font-family: 'Inter', sans-serif; }
          .ma-panel-pag-btns { display: flex; gap: 3px; }
          .btn-pag-sm {
            --background: transparent; --background-hover: rgba(255,255,255,0.10);
            --color: rgba(255,255,255,0.60); --border-radius: 5px;
            --border-width: 1px; --border-style: solid; --border-color: rgba(255,255,255,0.18);
            --padding-start: 6px; --padding-end: 6px;
            --padding-top: 3px; --padding-bottom: 3px;
            margin: 0; height: 28px; min-width: 28px; font-size: 0.75rem; text-transform: none;
          }
          .btn-pag-sm.pag-activa { --background: #003060; --color: #fff; --border-color: #003060; }

          /* Vacío */
          .ma-vacio { padding: 48px 20px; text-align: center; }
          .ma-vacio h3 { color: rgba(255,255,255,0.55); font-size: 1rem; font-weight: 600; margin: 0 0 6px; font-family: 'Inter', sans-serif; }
          .ma-vacio p  { color: rgba(255,255,255,0.35); font-size: 0.82rem; margin: 0; font-family: 'Inter', sans-serif; }

          /* Vista lista / proximas */
          .ma-lista { display: flex; flex-direction: column; gap: 12px; }
          .ma-lista-item {
            background: #002050; border: 1px solid #003070; border-radius: 10px;
            padding: 16px 20px; display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;
          }
          .ma-lista-left { flex: 1; }
          .ma-lista-fecha { font-size: 0.78rem; color: rgba(255,255,255,0.50); margin-bottom: 4px; font-family: 'Inter', sans-serif; text-transform: capitalize; }

          /* ── FOOTER ── */
          .ma-footer {
            background: #003060; border-top: 1px solid rgba(255,255,255,0.10);
            padding: 28px 36px 16px;
            display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px;
          }
          .ma-footer-block { display: flex; flex-direction: column; gap: 4px; font-family: 'Inter', sans-serif; }
          .ma-footer-block strong { color: #fff; font-size: 1rem; font-weight: 700; }
          .ma-footer-block span { color: rgba(255,255,255,0.75); font-size: 0.88rem; font-weight: 300; }
          .ma-footer-icon-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
          .ma-footer-icon-row img { width: 22px; height: 22px; }
          .ma-footer-divider { width: 1px; background: rgba(255,255,255,0.20); align-self: stretch; }
          .ma-footer-copy { text-align: center; color: rgba(255,255,255,0.35); font-size: 0.75rem; font-weight: 300; padding: 12px 0 8px; background: #003060; font-family: 'Inter', sans-serif; }

          /* Bottom nav móvil */
          .ma-bottom-nav { display: none; }

          /* ══════════════ MÓVIL ══════════════ */
          @media (max-width: 600px) and (orientation: portrait) {
            .ma-root { flex-direction: column; }
            .ma-sidebar { display: none; }
            .ma-header { min-height: 150px; padding: 16px; }
            .ma-header-content h1 { font-size: 1.6rem; }
            .ma-photo-area { top: 10px; right: 12px; }
            .ma-photo-box { width: 80px; height: 80px; }
            .ma-photo-box img { width: 55px; height: 55px; }
            .ma-photo-btn { width: 80px; font-size: 0.72rem; }
            .ma-content { padding: 16px 14px; }

            /* En móvil: calendario arriba, panel abajo */
            .ma-cal-layout { grid-template-columns: 1fr; }
            .ma-tabs { width: 100%; justify-content: stretch; }
            .ma-tab { flex: 1; justify-content: center; }

            .ma-footer { flex-direction: column; padding: 20px 20px 12px; gap: 16px; }
            .ma-footer-divider { display: none; }

            .ma-bottom-nav {
              display: flex; justify-content: space-around;
              background: #003060; border-top: 1px solid rgba(255,255,255,0.15);
              padding: 10px 4px 14px; position: sticky; bottom: 0; z-index: 20; width: 100%; gap: 2px;
            }
            .ma-bottom-btn {
              --background: transparent; --color: rgba(255,255,255,0.70);
              --border-radius: 8px; text-transform: none; font-family: 'Inter', sans-serif;
              font-size: 0.65rem; font-weight: 500; flex: 1; margin: 0;
            }
            .ma-bottom-btn.active-nav { --color: #fff; }
            .ma-bottom-icon { width: 22px; height: 22px; filter: brightness(0) invert(1); opacity: 0.75; display: block; margin: 0 auto 3px; }
          }
        `}</style>

        <div className="ma-root">

          {/* SIDEBAR */}
          <div className="ma-sidebar">
            <img className="ma-sidebar-logo" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />
            <IonButton className="ma-nav-btn" fill="clear" onClick={() => history.push('/profile')}>
              <img className="ma-nav-icon" src={ASSETS.perfilBlanco} alt="" />Mi perfil
            </IonButton>
            <IonButton className="ma-nav-btn" fill="clear" onClick={() => history.push('/mis-tramites')}>
              <img className="ma-nav-icon" src={ASSETS.tramite} alt="" />Mis trámites
            </IonButton>
            <IonButton className="ma-nav-btn active-nav" fill="clear" onClick={() => history.push('/mis-agendas')}>
              <img className="ma-nav-icon" src={ASSETS.calendario} alt="" />Mis agendas
            </IonButton>
            <div className="ma-sidebar-spacer" />
            <IonButton className="ma-nav-logout" fill="clear" onClick={handleLogout}>
              <img className="ma-nav-icon" src={ASSETS.puerta} alt="" />Cerrar sesión
            </IonButton>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="ma-right">

            {/* Header */}
            <div className="ma-header">
              <div className="ma-header-content">
                <h1>Mis agendas</h1>
                <p>Administra tus citas y reuniones programadas</p>
              </div>
              <div className="ma-photo-area">
                <div className="ma-photo-box">
                  <img src={ASSETS.usuarioGris} alt="Foto perfil" />
                </div>
                <ConstructionAlert>
                  <IonButton className="ma-photo-btn" fill="clear">
                    <img src={ASSETS.camara} alt="" />Agregar foto
                  </IonButton>
                </ConstructionAlert>
              </div>
            </div>

            {/* Contenido */}
            <div className="ma-content">

              {/* Tabs de vista */}
              <div className="ma-tabs">
                <IonButton
                  className={`ma-tab${vista === 'calendario' ? ' tab-activo' : ''}`}
                  fill="clear"
                  onClick={() => setVista('calendario')}
                >
                  <IonIcon icon={calendarOutline} />Calendario
                </IonButton>
                <IonButton
                  className={`ma-tab${vista === 'lista' ? ' tab-activo' : ''}`}
                  fill="clear"
                  onClick={() => setVista('lista')}
                >
                  <IonIcon icon={listOutline} />Vista lista
                </IonButton>
                <IonButton
                  className={`ma-tab${vista === 'proximas' ? ' tab-activo' : ''}`}
                  fill="clear"
                  onClick={() => setVista('proximas')}
                >
                  <IonIcon icon={clockOutline} />Próximas citas
                </IonButton>
              </div>

              {cargando ? (
                <div className="ma-vacio"><IonSpinner name="crescent" /><p style={{ color: 'rgba(255,255,255,0.50)', marginTop: 12, fontFamily: 'Inter' }}>Cargando agendas...</p></div>
              ) : vista === 'calendario' ? (

                <div className="ma-cal-layout">

                  {/* ── Calendario ── */}
                  <div className="ma-cal-box">
                    <div className="ma-cal-nav">
                      <IonButton className="btn-mes" fill="clear" onClick={() => {
                        if (mesActual === 0) { setMesActual(11); setAnioActual(a => a - 1); }
                        else setMesActual(m => m - 1);
                      }}>◁</IonButton>
                      <span className="ma-cal-titulo">{MESES[mesActual]} {anioActual}</span>
                      <IonButton className="btn-mes" fill="clear" onClick={() => {
                        if (mesActual === 11) { setMesActual(0); setAnioActual(a => a + 1); }
                        else setMesActual(m => m + 1);
                      }}>▷</IonButton>
                    </div>

                    <div className="ma-cal-grid">
                      {DIAS.map(d => (
                        <div key={d} className="ma-cal-header-cell">{d}</div>
                      ))}
                      {celdasCalendario.map((dia, idx) => {
                        if (dia === null) return <div key={`v${idx}`} className="ma-cal-cell vacio" />;
                        const esHoy = dia === hoy.getDate() && mesActual === hoy.getMonth() && anioActual === hoy.getFullYear();
                        const esSelec = dia === diaSelec;
                        const dotsAg = agendasPorDia[dia] ?? [];
                        return (
                          <div
                            key={dia}
                            className={`ma-cal-cell${esSelec ? ' seleccionado' : ''}${esHoy ? ' hoy-cell' : ''}`}
                            onClick={() => setDiaSelec(dia)}
                          >
                            <span className="ma-dia-num">{dia}</span>
                            {dotsAg.length > 0 && (
                              <div className="ma-cal-dots">
                                {dotsAg.slice(0, 3).map((ag, i) => (
                                  <span key={i} className="ma-dot" style={{ background: getTipoColor(ag.tipo) }} />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Leyenda */}
                    <div className="ma-leyenda">
                      {Object.entries(TIPO_CONFIG).map(([tipo, cfg]) => (
                        <div key={tipo} className="ma-leyenda-item">
                          <span className="ma-dot" style={{ background: cfg.color, width: 8, height: 8 }} />
                          {cfg.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Panel del día ── */}
                  <div className="ma-panel-dia">
                    <div className="ma-panel-titulo">
                      {diaSelec ? fechaSelecLabel : 'Selecciona un día'}
                    </div>

                    {!diaSelec || agendasDia.length === 0 ? (
                      <div className="ma-vacio">
                        <IonIcon icon={calendarOutline} style={{ fontSize: '2.5rem', color: 'rgba(255,255,255,0.20)' }} />
                        <h3>Sin agendas este día</h3>
                        <p>Selecciona otro día o revisa otras vistas.</p>
                      </div>
                    ) : (
                      <>
                        {agendasPagina.map((ag, i) => {
                          const f = formatearFechaHora(ag.fecha_evento, ag.tipo);
                          const color = getTipoColor(ag.tipo);
                          return (
                            <div key={i} className="ma-agenda-item">
                              <div style={{ flex: 1 }}>
                                <span
                                  className="ma-agenda-tipo-badge"
                                  style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}
                                >
                                  {ag.tipo}
                                </span>
                                <p className="ma-agenda-titulo">{ag.titulo}</p>
                                <div className="ma-agenda-meta">
                                  <div className="ma-agenda-meta-row">
                                    <IonIcon icon={timeOutline} />
                                    <span>{f.hora} hrs</span>
                                  </div>
                                  <div className="ma-agenda-meta-row">
                                    <IonIcon icon={locationOutline} />
                                    <span>{ag.tipo === 'Taller DIDECO' ? 'Gimnasio Municipal' : 'Dirección de Tránsito'}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="ma-agenda-right">
                                <span className="ma-agenda-hora">{f.hora}</span>
                                <span className="ma-agenda-estado" style={{ color: '#4cde80' }}>Confirmada</span>
                                <button
                                  className="ma-agenda-cancelar"
                                  onClick={() => cancelarAgenda(ag.id, ag.tipo, ag.taller_id)}
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {/* Paginación panel */}
                        <div className="ma-panel-pag">
                          <span className="ma-panel-pag-info">
                            {(pagAgendas - 1) * AGENDAS_POR_PAG + 1}–{Math.min(pagAgendas * AGENDAS_POR_PAG, agendasDia.length)} de {agendasDia.length}
                          </span>
                          <div className="ma-panel-pag-btns">
                            <IonButton className="btn-pag-sm" fill="outline" disabled={pagAgendas === 1} onClick={() => setPagAgendas(1)}>⟪</IonButton>
                            <IonButton className="btn-pag-sm" fill="outline" disabled={pagAgendas === 1} onClick={() => setPagAgendas(p => p - 1)}>‹</IonButton>
                            {Array.from({ length: totalPagsDia }, (_, i) => i + 1).map(n => (
                              <IonButton key={n} className={`btn-pag-sm${pagAgendas === n ? ' pag-activa' : ''}`} fill="outline" onClick={() => setPagAgendas(n)}>{n}</IonButton>
                            ))}
                            <IonButton className="btn-pag-sm" fill="outline" disabled={pagAgendas === totalPagsDia} onClick={() => setPagAgendas(p => p + 1)}>›</IonButton>
                            <IonButton className="btn-pag-sm" fill="outline" disabled={pagAgendas === totalPagsDia} onClick={() => setPagAgendas(totalPagsDia)}>⟫</IonButton>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

              ) : (
                /* Vista lista / próximas */
                <div className="ma-lista">
                  {agendasFuturas.length === 0 ? (
                    <div className="ma-vacio">
                      <IonIcon icon={calendarOutline} style={{ fontSize: '2.5rem', color: 'rgba(255,255,255,0.20)' }} />
                      <h3>No tienes reservas activas</h3>
                      <p>Tus inscripciones aparecerán aquí.</p>
                    </div>
                  ) : agendasFuturas.map((ag, i) => {
                    const f = ag._f;
                    const color = getTipoColor(ag.tipo);
                    return (
                      <div key={i} className="ma-lista-item">
                        <div className="ma-lista-left">
                          <p className="ma-lista-fecha">{f.dia}</p>
                          <span className="ma-agenda-tipo-badge" style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}>{ag.tipo}</span>
                          <p className="ma-agenda-titulo" style={{ marginTop: 6 }}>{ag.titulo}</p>
                          <div className="ma-agenda-meta">
                            <div className="ma-agenda-meta-row"><IonIcon icon={timeOutline} /><span>{f.hora} hrs</span></div>
                            <div className="ma-agenda-meta-row"><IonIcon icon={locationOutline} /><span>{ag.tipo === 'Taller DIDECO' ? 'Gimnasio Municipal' : 'Dirección de Tránsito'}</span></div>
                          </div>
                        </div>
                        <div className="ma-agenda-right">
                          <span className="ma-agenda-hora">{f.hora}</span>
                          <span className="ma-agenda-estado" style={{ color: '#4cde80' }}>Confirmada</span>
                          <button className="ma-agenda-cancelar" onClick={() => cancelarAgenda(ag.id, ag.tipo, ag.taller_id)}>Cancelar</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="ma-footer">
              <div className="ma-footer-block">
                <div className="ma-footer-icon-row"><img src={ASSETS.ubicacion} alt="" /><strong>Dirección</strong></div>
                <span>Avenida Santa Teresa N°1.</span><span>Santo Domingo, Chile</span>
              </div>
              <div className="ma-footer-divider" />
              <div className="ma-footer-block">
                <div className="ma-footer-icon-row"><img src={ASSETS.phone} alt="" /><strong>Emergencias 24 horas:</strong></div>
                <span>+563 2238 1603 • +563 5220 4200</span><span>Seguridad: 1458 • contacto@santodomingo.cl</span>
              </div>
              <div className="ma-footer-divider" />
              <div className="ma-footer-block">
                <div className="ma-footer-icon-row"><img src={ASSETS.reloj} alt="" /><strong>Horario</strong></div>
                <span>Lunes a Viernes: 08:45am a 14:00 pm</span><span>Sábado: 09:30am a 13:30pm</span>
              </div>
            </div>
            <div className="ma-footer-copy">©2026 Municipalidad de Santo Domingo &nbsp;•&nbsp; Política de Privacidad</div>

            {/* Bottom nav móvil */}
            <div className="ma-bottom-nav">
              <IonButton className="ma-bottom-btn" fill="clear" onClick={() => history.push('/profile')}>
                <img className="ma-bottom-icon" src={ASSETS.perfilBlanco} alt="" />Mi perfil
              </IonButton>
              <IonButton className="ma-bottom-btn" fill="clear" onClick={() => history.push('/mis-tramites')}>
                <img className="ma-bottom-icon" src={ASSETS.tramite} alt="" />Mis trámites
              </IonButton>
              <IonButton className="ma-bottom-btn active-nav" fill="clear" onClick={() => history.push('/mis-agendas')}>
                <img className="ma-bottom-icon" src={ASSETS.calendario} alt="" />Mis agendas
              </IonButton>
              <IonButton className="ma-bottom-btn" fill="clear" onClick={handleLogout}>
                <img className="ma-bottom-icon" src={ASSETS.puerta} alt="" />Cerrar sesión
              </IonButton>
            </div>

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
