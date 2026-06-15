import React, { useState } from 'react';
import {
  IonContent, IonPage, IonItem, IonInput, IonButton, IonIcon
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { authService } from '../services/authService';
import { Link } from 'react-router-dom';

const ASSETS = {
  fondo:       'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/FondoSantoDomigno.png',
  logo:        'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/LogoSantoDomingoAzul.png',
  usuarioAzul: 'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UsuarioAzul.png',
  usuarioGris: 'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UsuarioGris.png',
  candado:     'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/CandadoGris.png',
  puerta:      'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PuertaSalir.png',
  reloj:       'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/RelojBlanco.png',
  ubicacion:   'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UbicacionBlanco.png',
};

const LoginFuncionario: React.FC = () => {
  const history = useHistory();
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const emailLimpio = (data.get('email-input') as string || '').trim();
    const passLimpio  = (data.get('pass-input')  as string || '').trim();
    if (!emailLimpio || !passLimpio) {
      alert("Por favor, complete todos los campos.");
      return;
    }
    try {
      const user = await authService.login(emailLimpio, passLimpio);
      if (user && user.rol === 'funcionario') {
        setTimeout(() => { history.replace('/admin-dashboard'); }, 100);
      } else {
        alert("No tiene permisos para acceder al panel administrativo.");
      }
    } catch (error: any) {
      alert(error.message || "Credenciales de inicio de sesión incorrectas.");
    }
  };

  return (
    <IonPage>
      {/* scrollY=false — el scroll lo maneja .lf-root */}
      <IonContent scrollY={false} style={{ '--background': 'transparent' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

          /* ── Wrapper raíz — ocupa exactamente el viewport y scrollea él mismo ── */
          .lf-root {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            overflow-y: auto;
            overflow-x: hidden;
          }

          /* Fondo foto fijo */
          .lf-bg {
            position: fixed; inset: 0; z-index: 0;
            background-image: url('${ASSETS.fondo}');
            background-size: cover; background-position: center;
          }
          .lf-bg::after {
            content: ''; position: absolute; inset: 0;
            background: rgba(0,10,30,0.30);
          }

          /* ════════════════════════════
             DESKTOP
          ════════════════════════════ */

          /* Curva azul inferior */
          .lf-wave {
            position: fixed; bottom: 0; left: 0; right: 0;
            height: 220px; background: #003060;
            border-radius: 55% 55% 0 0 / 60px 60px 0 0; z-index: 1;
          }

          /* Logo esquina */
          .lf-logo-desktop {
            position: fixed; top: 20px; left: 24px;
            z-index: 10; width: 100px; display: block;
          }

          /* Título sobre el fondo */
          .lf-header-text {
            position: fixed; top: 28px; left: 50%;
            transform: translateX(-50%);
            z-index: 10; text-align: center;
            pointer-events: none; white-space: nowrap;
          }
          .lf-header-text h1 {
            font-size: 2rem; font-weight: 700; color: #fff;
            margin: 0 0 4px; font-family: 'Inter', sans-serif;
          }
          .lf-header-text p {
            font-size: 0.85rem; font-weight: 300;
            color: rgba(255,255,255,0.75); margin: 0;
            font-family: 'Inter', sans-serif;
          }

          /* Área centrada desktop */
          .lf-center {
            position: relative; z-index: 5;
            display: flex; align-items: center; justify-content: center;
            min-height: 100vh; padding: 20px 20px 240px;
          }

          /* Card */
          .lf-card {
            background: #ffffff; border-radius: 20px;
            padding: 40px 44px 36px; width: 100%; max-width: 460px;
            box-shadow: 0 24px 60px rgba(0,0,0,0.22);
            display: flex; flex-direction: column; align-items: center;
          }
          .lf-avatar { width: 72px; height: 72px; margin-bottom: 12px; }
          .lf-card h2 {
            font-size: 1.75rem; font-weight: 700; color: #003060;
            margin: 0 0 4px; letter-spacing: -0.3px; text-align: center;
            font-family: 'Inter', sans-serif;
          }
          .lf-card p.subtitle {
            font-size: 0.875rem; font-weight: 300; color: #757575;
            margin: 0 0 28px; text-align: center;
            font-family: 'Inter', sans-serif;
          }

          /* Campos */
          .lf-field-group { width: 100%; margin-bottom: 18px; }
          .lf-field-label {
            display: block; font-size: 0.82rem; font-weight: 600;
            color: #003060; margin-bottom: 6px; letter-spacing: 0.2px;
            font-family: 'Inter', sans-serif;
          }
          .lf-item {
            --background: #f7f9fc; --border-color: #d0d8e4;
            --border-radius: 10px; --border-width: 1.5px; --border-style: solid;
            --padding-start: 8px; --inner-padding-end: 8px;
            --highlight-color-focused: #003060;
            border-radius: 10px; margin-bottom: 4px;
            font-family: 'Inter', sans-serif;
          }
          .lf-item ion-input {
            --placeholder-color: #b0b8c4; --placeholder-font-weight: 300;
            --color: #1a1a2e; font-family: 'Inter', sans-serif; font-size: 0.95rem;
          }
          .lf-field-icon {
            width: 20px; height: 20px; opacity: 0.65;
            margin-right: 6px; flex-shrink: 0;
          }

          /* Botón */
          .btn-lf-submit {
            --background: #003060; --background-hover: #00428a;
            --background-activated: #00224a; --border-radius: 10px;
            --padding-top: 14px; --padding-bottom: 14px;
            font-family: 'Inter', sans-serif; font-size: 0.97rem; font-weight: 600;
            letter-spacing: 0.2px; text-transform: none;
            margin-top: 20px; width: 100%;
          }
          .btn-lf-icon {
            width: 20px; height: 20px;
            filter: brightness(0) invert(1); margin-right: 8px;
          }

          /* Link volver */
          .lf-volver {
            margin-top: 16px; font-size: 0.85rem;
            font-weight: 300; color: #757575; text-align: center;
            font-family: 'Inter', sans-serif;
          }
          .lf-volver a { color: #003060; font-weight: 500; text-decoration: none; }
          .lf-volver a:hover { text-decoration: underline; }

          /* Footer desktop */
          .lf-footer {
            position: fixed; bottom: 0; left: 0; right: 0; z-index: 6;
            display: flex; justify-content: space-between; align-items: center;
            padding: 0 48px 36px; pointer-events: none; height: 220px;
          }
          .lf-footer-block {
            color: #fff; font-size: 0.78rem; font-weight: 300;
            line-height: 1.7; font-family: 'Inter', sans-serif;
          }
          .lf-footer-block strong { font-weight: 700; }
          .lf-footer-block span { display: block; }
          .lf-footer-block-right { text-align: right; }
          .lf-footer-icon-row { display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }
          .lf-footer-icon-row-right { justify-content: flex-end; }
          .lf-footer-icon-row img { width: 20px; height: 20px; }
          .lf-footer-copy {
            position: fixed; bottom: 6px; left: 0; right: 0; z-index: 7;
            text-align: center; color: rgba(255,255,255,0.40);
            font-size: 0.68rem; font-weight: 300;
            font-family: 'Inter', sans-serif; pointer-events: none;
          }

          /* Logo móvil — oculto en desktop */
          .lf-logo-mobile { display: none; }
          /* Footer móvil — oculto en desktop */
          .lf-mobile-footer { display: none; }

          /* ════════════════════════════
             MÓVIL
          ════════════════════════════ */
          @media (max-width: 600px) and (orientation: portrait) {

            /* Ocultar desktop */
            .lf-logo-desktop { display: none; }
            .lf-header-text  { display: none; }
            .lf-wave         { display: none; }
            .lf-footer       { display: none; }
            .lf-footer-copy  { display: none; }

            /* Logo dentro de la card */
            .lf-logo-mobile {
              display: block; width: 110px;
              margin-bottom: 20px; align-self: flex-start;
            }

            /* Card desde arriba, sin padding-bottom */
            .lf-center {
              align-items: flex-start;
              min-height: unset;
              padding: 16px 12px 0;
            }
            .lf-card {
              padding: 28px 20px 28px;
              border-radius: 16px;
              max-width: 100%; width: 100%;
            }
            .lf-avatar  { width: 80px; height: 80px; }
            .lf-card h2 { font-size: 1.9rem; }

            /* Footer móvil — curva azul sin espacio extra debajo */
            .lf-mobile-footer {
              display: flex; flex-direction: column;
              position: relative; z-index: 5;
              background: #003060;
              border-radius: 50px 50px 0 0;
              margin-top: 28px;
              padding: 32px 28px 36px;
              gap: 24px;
              /* Clave: ocupa hasta el borde inferior sin espacio extra */
              flex-shrink: 0;
            }
            .lf-mobile-footer-block { display: flex; flex-direction: column; gap: 2px; }
            .lf-mobile-footer-icon-row {
              display: flex; align-items: center; gap: 8px; margin-bottom: 4px;
            }
            .lf-mobile-footer-icon-row img { width: 22px; height: 22px; }
            .lf-mobile-footer-block strong {
              color: #fff; font-size: 0.9rem; font-weight: 700;
              font-family: 'Inter', sans-serif;
            }
            .lf-mobile-footer-block span {
              color: rgba(255,255,255,0.85); font-size: 0.82rem;
              font-weight: 300; line-height: 1.6; font-family: 'Inter', sans-serif;
            }
            .lf-mobile-footer-copy {
              color: rgba(255,255,255,0.40); font-size: 0.68rem;
              font-weight: 300; text-align: center; margin-top: 8px;
              font-family: 'Inter', sans-serif;
            }
          }
        `}</style>

        {/* Wrapper raíz que controla el scroll */}
        <div className="lf-root">

          <div className="lf-bg" />
          <div className="lf-wave" />

          <img className="lf-logo-desktop" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />

          <div className="lf-header-text">
            <h1>Acceso funcionario</h1>
            <p>Panel administrativo para funcionarios municipales</p>
          </div>

          {/* Card */}
          <div className="lf-center">
            <div className="lf-card">

              <img className="lf-logo-mobile" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />
              <img className="lf-avatar" src={ASSETS.usuarioAzul} alt="Funcionario" />
              <h2>Panel administrativo</h2>
              <p className="subtitle">Ingrese sus credenciales institucionales</p>

              <form onSubmit={handleLogin} style={{ width: '100%' }}>

                <div className="lf-field-group">
                  <label className="lf-field-label">Correo institucional</label>
                  <IonItem lines="full" className="lf-item">
                    <img slot="start" className="lf-field-icon" src={ASSETS.usuarioGris} alt="" />
                    <IonInput
                      name="email-input"
                      type="email"
                      placeholder="usuario@municipalidad.cl"
                      autocomplete="username"
                    />
                  </IonItem>
                </div>

                <div className="lf-field-group">
                  <label className="lf-field-label">Contraseña</label>
                  <IonItem lines="full" className="lf-item">
                    <img slot="start" className="lf-field-icon" src={ASSETS.candado} alt="" />
                    <IonInput
                      name="pass-input"
                      type={showPass ? 'text' : 'password'}
                      placeholder="Ingresa tu contraseña"
                      autocomplete="current-password"
                    />
                    <IonButton fill="clear" slot="end" onClick={() => setShowPass(!showPass)}>
                      <IonIcon icon={showPass ? eyeOffOutline : eyeOutline} style={{ color: '#757575' }} />
                    </IonButton>
                  </IonItem>
                </div>

                <IonButton expand="block" type="submit" className="btn-lf-submit">
                  <img className="btn-lf-icon" src={ASSETS.puerta} alt="" />
                  Iniciar sesión
                </IonButton>

                <p className="lf-volver">
                  <Link to="/login">Volver a Acceso Ciudadano</Link>
                </p>

              </form>
            </div>
          </div>

          {/* Footer desktop */}
          <div className="lf-footer">
            <div className="lf-footer-block">
              <div className="lf-footer-icon-row">
                <img src={ASSETS.ubicacion} alt="" />
                <strong>Dirección</strong>
              </div>
              <span>Avenida Santa Teresa N°1.</span>
              <span>Santo Domingo, Chile</span>
            </div>
            <div className="lf-footer-block lf-footer-block-right">
              <div className="lf-footer-icon-row lf-footer-icon-row-right">
                <img src={ASSETS.reloj} alt="" />
                <strong>Horario</strong>
              </div>
              <span>Lunes a Viernes: 08:45am a 14:00 pm</span>
              <span>Sábado: 09:30am a 13:30pm</span>
            </div>
          </div>
          <div className="lf-footer-copy">
            ©2026 Municipalidad de Santo Domingo &nbsp;•&nbsp; Política de Privacidad
          </div>

          {/* Footer móvil — pegado al fondo sin espacio extra */}
          <div className="lf-mobile-footer">
            <div className="lf-mobile-footer-block">
              <div className="lf-mobile-footer-icon-row">
                <img src={ASSETS.ubicacion} alt="" />
                <strong>Dirección</strong>
              </div>
              <span>Avenida Santa Teresa N°1.</span>
              <span>Santo Domingo, Chile</span>
            </div>
            <div className="lf-mobile-footer-block">
              <div className="lf-mobile-footer-icon-row">
                <img src={ASSETS.reloj} alt="" />
                <strong>Horario</strong>
              </div>
              <span>Lunes a Viernes: 08:45am a 14:00 pm</span>
              <span>Sábado: 09:30am a 13:30pm</span>
            </div>
            <p className="lf-mobile-footer-copy">
              ©2026 Municipalidad de Santo Domingo &nbsp;•&nbsp; Política de Privacidad
            </p>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginFuncionario;
