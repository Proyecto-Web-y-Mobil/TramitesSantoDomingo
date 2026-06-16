import React, { useState } from 'react';
import {
  IonPage, IonContent, IonButton, IonIcon, IonItem, IonLabel,
  IonSelect, IonSelectOption, IonDatetime, useIonToast, IonSpinner,
  IonGrid, IonRow, IonCol
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { calendarOutline, checkmarkCircleOutline } from 'ionicons/icons';

const ASSETS = {
  fondo:     'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/FondoSantoDomigno.png',
  logo:      'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/LogoSantoDomingoAzul.png',
  ubicacion: 'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UbicacionBlanco.png',
  reloj:     'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/RelojBlanco.png',
  phone:     'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PhoneBlanco.png',
};

export default function LicenciaInscripcion() {
  const history = useHistory();
  const [presentToast] = useIonToast();

  const [cargando, setCargando] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('');
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>('');

  const fechaMinima = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const confirmarReserva = async () => {
    if (!fechaSeleccionada || !horaSeleccionada) {
      presentToast({ message: 'Debe seleccionar una fecha y un horario.', duration: 3000, color: 'warning' });
      return;
    }
    setCargando(true);
    try {
      const sessionData = localStorage.getItem('user_session');
      const userObj = sessionData ? JSON.parse(sessionData) : null;
      const usuario = Array.isArray(userObj) ? userObj[0] : userObj;
      if (!usuario) throw new Error('Debe iniciar sesión para agendar una hora.');

      const payload = {
        usuario_id: usuario.id,
        fecha_cita: fechaSeleccionada.split('T')[0],
        hora_cita: horaSeleccionada
      };

      const response = await fetch('https://tramitessantodomingo-production-5cb4.up.railway.app/api/agendamientos/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.ok) {
        presentToast({ message: '¡Hora reservada con éxito! Revise su correo.', duration: 4000, color: 'success' });
        history.push('/tramites-presenciales');
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      presentToast({ message: error.message || 'Error al conectar con el servidor', duration: 4000, color: 'danger' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': '#f4f6fa' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          .la-root * { box-sizing: border-box; }
          .la-root h1, .la-root h2, .la-root h3, .la-root p { margin: 0; padding: 0; }

          .la-root {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            display: flex; flex-direction: column;
            font-family: 'Inter', sans-serif;
            background: #f4f6fa;
            overflow-y: auto; overflow-x: hidden;
          }

          /* ── HEADER ── */
          .la-header {
            flex-shrink: 0; position: relative; min-height: 180px;
            background-image: url('${ASSETS.fondo}');
            background-size: cover; background-position: center;
            display: flex; align-items: flex-end;
          }
          .la-header::after {
            content: ''; position: absolute; inset: 0;
            background: rgba(0,10,40,0.52);
          }
          .la-header-inner {
            position: relative; z-index: 2; width: 100%;
            display: flex; align-items: flex-end;
            justify-content: space-between;
            padding: 20px 32px 24px; flex-wrap: wrap; gap: 16px;
          }
          .la-header-left { display: flex; align-items: flex-end; gap: 20px; }
          .la-header-logo { width: 90px; filter: brightness(0) invert(1); display: block; }
          .la-header-texts h1 {
            font-size: 0.9rem; font-weight: 400;
            color: rgba(255,255,255,0.80); margin-bottom: 2px;
            font-family: 'Inter', sans-serif;
          }
          .la-header-texts h2 {
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
          .la-main-wrap {
            flex: 1; display: flex; justify-content: center;
            padding: 32px 24px 28px;
          }
          .la-main { max-width: 820px; width: 100%; display: flex; flex-direction: column; gap: 20px; }

          /* ── Card principal ── */
          .la-card {
            background: #fff; border-radius: 16px; overflow: hidden;
            box-shadow: 0 2px 14px rgba(0,0,0,0.07);
          }
          .la-card-header {
            background: #003060;
            padding: 24px 28px;
            display: flex; align-items: center; gap: 14px;
          }
          .la-card-header-icon {
            width: 44px; height: 44px; border-radius: 12px;
            background: rgba(255,255,255,0.15);
            border: 1px solid rgba(255,255,255,0.25);
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
          }
          .la-card-header-icon ion-icon { font-size: 1.5rem; color: #fff; }
          .la-card-header-title {
            font-size: 1.4rem; font-weight: 800; color: #fff;
            margin: 0 0 3px; font-family: 'Inter', sans-serif;
          }
          .la-card-header-sub {
            font-size: 0.88rem; font-weight: 300;
            color: rgba(255,255,255,0.80); margin: 0;
            font-family: 'Inter', sans-serif;
          }
          .la-card-body { padding: 28px; }

          .la-description {
            font-size: 0.95rem; font-weight: 400; color: #555;
            line-height: 1.6; margin: 0 0 24px; font-family: 'Inter', sans-serif;
          }

          /* ── Sección label ── */
          .la-section-label {
            font-size: 0.8rem; font-weight: 700; color: #003060;
            text-transform: uppercase; letter-spacing: 0.6px;
            margin: 0 0 10px; font-family: 'Inter', sans-serif;
          }

          /* ── Fecha item ── */
          .la-date-item {
            --background: #f8fafc;
            --border-color: #e2e8f0;
            --border-radius: 12px;
            --border-width: 1.5px;
            --border-style: solid;
            --padding-start: 16px;
            --inner-padding-end: 16px;
            --highlight-color-focused: #003060;
            border-radius: 12px;
            margin-bottom: 20px;
            font-family: 'Inter', sans-serif;
          }

          .la-date-item ion-datetime {
            --background: transparent;
            padding: 8px 0;
          }

          /* ── Hora item ── */
          .la-hora-item {
            --background: #f8fafc;
            --border-color: #e2e8f0;
            --border-radius: 12px;
            --border-width: 1.5px;
            --border-style: solid;
            --padding-start: 16px;
            --inner-padding-end: 16px;
            --highlight-color-focused: #003060;
            border-radius: 12px;
            margin-bottom: 28px;
            font-family: 'Inter', sans-serif;
          }

          .la-item-label {
            font-size: 0.82rem; font-weight: 600; color: #003060;
            font-family: 'Inter', sans-serif;
          }

          /* ── Botón confirmar ── */
          .btn-confirmar {
            --background: #003060; --background-hover: #00428a;
            --background-activated: #00224a; --border-radius: 12px;
            --padding-top: 16px; --padding-bottom: 16px;
            font-family: 'Inter', sans-serif; font-size: 1rem;
            font-weight: 700; letter-spacing: 0.3px; text-transform: none;
            width: 100%;
          }

          /* ── FOOTER ── */
          .la-footer {
            flex-shrink: 0; background: #003060;
            padding: 28px 36px 20px;
            display: flex; justify-content: space-between;
            align-items: flex-start; flex-wrap: wrap; gap: 20px;
          }
          .la-footer-block { display: flex; flex-direction: column; gap: 4px; font-family: 'Inter', sans-serif; }
          .la-footer-block strong { color: #fff; font-size: 1rem; font-weight: 700; }
          .la-footer-block span   { color: rgba(255,255,255,0.75); font-size: 0.88rem; font-weight: 300; }
          .la-footer-icon-row     { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
          .la-footer-icon-row img { width: 22px; height: 22px; }
          .la-footer-divider      { width: 1px; background: rgba(255,255,255,0.20); align-self: stretch; }
          .la-footer-copy {
            flex-shrink: 0; text-align: center;
            color: rgba(255,255,255,0.35); font-size: 0.75rem; font-weight: 300;
            padding: 12px 0 10px; background: #003060; font-family: 'Inter', sans-serif;
          }

          /* ── Responsive ── */
          @media (max-width: 600px) {
            .la-header-inner    { padding: 14px 16px 18px; flex-direction: column; align-items: flex-start; }
            .la-header-logo     { width: 70px; }
            .la-header-texts h2 { font-size: 1.3rem; }
            .la-header-left     { gap: 10px; align-items: flex-start; }
            .la-main-wrap       { padding: 18px 14px 20px; }
            .la-card-body       { padding: 20px 18px; }
            .la-card-header     { padding: 20px 18px; }
            .la-footer          { flex-direction: column; padding: 20px 16px 16px; gap: 16px; }
            .la-footer-divider  { display: none; }
          }
        `}</style>

        <div className="la-root">

          {/* HEADER */}
          <div className="la-header">
            <div className="la-header-inner">
              <div className="la-header-left">
                <img className="la-header-logo" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />
                <div className="la-header-texts">
                  <h1>Dirección de Tránsito</h1>
                  <h2>Agendar Hora</h2>
                </div>
              </div>
              <IonButton className="btn-volver" onClick={() => history.goBack()}>
                ← Volver
              </IonButton>
            </div>
          </div>

          {/* MAIN */}
          <div className="la-main-wrap">
            <div className="la-main">
              <IonGrid style={{ padding: 0 }}>
                <IonRow>
                  <IonCol size="12">

                    {/* Card agendamiento */}
                    <div className="la-card">
                      <div className="la-card-header">
                        <div className="la-card-header-icon">
                          <IonIcon icon={calendarOutline} />
                        </div>
                        <div>
                          <h2 className="la-card-header-title">Selección de Fecha y Hora</h2>
                          <p className="la-card-header-sub">Licencia de Conducir Clase B</p>
                        </div>
                      </div>

                      <div className="la-card-body">
                        <p className="la-description">
                          Seleccione el día y el bloque horario en el que desea presentarse a rendir sus exámenes.
                        </p>

                        <p className="la-section-label">Fecha de la cita *</p>
                        <IonItem className="la-date-item" lines="none">
                          <IonDatetime
                            presentation="date"
                            min={fechaMinima}
                            value={fechaSeleccionada}
                            onIonChange={e => setFechaSeleccionada(e.detail.value as string)}
                          />
                        </IonItem>

                        <p className="la-section-label">Bloque Horario *</p>
                        <IonItem className="la-hora-item" lines="none">
                          <IonLabel className="la-item-label" position="stacked">Seleccione un horario</IonLabel>
                          <IonSelect
                            placeholder="Seleccione un horario"
                            value={horaSeleccionada}
                            onIonChange={e => setHoraSeleccionada(e.detail.value)}
                          >
                            <IonSelectOption value="09:00">09:00 - 10:00 hrs</IonSelectOption>
                            <IonSelectOption value="10:00">10:00 - 11:00 hrs</IonSelectOption>
                            <IonSelectOption value="11:30">11:30 - 12:30 hrs</IonSelectOption>
                            <IonSelectOption value="14:00">14:00 - 15:00 hrs</IonSelectOption>
                            <IonSelectOption value="15:30">15:30 - 16:30 hrs</IonSelectOption>
                          </IonSelect>
                        </IonItem>

                        <IonButton
                          className="btn-confirmar"
                          onClick={confirmarReserva}
                          disabled={cargando}
                        >
                          {cargando
                            ? <IonSpinner name="crescent" />
                            : <><IonIcon slot="start" icon={checkmarkCircleOutline} /> Confirmar Reserva</>
                          }
                        </IonButton>

                      </div>
                    </div>

                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>
          </div>

          {/* FOOTER */}
          <div className="la-footer">
            <div className="la-footer-block">
              <div className="la-footer-icon-row">
                <img src={ASSETS.ubicacion} alt="" /><strong>Dirección</strong>
              </div>
              <span>Avenida Santa Teresa N°1.</span>
              <span>Santo Domingo, Chile</span>
            </div>
            <div className="la-footer-divider" />
            <div className="la-footer-block">
              <div className="la-footer-icon-row">
                <img src={ASSETS.phone} alt="" /><strong>Emergencias 24 horas:</strong>
              </div>
              <span>+563 2238 1603 • +563 5220 4200</span>
              <span>Seguridad: 1458 • contacto@santodomingo.cl</span>
            </div>
            <div className="la-footer-divider" />
            <div className="la-footer-block">
              <div className="la-footer-icon-row">
                <img src={ASSETS.reloj} alt="" /><strong>Horario</strong>
              </div>
              <span>Lunes a Viernes: 08:45am a 14:00 pm</span>
              <span>Sábado: 09:30am a 13:30pm</span>
            </div>
          </div>
          <div className="la-footer-copy">
            ©2026 Municipalidad de Santo Domingo &nbsp;•&nbsp; Política de Privacidad
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
}
