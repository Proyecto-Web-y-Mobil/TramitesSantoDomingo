import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonButton, IonGrid, IonRow, IonCol
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { authService } from '../services/authService';

const ASSETS = {
  fondo:  'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/FondoSantoDomigno.png',
  logo:   'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/LogoSantoDomingoAzul.png',
  puerta: 'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PuertaSalir.png',
};

const IconoReporte = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
    <line x1="30" y1="8"  x2="30" y2="42" stroke="#1a73c8" strokeWidth="5" strokeLinecap="round"/>
    <polyline points="16,30 30,44 44,30" fill="none" stroke="#1a73c8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="52" x2="48" y2="52" stroke="#1a73c8" strokeWidth="5" strokeLinecap="round"/>
  </svg>
);

const IconoTramite = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
    <path d="M10 18 Q10 10 18 10 L36 10 L50 26 L50 52 Q50 54 48 54 L18 54 Q10 54 10 52 Z"
      fill="none" stroke="#c0392b" strokeWidth="4" strokeLinejoin="round"/>
    <path d="M36 10 L36 26 L50 26" fill="none" stroke="#c0392b" strokeWidth="4" strokeLinejoin="round"/>
  </svg>
);

const IconoResidencia = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
    <circle cx="30" cy="30" r="22" fill="none" stroke="#27ae60" strokeWidth="4.5"/>
    <polyline points="16,30 25,40 44,20" fill="none" stroke="#27ae60" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CARDS = [
  {
    id: 'reportes',
    titulo: 'Generar reportes',
    desc: 'Visualiza y exporta reportes estadísticos de trámites y servicios',
    ruta: '/admin/reportes',
    Icono: IconoReporte,
    bg: '#eef4ff',
    border: '#c5d8f8',
  },
  {
    id: 'tramites',
    titulo: 'Trámites asignados',
    desc: 'Revisa y gestiona los trámites asignados a tu unidad',
    ruta: '/admin/tramites',
    Icono: IconoTramite,
    bg: '#fff0f0',
    border: '#f5c6c6',
  },
  {
    id: 'residencias',
    titulo: 'Confirmaciones de residencia',
    desc: 'Revisa y valida las solicitudes de confirmaciones de residencia',
    ruta: '/admin/residencias',
    Icono: IconoResidencia,
    bg: '#f0fff5',
    border: '#b7e9c8',
  },
];

