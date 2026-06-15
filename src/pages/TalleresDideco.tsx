import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonButton, IonIcon, useIonAlert
} from "@ionic/react";
import { useHistory } from 'react-router-dom';
import { personOutline } from 'ionicons/icons';
import ConstructionAlert from '../components/ConstructionAlert';
import { authService } from '../services/authService';

const ASSETS = {
  fondo:       'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/FondoSantoDomigno.png',
  logo:        'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/LogoSantoDomingoAzul.png',
  ubicacion:   'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UbicacionBlanco.png',
  reloj:       'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/RelojBlanco.png',
  phone:       'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PhoneBlanco.png',
  arteterapia: 'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/Arteterapia.png',
  cocina:      'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/CocinaSaludable.png',
  folklore:    'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/Folklore.png',
  futbol:      'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/FutbolFem.png',
  yoga:        'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/Yoga3ra.png',
  zumba:       'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/Zumba.png',
};

const TALLERES = [
  {
    id: 'arteterapia',
    titulo: 'Arteterapia',
    desc: 'Espacio de expresión y bienestar emocional.',
    img: ASSETS.arteterapia,
    ruta: null,
  },
  {
    id: 'zumba',
    titulo: 'Zumba',
    desc: 'Ponte en movimiento al ritmo de la música.',
    img: ASSETS.zumba,
    ruta: '/talleres/zumba',
  },
  {
    id: 'folklore',
    titulo: 'Folklore',
    desc: 'Música y baile de nuestras raíces.',
    img: ASSETS.folklore,
    ruta: null,
  },
  {
    id: 'yoga',
    titulo: 'Yoga 3ra edad',
    desc: 'Bienestar físico y mental para adultos mayores.',
    img: ASSETS.yoga,
    ruta: null,
  },
  {
    id: 'cocina',
    titulo: 'Cocina saludable',
    desc: 'Alimentación saludable para una mejor calidad de vida.',
    img: ASSETS.cocina,
    ruta: null,
  },
  {
    id: 'futbol',
    titulo: 'Fútbol Femenino',
    desc: 'Fomenta el deporte, trabajo en equipo y recreación.',
    img: ASSETS.futbol,
    ruta: null,
  },
];

