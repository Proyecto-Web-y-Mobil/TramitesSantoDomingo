import React, { useEffect } from 'react';
import {
  IonPage, IonContent, IonButton,
  IonGrid, IonRow, IonCol, IonCard, IonCardContent
} from "@ionic/react";
import { useHistory } from 'react-router-dom';
import ConstructionAlert from '../components/ConstructionAlert';
import { authService } from '../services/authService';

const ASSETS = {
  fondo:     'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/FondoSantoDomigno.png',
  logo:      'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/LogoSantoDomingoAzul.png',
  ubicacion: 'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UbicacionBlanco.png',
  reloj:     'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/RelojBlanco.png',
  phone:     'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PhoneBlanco.png',
};

const PRESENCIALES = [
  {
    id: 'licencia',
    titulo: 'Licencia de Conducir (Clase B)',
    desc: 'Obtén o renueva tu licencia de conducir municipal.',
    img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800&auto=format&fit=crop',
    ruta: '/tramites-presenciales/licencia-b/info',
  },
  {
    id: 'cedula',
    titulo: 'Renovación Cédula de Identidad',
    desc: 'Renueva tu cédula de identidad chilena en el Registro Civil.',
    img: 'https://www.lacuarta.com/resizer/v2/J7QQH5D6QNHUTHFA5HGW2WX3WQ.jpg?auth=10261d997362bb511d3f8867b5ab480466913b5571e66c034f0a7354ce3ece03&focal=602%2C402&width=800&height=533&quality=70',
    ruta: null,
  },
  {
    id: 'suf',
    titulo: 'Subsidio Familiar (SUF)',
    desc: 'Solicita o renueva el subsidio familiar en la municipalidad.',
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop',
    ruta: null,
  },
  {
    id: 'rsh',
    titulo: 'Registro Social de Hogares',
    desc: 'Actualiza o inscribe tu ficha en el Registro Social de Hogares.',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop',
    ruta: null,
  },
];

