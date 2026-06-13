import React, { useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { authService } from '../services/authService';
import ConstructionAlert from '../components/ConstructionAlert';

const ASSETS = {
  fondo:       'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/FondoSantoDomigno.png',
  logo:        'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/LogoSantoDomingoAzul.png',
  usuarioAzul: 'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UsuarioAzul.png',
  circulo:     'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/CirculoMedioAzul.png',
  usuarioGris: 'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UsuarioGris.png',
  candado:     'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/CandadoGris.png',
  ojo:         'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/OjoGrisCerrado.png',
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
    const rutLimpio = (data.get('rut-input') as string || '').trim();
    const passLimpio = (data.get('pass-input') as string || '').trim();
    if (!rutLimpio || !passLimpio) {
      alert("Por favor, complete todos los campos.");
      return;
    }
    try {
      const user = await authService.login(rutLimpio, passLimpio);
      if (user) {
        setTimeout(() => { history.replace('/tramites-user'); }, 100);
      }
    } catch (error: any) {
      alert(error.message || "RUT o contraseña incorrectos. Revisa los datos.");
    }
  };

  return (
    <IonPage>
      <IonContent scrollY={true}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          * { box-sizing: border-box; }

          /* ═══════════════════════════
             DESKTOP  (todo fixed/centrado)
          ═══════════════════════════ */
          .login-root {
            min-height: 100vh;
            width: 100%;
            font-family: 'Inter', sans-serif;
            position: relative;
            display: flex;
            flex-direction: column;
          }

          .login-bg {
            position: fixed;
            inset: 0;
            background-image: url('${ASSETS.fondo}');
            background-size: cover;
            background-position: center;
            z-index: 0;
          }
          .login-bg::after {
            content: '';
            position: absolute;
            inset: 0;
            background: rgba(0, 10, 30, 0.30);
          }

          /* Curva azul inferior — solo desktop */
          .login-wave {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 220px;
            background: #003060;
            border-radius: 55% 55% 0 0 / 60px 60px 0 0;
            z-index: 1;
          }

          /* Logo fijo esquina — solo desktop */
          .logo-desktop {
            display: block;
            position: fixed;
            top: 20px;
            left: 24px;
            z-index: 10;
            width: 100px;
          }
          .logo-mobile { display: none; }

          /* Centro desktop */
          .login-center {
            position: relative;
            z-index: 5;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 40px 20px 240px;
          }

          /* Card */
          .login-card {
            background: #ffffff;
            border-radius: 20px;
            padding: 40px 44px 36px;
            width: 100%;
            max-width: 460px;
            box-shadow: 0 24px 60px rgba(0,0,0,0.22);
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .login-avatar {
            width: 72px;
            height: 72px;
            margin-bottom: 12px;
          }
          .login-title {
            font-size: 1.75rem;
            font-weight: 700;
            color: #003060;
            margin: 0 0 4px;
            letter-spacing: -0.3px;
            text-align: center;
          }
          .login-subtitle {
            font-size: 0.875rem;
            font-weight: 300;
            color: #757575;
            margin: 0 0 28px;
            text-align: center;
          }

          /* Campos */
          .field-group { width: 100%; margin-bottom: 18px; }
          .field-label {
            display: block;
            font-size: 0.82rem;
            font-weight: 600;
            color: #003060;
            margin-bottom: 6px;
            letter-spacing: 0.2px;
          }
          .field-wrapper {
            display: flex;
            align-items: center;
            border: 1.5px solid #d0d8e4;
            border-radius: 10px;
            background: #f7f9fc;
            transition: border-color 0.2s;
          }
          .field-wrapper:focus-within { border-color: #003060; background: #fff; }
          .field-icon { width: 22px; height: 22px; margin-left: 12px; flex-shrink: 0; opacity: 0.65; }
          .field-input {
            flex: 1;
            border: none;
            background: transparent;
            padding: 13px 12px;
            font-size: 0.95rem;
            font-family: 'Inter', sans-serif;
            font-weight: 400;
            color: #1a1a2e;
            outline: none;
            min-width: 0;
          }
          .field-input::placeholder { color: #b0b8c4; font-weight: 300; }
          .field-eye-btn {
            background: none; border: none; cursor: pointer;
            padding: 0 12px; display: flex; align-items: center; flex-shrink: 0;
          }
          .field-eye-btn img { width: 22px; height: 22px; }

          .forgot-link {
            display: block; text-align: right;
            font-size: 0.8rem; font-weight: 400;
            color: #003060; text-decoration: none;
            margin-top: 6px; opacity: 0.8; cursor: pointer;
          }
          .forgot-link:hover { opacity: 1; text-decoration: underline; }

          .btn-primary {
            width: 100%; background: #003060; color: #fff;
            border: none; border-radius: 10px; padding: 14px;
            font-size: 0.97rem; font-weight: 600;
            font-family: 'Inter', sans-serif; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            gap: 10px; margin-top: 24px; letter-spacing: 0.2px;
            transition: background 0.2s, transform 0.1s;
          }
          .btn-primary:hover  { background: #00428a; }
          .btn-primary:active { transform: scale(0.98); }
          .btn-primary img { width: 20px; height: 20px; filter: brightness(0) invert(1); }

          .divider {
            width: 100%; display: flex; align-items: center;
            gap: 10px; margin: 22px 0 18px;
            color: #b0b8c4; font-size: 0.78rem; font-weight: 300;
          }
          .divider::before, .divider::after {
            content: ''; flex: 1; height: 1px; background: #e2e8f0;
          }

          .btn-claveunica {
            width: 100%; background: #fff; color: #003060;
            border: 1.5px solid #003060; border-radius: 10px; padding: 13px;
            font-size: 0.95rem; font-weight: 600;
            font-family: 'Inter', sans-serif; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            gap: 10px; transition: background 0.2s;
          }
          .btn-claveunica:hover { background: #f0f4fa; }
          .btn-claveunica img { width: 22px; height: 22px; }

          .register-text {
            margin-top: 20px; font-size: 0.85rem;
            font-weight: 300; color: #757575; text-align: center;
          }
          .register-text a { color: #003060; font-weight: 600; text-decoration: none; }
          .register-text a:hover { text-decoration: underline; }

          /* Footer desktop — fixed */
          .login-footer {
            position: fixed; bottom: 0; left: 0; right: 0;
            z-index: 6;
            display: flex; justify-content: space-between; align-items: center;
            padding: 0 48px 36px;
            pointer-events: none;
            height: 220px;
          }
          .footer-block {
            color: #fff; font-size: 0.78rem; font-weight: 300; line-height: 1.7;
          }
          .footer-block strong { font-weight: 700; display: inline; }
          .footer-block span { display: block; }
          .footer-block-right { text-align: right; }
          .footer-icon-row {
            display: flex; align-items: center; gap: 8px; margin-bottom: 2px;
          }
          .footer-icon-row-right { justify-content: flex-end; }
          .footer-icon-row img { width: 20px; height: 20px; }

          .footer-copy {
            position: fixed; bottom: 6px; left: 0; right: 0; z-index: 7;
            text-align: center; color: rgba(255,255,255,0.40);
            font-size: 0.68rem; font-weight: 300;
            font-family: 'Inter', sans-serif; pointer-events: none;
          }

          /* Ocultar footer mobile en desktop */
          .mobile-footer-section { display: none; }

          /* ═══════════════════════════
             MÓVIL  (portrait: alto > ancho)
          ═══════════════════════════ */
          @media (max-width: 600px) and (orientation: portrait) {

            /* Ocultar elementos desktop */
            .logo-desktop  { display: none; }
            .login-wave    { display: none; }
            .login-footer  { display: none; }
            .footer-copy   { display: none; }

            /* Logo dentro de la card */
            .logo-mobile {
              display: block;
              width: 110px;
              margin-bottom: 20px;
              align-self: flex-start;
            }

            /* Layout: columna scrolleable */
            .login-root {
              min-height: 100vh;
              display: flex;
              flex-direction: column;
            }

            /* Fondo cubre todo */
            .login-bg { position: fixed; }

            /* La sección de foto ocupa aprox. 40vh */
            .login-center {
              position: relative;
              z-index: 5;
              display: flex;
              align-items: flex-start;
              justify-content: center;
              min-height: unset;
              padding: 24px 14px 0;
            }

            .login-card {
              padding: 28px 20px 28px;
              border-radius: 16px;
              max-width: 100%;
              width: 100%;
            }

            .login-avatar  { width: 80px; height: 80px; }
            .login-title   { font-size: 1.9rem; }
            .login-subtitle { font-size: 0.88rem; }

            /* Sección azul inferior scrolleable */
            .mobile-footer-section {
              display: flex;
              flex-direction: column;
              position: relative;
              z-index: 5;
              background: #003060;
              border-radius: 50px 50px 0 0;
              margin-top: 28px;
              padding: 32px 28px 36px;
              gap: 24px;
            }

            .mobile-footer-block {
              display: flex;
              flex-direction: column;
              gap: 2px;
            }
            .mobile-footer-icon-row {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 4px;
            }
            .mobile-footer-icon-row img { width: 22px; height: 22px; }
            .mobile-footer-block strong {
              color: #fff;
              font-size: 0.9rem;
              font-weight: 700;
            }
            .mobile-footer-block span {
              color: rgba(255,255,255,0.85);
              font-size: 0.82rem;
              font-weight: 300;
              line-height: 1.6;
            }

            .mobile-footer-copy {
              color: rgba(255,255,255,0.40);
              font-size: 0.68rem;
              font-weight: 300;
              text-align: center;
              margin-top: 8px;
            }
          }
        `}</style>

        <div className="login-root">

          {/* Fondo foto */}
          <div className="login-bg" />

          {/* Curva azul — solo desktop */}
          <div className="login-wave" />

          {/* Logo DESKTOP */}
          <img className="logo-desktop" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />

          {/* Card */}
          <div className="login-center">
            <div className="login-card">

              {/* Logo MÓVIL dentro de la card */}
              <img className="logo-mobile" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />

              <img className="login-avatar" src={ASSETS.usuarioAzul} alt="Usuario" />
              <h1 className="login-title">Iniciar sesión</h1>
              <p className="login-subtitle">Ingresa tus credenciales para continuar</p>

              <form onSubmit={handleLogin} style={{ width: '100%' }}>

                <div className="field-group">
                  <label className="field-label">RUT</label>
                  <div className="field-wrapper">
                    <img className="field-icon" src={ASSETS.usuarioGris} alt="" />
                    <input
                      className="field-input"
                      name="rut-input"
                      placeholder="Ej: 12345678-9"
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">Contraseña</label>
                  <div className="field-wrapper">
                    <img className="field-icon" src={ASSETS.candado} alt="" />
                    <input
                      className="field-input"
                      name="pass-input"
                      type={showPass ? 'text' : 'password'}
                      placeholder="Ingresa tu contraseña"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="field-eye-btn"
                      onClick={() => setShowPass(!showPass)}
                      aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      <img
                        src={ASSETS.ojo}
                        alt={showPass ? 'Ocultar' : 'Mostrar'}
                        style={{ opacity: showPass ? 0.9 : 0.55 }}
                      />
                    </button>
                  </div>
                  <span className="forgot-link">¿Olvidaste tu contraseña?</span>
                </div>

                <button className="btn-primary" type="submit">
                  <img src={ASSETS.puerta} alt="" />
                  Iniciar sesión
                </button>

                <div className="divider">o continúa con</div>

                <ConstructionAlert>
                  <button type="button" className="btn-claveunica">
                    <img src={ASSETS.claveUnica} alt="Clave Única" />
                    Ingresar con ClaveÚnica
                  </button>
                </ConstructionAlert>

                <p className="register-text">
                  ¿No tienes una cuenta?{' '}
                  <a href="/register">Regístrate aquí</a>
                </p>

              </form>
            </div>
          </div>

          {/* Footer DESKTOP — fixed */}
          <div className="login-footer">
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

          <div className="footer-copy">
            ©2026 Municipalidad de Santo Domingo &nbsp;•&nbsp; Política de Privacidad
          </div>

          {/* Footer MÓVIL — scrolleable, debajo de la card */}
          <div className="mobile-footer-section">
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

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
