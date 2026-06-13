import React, { useState } from 'react';
import {
  IonContent, IonPage, IonGrid, IonRow, IonCol,
  IonItem, IonInput, IonButton, IonIcon, IonLabel
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { authService } from '../services/authService';
import ConstructionAlert from '../components/ConstructionAlert';

const ASSETS = {
  fondo:       'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/FondoSantoDomigno.png',
  logo:        'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/LogoSantoDomingoAzul.png',
  usuarioAzul: 'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UsuarioAzul.png',
  usuarioGris: 'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UsuarioGris.png',
  candado:     'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/CandadoGris.png',
  puerta:      'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PuertaSalir.png',
  claveUnica:  'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/ClaveUnica.png',
  reloj:       'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/RelojBlanco.png',
  ubicacion:   'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UbicacionBlanco.png',
};

const Login: React.FC = () => {
  const history = useHistory();
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const rutLimpio  = (data.get('rut-input')  as string || '').trim();
    const passLimpio = (data.get('pass-input') as string || '').trim();
    if (!rutLimpio || !passLimpio) {
      alert("Por favor, complete todos los campos.");
      return;
    }
    try {
      const user = await authService.login(rutLimpio, passLimpio);
      if (user) setTimeout(() => history.replace('/tramites-user'), 100);
    } catch (error: any) {
      alert(error.message || "RUT o contraseña incorrectos. Revisa los datos.");
    }
  };

  return (
    <IonPage>
      <IonContent scrollY={true} style={{ '--background': 'transparent' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

          /* Fondo global */
          .login-bg-fixed {
            position: fixed; inset: 0; z-index: 0;
            background-image: url('${ASSETS.fondo}');
            background-size: cover; background-position: center;
          }
          .login-bg-fixed::after {
            content: ''; position: absolute; inset: 0;
            background: rgba(0,10,30,0.32);
          }

          /* Curva azul desktop */
          .login-wave {
            position: fixed; bottom: 0; left: 0; right: 0;
            height: 220px; background: #003060;
            border-radius: 55% 55% 0 0 / 60px 60px 0 0; z-index: 1;
          }

          /* Logo esquina desktop */
          .login-logo-desktop {
            position: fixed; top: 20px; left: 24px;
            z-index: 10; width: 100px; display: block;
          }
          .login-logo-mobile { display: none; }

          /* Wrapper para centrar la card */
          .login-outer {
            position: relative; z-index: 5;
            display: flex; align-items: center; justify-content: center;
            min-height: 100vh; padding: 40px 20px 240px;
            font-family: 'Inter', sans-serif;
          }

          /* Card blanca */
          .login-card {
            background: #fff; border-radius: 20px;
            padding: 36px 40px 32px; width: 100%; max-width: 460px;
            box-shadow: 0 24px 60px rgba(0,0,0,0.22);
            display: flex; flex-direction: column; align-items: center;
          }

          .login-avatar { width: 72px; height: 72px; margin-bottom: 10px; }

          .login-card h1 {
            font-size: 1.75rem; font-weight: 700; color: #003060;
            margin: 0 0 4px; letter-spacing: -0.3px; text-align: center;
            font-family: 'Inter', sans-serif;
          }
          .login-card p.subtitle {
            font-size: 0.875rem; font-weight: 300; color: #757575;
            margin: 0 0 24px; text-align: center;
            font-family: 'Inter', sans-serif;
          }

          /* Sobreescribir estilos Ionic para que encajen */
          .login-card .custom-item {
            --background: #f7f9fc;
            --border-color: #d0d8e4;
            --border-radius: 10px;
            --border-width: 1.5px;
            --border-style: solid;
            --padding-start: 8px;
            --inner-padding-end: 8px;
            --highlight-color-focused: #003060;
            border-radius: 10px;
            margin-bottom: 4px;
            font-family: 'Inter', sans-serif;
          }
          .login-card .custom-item ion-input {
            --placeholder-color: #b0b8c4;
            --placeholder-font-weight: 300;
            --color: #1a1a2e;
            font-family: 'Inter', sans-serif;
            font-size: 0.95rem;
          }

          .field-label-custom {
            display: block; font-size: 0.82rem; font-weight: 600;
            color: #003060; margin-bottom: 6px; letter-spacing: 0.2px;
            font-family: 'Inter', sans-serif;
          }
          .field-group-custom { width: 100%; margin-bottom: 16px; }

          .field-icon-left {
            width: 20px; height: 20px; opacity: 0.65;
            margin-right: 6px; flex-shrink: 0;
          }

          .forgot-text {
            display: block; text-align: right; font-size: 0.8rem;
            color: #003060; opacity: 0.8; cursor: pointer; margin-top: 4px;
            font-family: 'Inter', sans-serif;
          }
          .forgot-text:hover { opacity: 1; text-decoration: underline; }

          /* Botón principal */
          .btn-login {
            --background: #003060;
            --background-hover: #00428a;
            --background-activated: #00224a;
            --border-radius: 10px;
            --padding-top: 14px;
            --padding-bottom: 14px;
            font-family: 'Inter', sans-serif;
            font-size: 0.97rem;
            font-weight: 600;
            letter-spacing: 0.2px;
            text-transform: none;
            margin-top: 20px;
            width: 100%;
          }
          .btn-login-icon {
            width: 20px; height: 20px;
            filter: brightness(0) invert(1); margin-right: 8px;
          }

          /* Divisor */
          .divider-custom {
            width: 100%; display: flex; align-items: center;
            gap: 10px; margin: 20px 0 16px;
            color: #b0b8c4; font-size: 0.78rem; font-weight: 300;
            font-family: 'Inter', sans-serif;
          }
          .divider-custom::before, .divider-custom::after {
            content: ''; flex: 1; height: 1px; background: #e2e8f0;
          }

          /* Botón Clave Única */
          .btn-claveunica {
            --background: #fff;
            --background-hover: #f0f4fa;
            --color: #003060;
            --border-radius: 10px;
            --border-color: #003060;
            --border-width: 1.5px;
            --border-style: solid;
            --padding-top: 13px;
            --padding-bottom: 13px;
            font-family: 'Inter', sans-serif;
            font-size: 0.95rem;
            font-weight: 600;
            text-transform: none;
            width: 100%;
          }
          .btn-claveunica-icon { width: 22px; height: 22px; margin-right: 8px; }

          .register-link-text {
            margin-top: 18px; font-size: 0.85rem;
            font-weight: 300; color: #757575; text-align: center;
            font-family: 'Inter', sans-serif;
          }
          .register-link-text a {
            color: #003060; font-weight: 600; text-decoration: none;
          }
          .register-link-text a:hover { text-decoration: underline; }

          /* Footer desktop */
          .login-footer-desktop {
            position: fixed; bottom: 0; left: 0; right: 0; z-index: 6;
            display: flex; justify-content: space-between; align-items: center;
            padding: 0 48px 36px; pointer-events: none; height: 220px;
          }
          .footer-block {
            color: #fff; font-size: 0.78rem; font-weight: 300;
            line-height: 1.7; font-family: 'Inter', sans-serif;
          }
          .footer-block strong { font-weight: 700; }
          .footer-block span { display: block; }
          .footer-block-right { text-align: right; }
          .footer-icon-row {
            display: flex; align-items: center; gap: 8px; margin-bottom: 2px;
          }
          .footer-icon-row-right { justify-content: flex-end; }
          .footer-icon-row img { width: 20px; height: 20px; }
          .footer-copy-desktop {
            position: fixed; bottom: 6px; left: 0; right: 0; z-index: 7;
            text-align: center; color: rgba(255,255,255,0.40);
            font-size: 0.68rem; font-weight: 300;
            font-family: 'Inter', sans-serif; pointer-events: none;
          }

          .mobile-footer { display: none; }

          /* ── MÓVIL ── */
          @media (max-width: 600px) and (orientation: portrait) {
            .login-logo-desktop  { display: none; }
            .login-wave          { display: none; }
            .login-footer-desktop { display: none; }
            .footer-copy-desktop { display: none; }

            .login-logo-mobile {
              display: block; width: 110px;
              margin-bottom: 20px; align-self: flex-start;
            }
            .login-outer {
              align-items: flex-start; min-height: unset; padding: 24px 14px 0;
            }
            .login-card {
              padding: 28px 18px; border-radius: 16px; max-width: 100%;
            }
            .login-avatar { width: 80px; height: 80px; }
            .login-card h1 { font-size: 1.9rem; }

            .mobile-footer {
              display: flex; flex-direction: column;
              position: relative; z-index: 5;
              background: #003060; border-radius: 50px 50px 0 0;
              margin-top: 28px; padding: 32px 28px 36px; gap: 24px;
            }
            .mobile-footer-block { display: flex; flex-direction: column; gap: 2px; }
            .mobile-footer-icon-row {
              display: flex; align-items: center; gap: 8px; margin-bottom: 4px;
            }
            .mobile-footer-icon-row img { width: 22px; height: 22px; }
            .mobile-footer-block strong {
              color: #fff; font-size: 0.9rem; font-weight: 700;
              font-family: 'Inter', sans-serif;
            }
            .mobile-footer-block span {
              color: rgba(255,255,255,0.85); font-size: 0.82rem;
              font-weight: 300; line-height: 1.6; font-family: 'Inter', sans-serif;
            }
            .mobile-footer-copy {
              color: rgba(255,255,255,0.40); font-size: 0.68rem;
              font-weight: 300; text-align: center; margin-top: 8px;
              font-family: 'Inter', sans-serif;
            }
          }
        `}</style>

        {/* Fondo y curva */}
        <div className="login-bg-fixed" />
        <div className="login-wave" />

        {/* Logo desktop */}
        <img className="login-logo-desktop" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />

        {/* Card centrada */}
        <div className="login-outer">
          <div className="login-card">

            {/* Logo móvil */}
            <img className="login-logo-mobile" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />

            <img className="login-avatar" src={ASSETS.usuarioAzul} alt="Usuario" />
            <h1>Iniciar sesión</h1>
            <p className="subtitle">Ingresa tus credenciales para continuar</p>

            <form onSubmit={handleLogin} style={{ width: '100%' }}>

              {/* RUT */}
              <div className="field-group-custom">
                <label className="field-label-custom">RUT</label>
                <IonItem lines="full" className="custom-item">
                  <img slot="start" className="field-icon-left" src={ASSETS.usuarioGris} alt="" />
                  <IonInput
                    name="rut-input"
                    placeholder="Ej: 12345678-9"
                    autocomplete="username"
                  />
                </IonItem>
              </div>

              {/* Contraseña */}
              <div className="field-group-custom">
                <label className="field-label-custom">Contraseña</label>
                <IonItem lines="full" className="custom-item">
                  <img slot="start" className="field-icon-left" src={ASSETS.candado} alt="" />
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
                <span className="forgot-text">¿Olvidaste tu contraseña?</span>
              </div>

              {/* Botón iniciar sesión */}
              <IonButton expand="block" type="submit" className="btn-login">
                <img className="btn-login-icon" src={ASSETS.puerta} alt="" />
                Iniciar sesión
              </IonButton>

              {/* Divisor */}
              <div className="divider-custom">o continúa con</div>

              {/* Clave Única */}
              <ConstructionAlert>
                <IonButton expand="block" fill="outline" className="btn-claveunica">
                  <img className="btn-claveunica-icon" src={ASSETS.claveUnica} alt="" />
                  Ingresar con ClaveÚnica
                </IonButton>
              </ConstructionAlert>

              {/* Link registro */}
              <p className="register-link-text">
                ¿No tienes una cuenta?{' '}
                <a href="/register">Regístrate aquí</a>
              </p>

            </form>
          </div>
        </div>

        {/* Footer desktop */}
        <div className="login-footer-desktop">
          <div className="footer-block">
            <div className="footer-icon-row">
              <img src={ASSETS.ubicacion} alt="" />
              <strong>Dirección</strong>
            </div>
            <span>Avenida Santa Teresa N°1.</span>
            <span>Santo Domingo, Chile</span>
          </div>
          <div className="footer-block footer-block-right">
            <div className="footer-icon-row footer-icon-row-right">
              <img src={ASSETS.reloj} alt="" />
              <strong>Horario</strong>
            </div>
            <span>Lunes a Viernes: 08:45am a 14:00 pm</span>
            <span>Sábado: 09:30am a 13:30pm</span>
          </div>
        </div>

        <div className="footer-copy-desktop">
          ©2026 Municipalidad de Santo Domingo &nbsp;•&nbsp; Política de Privacidad
        </div>

        {/* Footer móvil scrolleable */}
        <div className="mobile-footer">
          <div className="mobile-footer-block">
            <div className="mobile-footer-icon-row">
              <img src={ASSETS.ubicacion} alt="" />
              <strong>Dirección</strong>
            </div>
            <span>Avenida Santa Teresa N°1.</span>
            <span>Santo Domingo, Chile</span>
          </div>
          <div className="mobile-footer-block">
            <div className="mobile-footer-icon-row">
              <img src={ASSETS.reloj} alt="" />
              <strong>Horario</strong>
            </div>
            <span>Lunes a Viernes: 08:45am a 14:00 pm</span>
            <span>Sábado: 09:30am a 13:30pm</span>
          </div>
          <p className="mobile-footer-copy">
            ©2026 Municipalidad de Santo Domingo &nbsp;•&nbsp; Política de Privacidad
          </p>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Login;