const AdminDashboard: React.FC = () => {
  const history = useHistory();
  const [nombreAdmin, setNombreAdmin] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      try {
        await authService.verifySession();
        const session = localStorage.getItem('user_session');
        if (session) {
          const userObj = JSON.parse(session);
          const user = Array.isArray(userObj) ? userObj[0] : userObj;
          
          // Validación de seguridad mantenida correctamente
          if (user.rol !== 'funcionario') {
            history.replace('/tramites-user');
            return;
          }
          
          setNombreAdmin(`${user.nombres} ${user.apellidoP}`);
        } else {
          history.push('/login-funcionario');
        }
      } catch (error) {
        authService.logout();
        history.push('/login-funcionario');
      }
    };
    checkSession();
  }, [history]);

  const handleCerrarSesion = () => {
    authService.logout();
    history.push('/login-funcionario');
  };

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': '#f0f2f5' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          * { box-sizing: border-box; }

          /* ── Raíz con scroll propio ── */
          .adm-root {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            display: flex; flex-direction: row;
            font-family: 'Inter', sans-serif;
            background: #f0f2f5;
            overflow-y: auto; overflow-x: hidden;
          }

          /* ══════════════════════════
             SIDEBAR — cubre todo el lado
             izquierdo en desktop
          ══════════════════════════ */
          .adm-sidebar {
            width: 200px;
            flex-shrink: 0;
            background: #002050;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 28px 16px 24px;
            position: sticky;
            top: 0;
            height: 100vh;
            /* altura mínima igual a la pantalla para que se extienda */
            min-height: 100vh;
          }
          .adm-sidebar-logo {
            width: 120px;
            filter: brightness(0) invert(1);
          }

          /* ── COLUMNA DERECHA ── */
          .adm-right {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-width: 0;
          }

          /* ── HEADER con fondo foto ── */
          .adm-header {
            flex-shrink: 0;
            position: relative;
            min-height: 150px;
            background-image: url('${ASSETS.fondo}');
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
            padding: 24px 32px;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
          }
          .adm-header::after {
            content: ''; position: absolute; inset: 0;
            background: rgba(0,10,40,0.58);
          }
          .adm-header-texts {
            position: relative; z-index: 2;
          }
          .adm-header-texts h1 {
            font-size: 2.4rem; font-weight: 800; color: #fff;
            margin: 0 0 6px; font-family: 'Inter', sans-serif; line-height: 1;
          }
          .adm-header-texts .bienvenido {
            font-size: 0.88rem; font-weight: 400;
            color: rgba(255,255,255,0.80); margin: 0 0 2px;
            font-family: 'Inter', sans-serif;
          }
          .adm-header-texts .bienvenido strong {
            font-weight: 600; font-style: italic; color: #fff;
          }
          .adm-header-texts .subtitulo {
            font-size: 0.82rem; font-weight: 600;
            color: rgba(255,255,255,0.70); margin: 0;
            font-family: 'Inter', sans-serif;
          }

          .btn-cerrar {
            position: relative; z-index: 2;
            --background: #003060; --background-hover: #00428a; --color: #fff;
            --border-radius: 10px;
            --padding-start: 18px; --padding-end: 18px;
            --padding-top: 10px; --padding-bottom: 10px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.88rem; font-weight: 600; margin: 0; flex-shrink: 0;
          }
          .btn-cerrar-icon {
            width: 18px; height: 18px;
            filter: brightness(0) invert(1); margin-right: 8px;
          }

          /* ── CONTENIDO ── */
          .adm-main {
            flex: 1;
            padding: 40px 48px;
            display: flex;
            justify-content: center;
          }
          .adm-cards {
            width: 100%;
            max-width: 860px;
            display: flex;
            flex-direction: column;
            gap: 24px;
          }

          /* Card — fondo de color completo */
          .adm-card {
            display: flex;
            align-items: center;
            gap: 28px;
            border-radius: 16px;
            padding: 36px 32px;
            cursor: pointer;
            border: 1.5px solid transparent;
            transition: box-shadow 0.2s, transform 0.2s;
          }
          .adm-card:hover {
            box-shadow: 0 8px 28px rgba(0,0,0,0.12);
            transform: translateY(-3px);
          }
          .adm-card-icon {
            flex-shrink: 0;
            display: flex; align-items: center; justify-content: center;
            width: 80px; height: 80px;
          }
          .adm-card-texts { flex: 1; }
          .adm-card-titulo {
            font-size: 1.6rem; font-weight: 700; color: #003060;
            margin: 0 0 8px; font-family: 'Inter', sans-serif;
          }
          .adm-card-desc {
            font-size: 0.88rem; font-weight: 400; color: #5a6880;
            margin: 0; font-family: 'Inter', sans-serif; line-height: 1.5;
          }
          .adm-card-arrow {
            font-size: 1.6rem; color: #9ca3af;
            flex-shrink: 0; margin-left: 8px;
          }

          /* ══════════ MÓVIL ══════════ */
          @media (max-width: 600px) {
            /* Quitar sidebar */
            .adm-root { flex-direction: column; }
            .adm-sidebar { display: none; }

            .adm-header { min-height: 120px; padding: 16px; }
            .adm-header-texts h1 { font-size: 1.7rem; }
            .adm-header-texts .bienvenido { font-size: 0.80rem; }
            .adm-header-texts .subtitulo { font-size: 0.75rem; }
            .btn-cerrar { font-size: 0.80rem; --padding-start: 12px; --padding-end: 12px; }

            .adm-main { padding: 20px 14px; }
            .adm-card { padding: 22px 18px; gap: 16px; }
            .adm-card-icon { width: 60px; height: 60px; }
            .adm-card-titulo { font-size: 1.15rem; }
            .adm-card-desc { font-size: 0.78rem; }
            .adm-card-arrow { font-size: 1.2rem; }
          }
        `}</style>

        <div className="adm-root">

          {/* ══ SIDEBAR — cubre todo el lateral izquierdo ══ */}
          <div className="adm-sidebar">
            <img className="adm-sidebar-logo" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />
          </div>

          {/* ══ COLUMNA DERECHA ══ */}
          <div className="adm-right">

            {/* Header con fondo foto */}
            <div className="adm-header">
              <div className="adm-header-texts">
                <h1>Administrador</h1>
                <p className="bienvenido">
                  Bienvenido, <strong>{nombreAdmin || 'Cargando...'}</strong>
                </p>
                <p className="subtitulo">
                  Gestiona y administra los trámites y servicios municipales
                </p>
              </div>

              <IonButton className="btn-cerrar" onClick={handleCerrarSesion}>
                <img className="btn-cerrar-icon" src={ASSETS.puerta} alt="" />
                Cerrar sesión
              </IonButton>
            </div>

            {/* Cards */}
            <div className="adm-main">
              <IonGrid style={{ padding: 0, width: '100%', maxWidth: 860 }}>
                <IonRow>
                  <IonCol size="12">
                    <div className="adm-cards">
                      {CARDS.map(({ id, titulo, desc, ruta, Icono, bg, border }) => (
                        <div
                          key={id}
                          className="adm-card"
                          style={{ background: bg, borderColor: border }}
                          onClick={() => history.push(ruta)}
                        >
                          <div className="adm-card-icon">
                            <Icono />
                          </div>
                          <div className="adm-card-texts">
                            <p className="adm-card-titulo">{titulo}</p>
                            <p className="adm-card-desc">{desc}</p>
                          </div>
                          <span className="adm-card-arrow">▷</span>
                        </div>
                      ))}
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;