export default function TalleresDideco() {
  const history = useHistory();

  // ── Lógica original intacta ──
  useEffect(() => {
    const checkSession = async () => {
      try {
        await authService.verifySession();
      } catch (error) {
        authService.logout();
        history.push('/login');
      }
    };
    checkSession();
  }, [history]);

  return (
    <IonPage>
      <IonContent fullscreen scrollY={false} style={{ '--background': '#f4f6fa' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

          .td-root * { box-sizing: border-box; }
          .td-root h1, .td-root h2, .td-root p { margin: 0; padding: 0; }

          .td-root {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            display: flex; flex-direction: column;
            font-family: 'Inter', sans-serif;
            background: #f4f6fa;
            overflow-y: auto; overflow-x: hidden;
          }

          /* ── HEADER ── */
          .td-header {
            flex-shrink: 0;
            position: relative; min-height: 180px;
            background-image: url('${ASSETS.fondo}');
            background-size: cover; background-position: center;
            display: flex; align-items: flex-end;
          }
          .td-header::after {
            content: ''; position: absolute; inset: 0;
            background: rgba(0,10,40,0.52);
          }
          .td-header-inner {
            position: relative; z-index: 2; width: 100%;
            display: flex; align-items: flex-end;
            justify-content: space-between;
            padding: 20px 32px 24px; flex-wrap: wrap; gap: 16px;
          }
          .td-header-left { display: flex; align-items: flex-end; gap: 20px; }
          .td-header-logo { width: 90px; filter: brightness(0) invert(1); display: block; }
          .td-header-texts h1 {
            font-size: 0.9rem; font-weight: 400;
            color: rgba(255,255,255,0.80); margin-bottom: 2px;
            font-family: 'Inter', sans-serif;
          }
          .td-header-texts h2 {
            font-size: 1.8rem; font-weight: 800; color: #fff;
            line-height: 1.1; font-family: 'Inter', sans-serif;
          }
          .td-header-right {
            display: flex; flex-direction: column;
            align-items: flex-end; gap: 8px;
          }
          .btn-perfil {
            --background: #003060; --background-hover: #00428a; --color: #fff;
            --border-radius: 10px; --padding-start: 20px; --padding-end: 20px;
            --padding-top: 10px; --padding-bottom: 10px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.9rem; font-weight: 600; margin: 0;
          }
          .btn-volver-header {
            --background: #003060; --background-hover: #00428a; --color: #fff;
            --border-radius: 10px; --padding-start: 20px; --padding-end: 20px;
            --padding-top: 10px; --padding-bottom: 10px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.9rem; font-weight: 700; margin: 0;
          }

          /* ── CONTENIDO ── */
          .td-main-wrap {
            flex: 1; display: flex; justify-content: center;
            padding: 32px 24px 28px;
          }
          .td-main { max-width: 1200px; width: 100%; }

          /* Grid 3 columnas */
          .td-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }

          /* Card */
          .td-card-wrap {
            background: #fff; border-radius: 16px;
            box-shadow: 0 2px 14px rgba(0,0,0,0.07);
            overflow: hidden; cursor: pointer;
            transition: transform 0.18s, box-shadow 0.18s;
            display: flex; flex-direction: column;
          }
          .td-card-wrap:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.13);
          }

          /* Imagen */
          .td-card-img {
            width: 100%; display: block;
            object-fit: cover;
          }

          /* Info debajo de la imagen */
          .td-card-info { padding: 14px 16px 0; }
          .td-card-titulo {
            font-size: 0.95rem; font-weight: 700; color: #003060;
            margin: 0 0 4px; font-family: 'Inter', sans-serif;
          }
          .td-card-desc {
            font-size: 0.78rem; color: #6b7280; font-weight: 400;
            margin: 0; font-family: 'Inter', sans-serif; line-height: 1.4;
          }

          /* Botón inscribirse */
          .btn-inscribir {
            --background: #f0f4fa; --background-hover: #e2eaf5;
            --color: #003060; --border-radius: 0;
            --padding-start: 14px; --padding-end: 14px;
            --padding-top: 10px; --padding-bottom: 10px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.80rem; font-weight: 600;
            width: 100%; margin: 10px 0 0;
            border-top: 1px solid #e4eaf4;
            justify-content: flex-start;
          }
          .td-inscribir-arrow {
            display: inline-block; margin-right: 6px;
            font-size: 0.72rem;
          }

          /* ── FOOTER ── */
          .td-footer {
            flex-shrink: 0; background: #003060;
            padding: 28px 36px 20px;
            display: flex; justify-content: space-between;
            align-items: flex-start; flex-wrap: wrap; gap: 20px;
          }
          .td-footer-block { display: flex; flex-direction: column; gap: 4px; font-family: 'Inter', sans-serif; }
          .td-footer-block strong { color: #fff; font-size: 1rem; font-weight: 700; }
          .td-footer-block span   { color: rgba(255,255,255,0.75); font-size: 0.88rem; font-weight: 300; }
          .td-footer-icon-row     { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
          .td-footer-icon-row img { width: 22px; height: 22px; }
          .td-footer-divider      { width: 1px; background: rgba(255,255,255,0.20); align-self: stretch; }
          .td-footer-copy {
            flex-shrink: 0; text-align: center;
            color: rgba(255,255,255,0.35); font-size: 0.75rem; font-weight: 300;
            padding: 12px 0 10px; background: #003060; font-family: 'Inter', sans-serif;
          }

          /* Tablet */
          @media (min-width: 601px) and (max-width: 900px) {
            .td-grid { grid-template-columns: repeat(2, 1fr); }
          }

          /* Móvil */
          @media (max-width: 600px) {
            .td-header-inner { padding: 14px 16px 18px; flex-direction: column; align-items: flex-start; }
            .td-header-logo  { width: 70px; }
            .td-header-texts h2 { font-size: 1.25rem; }
            .td-header-left  { gap: 10px; align-items: flex-start; }
            .td-header-right { align-items: flex-start; }
            .td-main-wrap    { padding: 18px 14px 20px; }
            .td-grid         { grid-template-columns: 1fr; gap: 14px; }
            .td-footer       { flex-direction: column; padding: 20px 16px 16px; gap: 16px; }
            .td-footer-divider { display: none; }
          }
        `}</style>

        <div className="td-root">

          {/* HEADER */}
          <div className="td-header">
            <div className="td-header-inner">
              <div className="td-header-left">
                <img className="td-header-logo" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />
                <div className="td-header-texts">
                  <h1>Bienvenido/a a la plataforma de</h1>
                  <h2>Talleres DIDECO</h2>
                </div>
              </div>
              <div className="td-header-right">
                <IonButton className="btn-perfil" onClick={() => history.push('/profile')}>
                  <IonIcon slot="start" icon={personOutline} />
                  Mi Perfil
                </IonButton>
                <IonButton className="btn-volver-header" onClick={() => history.push('/tramites-user')}>
                  Volver
                </IonButton>
              </div>
            </div>
          </div>

          {/* CONTENIDO */}
          <div className="td-main-wrap">
            <div className="td-main">
              <div className="td-grid">
                {TALLERES.map((taller) => {
                  const CardInner = (
                    <div className="td-card-wrap">
                      <img
                        className="td-card-img"
                        src={taller.img}
                        alt={taller.titulo}
                      />
                      <div className="td-card-info">
                        <p className="td-card-titulo">{taller.titulo}</p>
                        <p className="td-card-desc">{taller.desc}</p>
                      </div>
                      <IonButton
                        className="btn-inscribir"
                        fill="clear"
                        onClick={() => taller.ruta && history.push(taller.ruta)}
                      >
                        <span className="td-inscribir-arrow">▶</span>
                        Inscribirse
                      </IonButton>
                    </div>
                  );

                  // Zumba tiene ruta directa; el resto pasa por ConstructionAlert
                  return taller.ruta ? (
                    <div key={taller.id}>
                      {CardInner}
                    </div>
                  ) : (
                    <ConstructionAlert key={taller.id}>
                      {CardInner}
                    </ConstructionAlert>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="td-footer">
            <div className="td-footer-block">
              <div className="td-footer-icon-row">
                <img src={ASSETS.ubicacion} alt="" />
                <strong>Dirección</strong>
              </div>
              <span>Avenida Santa Teresa N°1.</span>
              <span>Santo Domingo, Chile</span>
            </div>
            <div className="td-footer-divider" />
            <div className="td-footer-block">
              <div className="td-footer-icon-row">
                <img src={ASSETS.phone} alt="" />
                <strong>Emergencias 24 horas:</strong>
              </div>
              <span>+563 2238 1603 • +563 5220 4200</span>
              <span>Seguridad: 1458 • contacto@santodomingo.cl</span>
            </div>
            <div className="td-footer-divider" />
            <div className="td-footer-block">
              <div className="td-footer-icon-row">
                <img src={ASSETS.reloj} alt="" />
                <strong>Horario</strong>
              </div>
              <span>Lunes a Viernes: 08:45am a 14:00 pm</span>
              <span>Sábado: 09:30am a 13:30pm</span>
            </div>
          </div>
          <div className="td-footer-copy">
            ©2026 Municipalidad de Santo Domingo &nbsp;•&nbsp; Política de Privacidad
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
}
