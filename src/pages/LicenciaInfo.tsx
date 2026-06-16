import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonButton, IonIcon,
  IonGrid, IonRow, IonCol, IonItem, IonLabel
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  arrowForwardOutline,
  documentTextOutline,
  medicalOutline,
  carOutline,
  alertCircleOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';

const ASSETS = {
  fondo:     'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/FondoSantoDomigno.png',
  logo:      'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/LogoSantoDomingoAzul.png',
  ubicacion: 'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UbicacionBlanco.png',
  reloj:     'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/RelojBlanco.png',
  phone:     'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PhoneBlanco.png',
};

const requisitos = [
  { icon: documentTextOutline, texto: 'Cédula de Identidad vigente y certificado de residencia en la comuna.' },
  { icon: documentTextOutline, texto: 'Certificado de estudios (Mínimo 8º básico rendido).' },
  { icon: medicalOutline,      texto: 'Aprobar examen médico (Psicométrico y sensométrico) en el municipio.' },
  { icon: carOutline,          texto: 'Aprobar examen teórico y práctico (debe traer vehículo con documentación al día).' },
];

export default function LicenciaInfo() {
  const history = useHistory();
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const sessionData = localStorage.getItem('user_session');
    if (sessionData) {
      const userObj = JSON.parse(sessionData);
      setUsuario(Array.isArray(userObj) ? userObj[0] : userObj);
    }
  }, []);

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': '#f4f6fa' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          .li-root * { box-sizing: border-box; }
          .li-root h1, .li-root h2, .li-root h3, .li-root p { margin: 0; padding: 0; }

          .li-root {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            display: flex; flex-direction: column;
            font-family: 'Inter', sans-serif;
            background: #f4f6fa;
            overflow-y: auto; overflow-x: hidden;
          }

          /* ── HEADER ── */
          .li-header {
            flex-shrink: 0; position: relative; min-height: 180px;
            background-image: url('${ASSETS.fondo}');
            background-size: cover; background-position: center;
            display: flex; align-items: flex-end;
          }
          .li-header::after {
            content: ''; position: absolute; inset: 0;
            background: rgba(0,10,40,0.52);
          }
          .li-header-inner {
            position: relative; z-index: 2; width: 100%;
            display: flex; align-items: flex-end;
            justify-content: space-between;
            padding: 20px 32px 24px; flex-wrap: wrap; gap: 16px;
          }
          .li-header-left { display: flex; align-items: flex-end; gap: 20px; }
          .li-header-logo { width: 90px; filter: brightness(0) invert(1); display: block; }
          .li-header-texts h1 {
            font-size: 0.9rem; font-weight: 400;
            color: rgba(255,255,255,0.80); margin-bottom: 2px;
            font-family: 'Inter', sans-serif;
          }
          .li-header-texts h2 {
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

          /* ── MAIN ── */
          .li-main-wrap {
            flex: 1; display: flex; justify-content: center;
            padding: 32px 24px 28px;
          }
          .li-main { max-width: 820px; width: 100%; display: flex; flex-direction: column; gap: 20px; }

          /* ── Hero card ── */
          .li-hero-card {
            background: #fff; border-radius: 16px; overflow: hidden;
            box-shadow: 0 2px 14px rgba(0,0,0,0.07);
          }
          .li-hero-header {
            background: #003060;
            padding: 28px 28px 22px;
          }
          .li-hero-badge {
            display: inline-flex; align-items: center; gap: 6px;
            background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
            border-radius: 20px; padding: 4px 12px;
            font-size: 0.75rem; font-weight: 500;
            color: rgba(255,255,255,0.9); margin-bottom: 12px;
            font-family: 'Inter', sans-serif;
          }
          .li-hero-title {
            font-size: 1.6rem; font-weight: 800; color: #fff;
            margin: 0 0 6px; font-family: 'Inter', sans-serif; line-height: 1.2;
          }
          .li-hero-subtitle {
            font-size: 0.9rem; font-weight: 300;
            color: rgba(255,255,255,0.80); margin: 0; font-family: 'Inter', sans-serif;
          }
          .li-hero-body { padding: 24px 28px; }
          .li-description {
            font-size: 0.97rem; font-weight: 400; color: #444;
            line-height: 1.7; margin: 0 0 20px; font-family: 'Inter', sans-serif;
          }

          /* ── Alert box ── */
          .li-alert-box {
            display: flex; align-items: flex-start; gap: 12px;
            background: #eff6ff; border: 1px solid #bfdbfe;
            border-left: 4px solid #003060; border-radius: 10px; padding: 14px 16px;
          }
          .li-alert-icon { color: #003060; font-size: 1.3rem; flex-shrink: 0; margin-top: 1px; }
          .li-alert-title {
            font-size: 0.85rem; font-weight: 700; color: #003060;
            margin: 0 0 4px; font-family: 'Inter', sans-serif;
          }
          .li-alert-text {
            font-size: 0.88rem; font-weight: 400; color: #1e3a5f;
            margin: 0; line-height: 1.6; font-family: 'Inter', sans-serif;
          }

          /* ── Requisitos card ── */
          .li-req-card {
            background: #fff; border-radius: 16px; overflow: hidden;
            box-shadow: 0 2px 14px rgba(0,0,0,0.07);
          }
          .li-req-header {
            display: flex; align-items: center; gap: 10px;
            padding: 18px 24px; border-bottom: 1px solid #e8edf4;
          }
          .li-req-header-dot {
            width: 5px; height: 24px; background: #003060;
            border-radius: 4px; flex-shrink: 0;
          }
          .li-req-title {
            font-size: 1.05rem; font-weight: 700; color: #003060;
            margin: 0; font-family: 'Inter', sans-serif;
          }
          .li-req-item {
            --background: transparent; --border-color: #f0f4f8;
            --padding-start: 20px; --padding-end: 20px;
            --inner-padding-end: 0; --min-height: 60px;
            font-family: 'Inter', sans-serif;
          }
          .li-req-icon-wrap {
            width: 36px; height: 36px; border-radius: 10px; background: #eff6ff;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0; margin-right: 14px;
          }
          .li-req-icon { color: #003060; font-size: 1.1rem; }
          .li-req-label {
            font-size: 0.92rem; font-weight: 400; color: #333;
            line-height: 1.55; font-family: 'Inter', sans-serif;
          }

          /* ── CTA card ── */
          .li-cta-card {
            background: #fff; border-radius: 16px;
            box-shadow: 0 2px 14px rgba(0,0,0,0.07);
            padding: 24px 28px; text-align: center;
          }
          .li-cta-hint {
            font-size: 0.85rem; font-weight: 300; color: #757575;
            margin: 0 0 16px; font-family: 'Inter', sans-serif;
          }
          .btn-agendar {
            --background: #003060; --background-hover: #00428a;
            --background-activated: #00224a; --border-radius: 12px;
            --padding-top: 16px; --padding-bottom: 16px;
            font-family: 'Inter', sans-serif; font-size: 0.97rem;
            font-weight: 700; letter-spacing: 0.3px; text-transform: none;
            width: 100%; max-width: 440px;
          }
          .btn-bloqueado {
            --background: #e2e8f0; --color: #757575;
            --border-radius: 12px; --padding-top: 16px; --padding-bottom: 16px;
            font-family: 'Inter', sans-serif; font-size: 0.92rem;
            font-weight: 600; text-transform: none; width: 100%; max-width: 440px;
          }
          .li-warning-text {
            font-size: 0.82rem; font-weight: 400; color: #e67e22;
            margin: 10px 0 0; font-family: 'Inter', sans-serif;
          }

          /* ── FOOTER ── */
          .li-footer {
            flex-shrink: 0; background: #003060;
            padding: 28px 36px 20px;
            display: flex; justify-content: space-between;
            align-items: flex-start; flex-wrap: wrap; gap: 20px;
          }
          .li-footer-block { display: flex; flex-direction: column; gap: 4px; font-family: 'Inter', sans-serif; }
          .li-footer-block strong { color: #fff; font-size: 1rem; font-weight: 700; }
          .li-footer-block span   { color: rgba(255,255,255,0.75); font-size: 0.88rem; font-weight: 300; }
          .li-footer-icon-row     { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
          .li-footer-icon-row img { width: 22px; height: 22px; }
          .li-footer-divider      { width: 1px; background: rgba(255,255,255,0.20); align-self: stretch; }
          .li-footer-copy {
            flex-shrink: 0; text-align: center;
            color: rgba(255,255,255,0.35); font-size: 0.75rem; font-weight: 300;
            padding: 12px 0 10px; background: #003060; font-family: 'Inter', sans-serif;
          }

          /* ── Responsive ── */
          @media (max-width: 600px) {
            .li-header-inner    { padding: 14px 16px 18px; flex-direction: column; align-items: flex-start; }
            .li-header-logo     { width: 70px; }
            .li-header-texts h2 { font-size: 1.3rem; }
            .li-header-left     { gap: 10px; align-items: flex-start; }
            .li-main-wrap       { padding: 18px 14px 20px; }
            .li-hero-header     { padding: 22px 20px 18px; }
            .li-hero-title      { font-size: 1.3rem; }
            .li-hero-body       { padding: 18px 20px; }
            .li-req-header      { padding: 16px 18px; }
            .li-req-item        { --padding-start: 16px; --padding-end: 16px; }
            .li-cta-card        { padding: 20px 18px; }
            .li-footer          { flex-direction: column; padding: 20px 16px 16px; gap: 16px; }
            .li-footer-divider  { display: none; }
          }
        `}</style>

        <div className="li-root">

          {/* HEADER */}
          <div className="li-header">
            <div className="li-header-inner">
              <div className="li-header-left">
                <img className="li-header-logo" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />
                <div className="li-header-texts">
                  <h1>Dirección de Tránsito</h1>
                  <h2>Licencia de Conducir</h2>
                </div>
              </div>
              <IonButton className="btn-volver" onClick={() => history.goBack()}>
                ← Volver
              </IonButton>
            </div>
          </div>

          {/* MAIN */}
          <div className="li-main-wrap">
            <div className="li-main">

              <IonGrid style={{ padding: 0 }}>
                <IonRow>
                  <IonCol size="12">

                    {/* Hero card */}
                    <div className="li-hero-card">
                      <div className="li-hero-header">
                        <div className="li-hero-badge">
                          <IonIcon icon={carOutline} /> Trámite Presencial
                        </div>
                        <h2 className="li-hero-title">Primera Obtención — Licencia Clase B</h2>
                        <p className="li-hero-subtitle">Agendamiento para examen presencial en el municipio</p>
                      </div>
                      <div className="li-hero-body">
                        <p className="li-description">
                          Este agendamiento es exclusivo para rendir los exámenes correspondientes a la obtención
                          de su primera licencia de conducir Clase B — vehículos motorizados de tres o cuatro
                          ruedas para transporte particular.
                        </p>
                        <div className="li-alert-box">
                          <IonIcon icon={alertCircleOutline} className="li-alert-icon" />
                          <div>
                            <p className="li-alert-title">Importante</p>
                            <p className="li-alert-text">
                              Preséntese con <strong>15 minutos de anticipación</strong> el día de su cita.
                              El incumplimiento de los requisitos documentales implicará la cancelación automática de la hora.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Requisitos card */}
                    <div className="li-req-card" style={{ marginTop: '20px' }}>
                      <div className="li-req-header">
                        <div className="li-req-header-dot" />
                        <h3 className="li-req-title">Requisitos a presentar el día de la cita</h3>
                      </div>
                      {requisitos.map((req, idx) => (
                        <IonItem
                          key={idx}
                          className="li-req-item"
                          lines={idx < requisitos.length - 1 ? 'inset' : 'none'}
                        >
                          <div className="li-req-icon-wrap" slot="start">
                            <IonIcon icon={req.icon} className="li-req-icon" />
                          </div>
                          <IonLabel className="li-req-label ion-text-wrap">{req.texto}</IonLabel>
                          <IonIcon icon={checkmarkCircleOutline} slot="end"
                            style={{ color: '#003060', opacity: 0.25, fontSize: '1.1rem' }} />
                        </IonItem>
                      ))}
                    </div>

                    {/* CTA card */}
                    <div className="li-cta-card" style={{ marginTop: '20px' }}>
                      {usuario && usuario.id_rol === 1 ? (
                        <>
                          <IonButton className="btn-bloqueado" disabled>
                            Debes validar tu residencia para agendar
                          </IonButton>
                          <p className="li-warning-text">
                            ⚠ Valida tu residencia en tu perfil para habilitar el agendamiento.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="li-cta-hint">
                            Una vez revisados los requisitos, puede continuar con el proceso de agendamiento.
                          </p>
                          <IonButton
                            className="btn-agendar"
                            onClick={() => history.push('/tramites-presenciales/licencia-b/agendar')}
                          >
                            Continuar al Agendamiento
                            <IonIcon slot="end" icon={arrowForwardOutline} />
                          </IonButton>
                        </>
                      )}
                    </div>

                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>
          </div>

          {/* FOOTER */}
          <div className="li-footer">
            <div className="li-footer-block">
              <div className="li-footer-icon-row">
                <img src={ASSETS.ubicacion} alt="" /><strong>Dirección</strong>
              </div>
              <span>Avenida Santa Teresa N°1.</span>
              <span>Santo Domingo, Chile</span>
            </div>
            <div className="li-footer-divider" />
            <div className="li-footer-block">
              <div className="li-footer-icon-row">
                <img src={ASSETS.phone} alt="" /><strong>Emergencias 24 horas:</strong>
              </div>
              <span>+563 2238 1603 • +563 5220 4200</span>
              <span>Seguridad: 1458 • contacto@santodomingo.cl</span>
            </div>
            <div className="li-footer-divider" />
            <div className="li-footer-block">
              <div className="li-footer-icon-row">
                <img src={ASSETS.reloj} alt="" /><strong>Horario</strong>
              </div>
              <span>Lunes a Viernes: 08:45am a 14:00 pm</span>
              <span>Sábado: 09:30am a 13:30pm</span>
            </div>
          </div>
          <div className="li-footer-copy">
            ©2026 Municipalidad de Santo Domingo &nbsp;•&nbsp; Política de Privacidad
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
}