export default function TramitesPresenciales() {
  const history = useHistory();

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

  const handleCardClick = (ruta: string | null) => {
    if (ruta) history.push(ruta);
  };

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': '#f4f6fa' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          .tp-root * { box-sizing: border-box; }
          .tp-root h1, .tp-root h2, .tp-root p { margin: 0; padding: 0; }

          .tp-root {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            display: flex; flex-direction: column;
            font-family: 'Inter', sans-serif;
            background: #f4f6fa;
            overflow-y: auto; overflow-x: hidden;
          }

          /* HEADER */
          .tp-header {
            flex-shrink: 0; position: relative; min-height: 180px;
            background-image: url('${ASSETS.fondo}');
            background-size: cover; background-position: center;
            display: flex; align-items: flex-end;
          }
          .tp-header::after {
            content: ''; position: absolute; inset: 0;
            background: rgba(0,10,40,0.52);
          }
          .tp-header-inner {
            position: relative; z-index: 2; width: 100%;
            display: flex; align-items: flex-end;
            justify-content: space-between;
            padding: 20px 32px 24px; flex-wrap: wrap; gap: 16px;
          }
          .tp-header-left { display: flex; align-items: flex-end; gap: 20px; }
          .tp-header-logo { width: 90px; filter: brightness(0) invert(1); display: block; }
          .tp-header-texts h1 {
            font-size: 0.9rem; font-weight: 400;
            color: rgba(255,255,255,0.80); margin-bottom: 2px;
            font-family: 'Inter', sans-serif;
          }
          .tp-header-texts h2 {
            font-size: 1.8rem; font-weight: 800; color: #fff;
            line-height: 1.1; font-family: 'Inter', sans-serif;
          }
          .btn-volver {
            --background: #003060; --background-hover: #00428a; --color: #fff;
            --border-radius: 10px; --padding-start: 20px; --padding-end: 20px;
            --padding-top: 10px; --padding-bottom: 10px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.9rem; font-weight: 700;
            margin: 0; position: relative; z-index: 2;
          }

          /* CONTENIDO */
          .tp-main-wrap {
            flex: 1; display: flex; justify-content: center;
            padding: 32px 24px 28px;
          }
          .tp-main { max-width: 1100px; width: 100%; }

          /* Card */
          .tp-card {
            --background: #fff;
            border-radius: 16px !important;
            box-shadow: 0 2px 14px rgba(0,0,0,0.07) !important;
            margin: 0 !important;
            cursor: pointer;
            transition: transform 0.18s, box-shadow 0.18s;
            overflow: hidden;
            height: 100%;
          }
          .tp-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.13) !important;
          }
          .tp-card-img {
            width: 100%; aspect-ratio: 16/9;
            object-fit: cover; display: block;
          }
          .tp-card-content {
            --padding-start: 0; --padding-end: 0;
            --padding-top: 0; --padding-bottom: 0;
            padding: 16px 18px 18px !important;
            display: flex; flex-direction: column; gap: 4px;
          }
          .tp-card-titulo {
            font-size: 0.95rem; font-weight: 700; color: #003060;
            margin: 0; font-family: 'Inter', sans-serif;
          }
          .tp-card-desc {
            font-size: 0.78rem; color: #6b7280; font-weight: 400;
            margin: 0; font-family: 'Inter', sans-serif; line-height: 1.4;
          }
          .tp-card-cta {
            margin-top: 10px;
            font-size: 0.78rem; font-weight: 600; color: #1a73c8;
            font-family: 'Inter', sans-serif;
            display: flex; align-items: center; gap: 4px;
          }

          /* Col con padding para simular gap */
          .tp-col {
            padding: 10px !important;
          }

          /* FOOTER */
          .tp-footer {
            flex-shrink: 0; background: #003060;
            padding: 28px 36px 20px;
            display: flex; justify-content: space-between;
            align-items: flex-start; flex-wrap: wrap; gap: 20px;
          }
          .tp-footer-block { display: flex; flex-direction: column; gap: 4px; font-family: 'Inter', sans-serif; }
          .tp-footer-block strong { color: #fff; font-size: 1rem; font-weight: 700; }
          .tp-footer-block span   { color: rgba(255,255,255,0.75); font-size: 0.88rem; font-weight: 300; }
          .tp-footer-icon-row     { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
          .tp-footer-icon-row img { width: 22px; height: 22px; }
          .tp-footer-divider      { width: 1px; background: rgba(255,255,255,0.20); align-self: stretch; }
          .tp-footer-copy {
            flex-shrink: 0; text-align: center;
            color: rgba(255,255,255,0.35); font-size: 0.75rem; font-weight: 300;
            padding: 12px 0 10px; background: #003060; font-family: 'Inter', sans-serif;
          }

          /* Móvil */
          @media (max-width: 600px) {
            .tp-header-inner { padding: 14px 16px 18px; flex-direction: column; align-items: flex-start; }
            .tp-header-logo  { width: 70px; }
            .tp-header-texts h2 { font-size: 1.3rem; }
            .tp-header-left  { gap: 10px; align-items: flex-start; }
            .tp-main-wrap    { padding: 18px 14px 20px; }
            .tp-col          { padding: 6px !important; }
            .tp-footer       { flex-direction: column; padding: 20px 16px 16px; gap: 16px; }
            .tp-footer-divider { display: none; }
          }
        `}</style>

        <div className="tp-root">

          {/* HEADER */}
          <div className="tp-header">
            <div className="tp-header-inner">
              <div className="tp-header-left">
                <img className="tp-header-logo" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />
                <div className="tp-header-texts">
                  <h1>Bienvenido/a a la plataforma de</h1>
                  <h2>Agendamiento Presencial</h2>
                </div>
              </div>
              <IonButton className="btn-volver" onClick={() => history.push('/tramites-user')}>
                ← Volver
              </IonButton>
            </div>
          </div>

          {/* CONTENIDO */}
          <div className="tp-main-wrap">
            <div className="tp-main">
              <IonGrid style={{ padding: 0 }}>
                <IonRow>
                  {PRESENCIALES.map((item) => {

                    const CardInner = (
                      <IonCard
                        className="tp-card"
                        onClick={() => handleCardClick(item.ruta)}
                      >
                        <img
                          className="tp-card-img"
                          src={item.img}
                          alt={item.titulo}
                        />
                        <IonCardContent className="tp-card-content">
                          <p className="tp-card-titulo">{item.titulo}</p>
                          <p className="tp-card-desc">{item.desc}</p>
                          <span className="tp-card-cta">▶ Agendar hora</span>
                        </IonCardContent>
                      </IonCard>
                    );

                    return (
                      <IonCol key={item.id} size="12" sizeMd="6" className="tp-col">
                        {item.ruta
                          ? CardInner
                          : <ConstructionAlert>{CardInner}</ConstructionAlert>
                        }
                      </IonCol>
                    );
                  })}
                </IonRow>
              </IonGrid>
            </div>
          </div>

          {/* FOOTER */}
          <div className="tp-footer">
            <div className="tp-footer-block">
              <div className="tp-footer-icon-row">
                <img src={ASSETS.ubicacion} alt="" /><strong>Dirección</strong>
              </div>
              <span>Avenida Santa Teresa N°1.</span>
              <span>Santo Domingo, Chile</span>
            </div>
            <div className="tp-footer-divider" />
            <div className="tp-footer-block">
              <div className="tp-footer-icon-row">
                <img src={ASSETS.phone} alt="" /><strong>Emergencias 24 horas:</strong>
              </div>
              <span>+563 2238 1603 • +563 5220 4200</span>
              <span>Seguridad: 1458 • contacto@santodomingo.cl</span>
            </div>
            <div className="tp-footer-divider" />
            <div className="tp-footer-block">
              <div className="tp-footer-icon-row">
                <img src={ASSETS.reloj} alt="" /><strong>Horario</strong>
              </div>
              <span>Lunes a Viernes: 08:45am a 14:00 pm</span>
              <span>Sábado: 09:30am a 13:30pm</span>
            </div>
          </div>
          <div className="tp-footer-copy">
            ©2026 Municipalidad de Santo Domingo &nbsp;•&nbsp; Política de Privacidad
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
}
