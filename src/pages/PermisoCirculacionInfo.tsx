import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonButton, IonIcon, useIonAlert
} from "@ionic/react";
import { useHistory } from 'react-router-dom';
import {
  documentTextOutline, timeOutline, cashOutline, alertCircleOutline
} from 'ionicons/icons';

const ASSETS = {
  fondo:     'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/FondoSantoDomigno.png',
  logo:      'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/LogoSantoDomingoAzul.png',
  ubicacion: 'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UbicacionBlanco.png',
  reloj:     'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/RelojBlanco.png',
  phone:     'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PhoneBlanco.png',
};

export default function PermisoCirculacionInfo() {
  const history = useHistory();
  const [usuario, setUsuario] = useState<any>(null);
  const [presentAlert] = useIonAlert();

  useEffect(() => {
    const sessionData = localStorage.getItem('user_session');
    if (sessionData) {
      const userObj = JSON.parse(sessionData);
      setUsuario(Array.isArray(userObj) ? userObj[0] : userObj);
    }
  }, []);

  const handleComenzarTramite = () => {
    if (!usuario) {
      presentAlert({
        header: 'Sesión Requerida',
        message: 'Debes iniciar sesión en la plataforma para poder realizar este trámite.',
        buttons: ['Entendido']
      });
      return;
    }

    if (usuario.rol?.toLowerCase() !== 'residente') {
      presentAlert({
        header: 'Acceso Restringido',
        message: 'Debes tener tu residencia validada (perfil Residente) para solicitar el Permiso de Circulación.',
        buttons: ['Entendido']
      });
      return;
    }

    history.push('/tramite/permiso-circulacion/formulario');
  };

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': '#f4f6fa' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          .pi-root * { box-sizing: border-box; }
          .pi-root h1, .pi-root h2, .pi-root h3,
          .pi-root h4, .pi-root p { margin: 0; padding: 0; }

          .pi-root {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            display: flex; flex-direction: column;
            font-family: 'Inter', sans-serif;
            background: #f4f6fa;
            overflow-y: auto; overflow-x: hidden;
          }

          /* HEADER */
          .pi-header {
            flex-shrink: 0; position: relative; min-height: 180px;
            background-image: url('${ASSETS.fondo}');
            background-size: cover; background-position: center;
            display: flex; align-items: flex-end;
          }
          .pi-header::after {
            content: ''; position: absolute; inset: 0;
            background: rgba(0,10,40,0.52);
          }
          .pi-header-inner {
            position: relative; z-index: 2; width: 100%;
            display: flex; align-items: flex-end;
            justify-content: space-between;
            padding: 20px 32px 24px; flex-wrap: wrap; gap: 16px;
          }
          .pi-header-left { display: flex; align-items: flex-end; gap: 20px; }
          .pi-header-logo { width: 90px; filter: brightness(0) invert(1); display: block; }
          .pi-header-texts h1 {
            font-size: 0.9rem; font-weight: 400;
            color: rgba(255,255,255,0.80); margin-bottom: 2px;
            font-family: 'Inter', sans-serif;
          }
          .pi-header-texts h2 {
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
          .pi-main-wrap {
            flex: 1; display: flex; justify-content: center;
            padding: 32px 24px 28px;
          }
          .pi-main { max-width: 860px; width: 100%; }

          /* Card */
          .pi-card {
            background: #fff; border: 1px solid #e0e7ef;
            border-radius: 16px; overflow: hidden;
            box-shadow: 0 2px 14px rgba(0,0,0,0.06);
          }
          .pi-card-header {
            background: #003060; padding: 20px 24px;
            border-bottom: 1px solid rgba(255,255,255,0.10);
          }
          .pi-card-header h3 {
            font-size: 1.25rem; font-weight: 700; color: #fff;
            font-family: 'Inter', sans-serif;
          }
          .pi-card-header p {
            font-size: 0.82rem; color: rgba(255,255,255,0.70);
            margin-top: 4px; font-family: 'Inter', sans-serif; font-weight: 300;
          }
          .pi-card-body { padding: 24px; }

          /* Descripción */
          .pi-descripcion {
            font-size: 0.90rem; color: #4b5563; line-height: 1.7;
            font-family: 'Inter', sans-serif; margin-bottom: 24px;
          }

          /* Sección título */
          .pi-seccion-titulo {
            display: flex; align-items: center; gap: 8px;
            font-size: 0.78rem; font-weight: 700; color: rgba(0,48,96,0.50);
            text-transform: uppercase; letter-spacing: 1px;
            margin-bottom: 12px; font-family: 'Inter', sans-serif;
            padding-bottom: 8px; border-bottom: 1px solid #e8edf5;
          }
          .pi-seccion-titulo ion-icon { font-size: 1rem; color: #003060; }

          /* Requisitos */
          .pi-requisitos { list-style: none; padding: 0; margin: 0 0 24px; }
          .pi-requisitos li {
            display: flex; align-items: flex-start; gap: 10px;
            padding: 10px 0; border-bottom: 1px solid #f0f2f5;
            font-size: 0.87rem; color: #374151;
            font-family: 'Inter', sans-serif; line-height: 1.5;
          }
          .pi-requisitos li:last-child { border-bottom: none; }
          .pi-req-dot {
            width: 7px; height: 7px; border-radius: 50%;
            background: #003060; flex-shrink: 0; margin-top: 6px;
          }

          /* Info boxes */
          .pi-info-grid {
            display: grid; grid-template-columns: 1fr 1fr;
            gap: 14px; margin-bottom: 20px;
          }
          .pi-info-box {
            background: #f7f9fc; border: 1px solid #e0e7ef;
            border-radius: 12px; padding: 16px 18px;
          }
          .pi-info-box h4 {
            display: flex; align-items: center; gap: 7px;
            font-size: 0.80rem; font-weight: 700; color: #003060;
            font-family: 'Inter', sans-serif; margin-bottom: 6px;
          }
          .pi-info-box h4 ion-icon { font-size: 1rem; }
          .pi-info-box p {
            font-size: 0.82rem; color: #6b7280;
            font-family: 'Inter', sans-serif; line-height: 1.5;
          }

          /* Aviso */
          .pi-aviso {
            display: flex; align-items: flex-start; gap: 10px;
            background: #fffbeb; border: 1.5px solid #fde68a;
            border-left: 4px solid #f59e0b;
            border-radius: 10px; padding: 14px 16px; margin-bottom: 24px;
          }
          .pi-aviso ion-icon { color: #d97706; font-size: 1.1rem; flex-shrink: 0; margin-top: 1px; }
          .pi-aviso p {
            font-size: 0.83rem; color: #92400e;
            font-family: 'Inter', sans-serif; line-height: 1.5;
          }
          .pi-aviso p strong { color: #78350f; }

          /* Botón comenzar */
          .btn-comenzar {
            --background: #1a7a3e; --background-hover: #156332; --color: #fff;
            --border-radius: 12px; --padding-top: 16px; --padding-bottom: 16px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 1rem; font-weight: 700; width: 100%; margin: 0;
          }

          /* FOOTER */
          .pi-footer {
            flex-shrink: 0; background: #003060;
            padding: 28px 36px 20px;
            display: flex; justify-content: space-between;
            align-items: flex-start; flex-wrap: wrap; gap: 20px;
          }
          .pi-footer-block { display: flex; flex-direction: column; gap: 4px; font-family: 'Inter', sans-serif; }
          .pi-footer-block strong { color: #fff; font-size: 1rem; font-weight: 700; }
          .pi-footer-block span   { color: rgba(255,255,255,0.75); font-size: 0.88rem; font-weight: 300; }
          .pi-footer-icon-row     { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
          .pi-footer-icon-row img { width: 22px; height: 22px; }
          .pi-footer-divider      { width: 1px; background: rgba(255,255,255,0.20); align-self: stretch; }
          .pi-footer-copy {
            flex-shrink: 0; text-align: center;
            color: rgba(255,255,255,0.35); font-size: 0.75rem; font-weight: 300;
            padding: 12px 0 10px; background: #003060; font-family: 'Inter', sans-serif;
          }

          /* MÓVIL */
          @media (max-width: 600px) {
            .pi-header-inner { padding: 14px 16px 18px; flex-direction: column; align-items: flex-start; }
            .pi-header-logo  { width: 70px; }
            .pi-header-texts h2 { font-size: 1.3rem; }
            .pi-header-left  { gap: 10px; align-items: flex-start; }
            .pi-main-wrap    { padding: 18px 14px 20px; }
            .pi-info-grid    { grid-template-columns: 1fr; }
            .pi-card-body    { padding: 18px 16px; }
            .pi-footer       { flex-direction: column; padding: 20px 16px 16px; gap: 16px; }
            .pi-footer-divider { display: none; }
          }
        `}</style>

        <div className="pi-root">

          {/* HEADER */}
          <div className="pi-header">
            <div className="pi-header-inner">
              <div className="pi-header-left">
                <img className="pi-header-logo" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />
                <div className="pi-header-texts">
                  <h1>Información del trámite</h1>
                  <h2>Permiso de Circulación</h2>
                </div>
              </div>
              <IonButton className="btn-volver" onClick={() => history.push('/tramites-user')}>
                ← Volver
              </IonButton>
            </div>
          </div>

          {/* CONTENIDO — solo la card, sin imagen */}
          <div className="pi-main-wrap">
            <div className="pi-main">
              <div className="pi-card">

                <div className="pi-card-header">
                  <h3>Renovación Permiso de Circulación</h3>
                  <p>Trámite municipal obligatorio para vehículos motorizados</p>
                </div>

                <div className="pi-card-body">

                  <p className="pi-descripcion">
                    Este trámite permite a los propietarios de vehículos motorizados renovar su permiso de circulación anual en la Municipalidad, requisito obligatorio para transitar por las calles del país.
                  </p>

                  <p className="pi-seccion-titulo">
                    <IonIcon icon={documentTextOutline} />
                    Requisitos Obligatorios
                  </p>
                  <ul className="pi-requisitos">
                    <li>
                      <span className="pi-req-dot" />
                      Permiso de circulación anterior pagado en la municipalidad.
                    </li>
                    <li>
                      <span className="pi-req-dot" />
                      <span><strong>Certificado de revisión técnica</strong> y de gases vigente (deberá adjuntar una copia en el siguiente paso).</span>
                    </li>
                    <li>
                      <span className="pi-req-dot" />
                      Seguro Obligatorio de Accidentes Personales (SOAP) vigente.
                    </li>
                    <li>
                      <span className="pi-req-dot" />
                      No registrar multas de tránsito impagas.
                    </li>
                  </ul>

                  <div className="pi-info-grid">
                    <div className="pi-info-box">
                      <h4><IonIcon icon={timeOutline} />Duración</h4>
                      <p>Aprobación tras la validación de los documentos (aprox. 48 horas hábiles).</p>
                    </div>
                    <div className="pi-info-box">
                      <h4><IonIcon icon={cashOutline} />Valor Estimado</h4>
                      <p>Depende de la tasación oficial del vehículo según el SII para el año en curso.</p>
                    </div>
                  </div>

                  <div className="pi-aviso">
                    <IonIcon icon={alertCircleOutline} />
                    <p>
                      <strong>Importante:</strong> Tenga a mano el PDF o fotografía clara de su Revisión Técnica antes de comenzar.
                    </p>
                  </div>

                  <IonButton
                    expand="block"
                    className="btn-comenzar"
                    onClick={handleComenzarTramite}
                  >
                    Comenzar Trámite →
                  </IonButton>

                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="pi-footer">
            <div className="pi-footer-block">
              <div className="pi-footer-icon-row">
                <img src={ASSETS.ubicacion} alt="" /><strong>Dirección</strong>
              </div>
              <span>Avenida Santa Teresa N°1.</span>
              <span>Santo Domingo, Chile</span>
            </div>
            <div className="pi-footer-divider" />
            <div className="pi-footer-block">
              <div className="pi-footer-icon-row">
                <img src={ASSETS.phone} alt="" /><strong>Emergencias 24 horas:</strong>
              </div>
              <span>+563 2238 1603 • +563 5220 4200</span>
              <span>Seguridad: 1458 • contacto@santodomingo.cl</span>
            </div>
            <div className="pi-footer-divider" />
            <div className="pi-footer-block">
              <div className="pi-footer-icon-row">
                <img src={ASSETS.reloj} alt="" /><strong>Horario</strong>
              </div>
              <span>Lunes a Viernes: 08:45am a 14:00 pm</span>
              <span>Sábado: 09:30am a 13:30pm</span>
            </div>
          </div>
          <div className="pi-footer-copy">
            ©2026 Municipalidad de Santo Domingo &nbsp;•&nbsp; Política de Privacidad
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
}