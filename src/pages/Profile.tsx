import { useState, useEffect, useRef } from 'react';
import {
  IonPage, IonContent, IonGrid, IonRow, IonCol,
  IonItem, IonInput, IonButton, IonText,
  useIonToast, IonSpinner
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { authService } from '../services/authService';
import ConstructionAlert from '../components/ConstructionAlert';

const ASSETS = {
  fondo:         'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/FondoSantoDomigno.png',
  logo:          'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/LogoSantoDomingoAzul.png',
  ubicacion:     'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UbicacionBlanco.png',
  reloj:         'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/RelojBlanco.png',
  usuarioGris:   'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UsuarioGris.png',
  ciudad:        'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/CiudadGris.png',
  ubicacionGris: 'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UbicacionGris.png',
  puerta:        'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PuertaSalir.png',
  calendario:    'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/CalendarioBlanco.png',
  camara:        'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/CamaraBlanco.png',
  email:         'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/EmailBlanco.png',
  nube:          'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/NubeBlanco.png',
  perfilBlanco:  'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PerfilBlanco.png',
  perfilVerde:   'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PerfilVerde.png',
  phone:         'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PhoneBlanco.png',
  tramite:       'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/TramiteBlanco.png',
  volver:        'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PerfilBlanco.png',
};

const Profile = () => {
  const history = useHistory();
  const [presentToast] = useIonToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userId, setUserId]                   = useState<number | null>(null);
  const [nombre, setNombre]                   = useState('');
  const [rut, setRut]                         = useState('');
  const [correo, setCorreo]                   = useState('');
  const [region, setRegion]                   = useState('');
  const [comuna, setComuna]                   = useState('');
  const [rolUsuario, setRolUsuario]           = useState('ciudadano');
  const [estadoDocumento, setEstadoDocumento] = useState('Sin subir');
  const [isLoaded, setIsLoaded]               = useState(false);
  const [subiendoArchivo, setSubiendoArchivo] = useState(false);

  const [showCorreoModal, setShowCorreoModal] = useState(false);
  const [nuevoCorreo, setNuevoCorreo]         = useState('');
  const [guardandoCorreo, setGuardandoCorreo] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        await authService.verifySession();
        const session = localStorage.getItem('user_session');
        if (session) {
          const userObj = JSON.parse(session);
          const user = Array.isArray(userObj) ? userObj[0] : userObj;
          setUserId(user.id);
          setNombre(`${user.nombres} ${user.apellidoP || user.apellido_p || ''} ${user.apellidoM || user.apellido_m || ''}`);
          setRut(user.rut);
          setCorreo(user.correo);
          setRegion(user.region);
          setComuna(user.comuna);
          if (user.rol) setRolUsuario(user.rol.toLowerCase());
          if (user.estado_validacion) setEstadoDocumento(user.estado_validacion);
          setIsLoaded(true);
        }
      } catch (error) {
        authService.logout();
        history.push('/login');
      }
    };
    checkSession();
  }, [history]);

  const handleLogout = () => {
  authService.logout();
  // Cambiamos history.push por window.location.href
  window.location.href = '/tramites';
};

  const triggerFileSelect = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleGuardarCorreo = async () => {
    if (!nuevoCorreo || !nuevoCorreo.includes('@')) {
      presentToast({ message: 'Por favor ingresa un correo válido.', duration: 3000, color: 'warning' });
      return;
    }
    setGuardandoCorreo(true);
    try {
      const BACKEND_URL = `http://localhost:3000/api/usuarios/${userId}/correo`;
      const response = await fetch(BACKEND_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: nuevoCorreo }),
      });
      const data = await response.json();
      if (data.ok || response.ok) {
        setCorreo(nuevoCorreo);
        const sessionData = localStorage.getItem('user_session');
        if (sessionData) {
          let userObj = JSON.parse(sessionData);
          if (Array.isArray(userObj)) userObj[0].correo = nuevoCorreo;
          else userObj.correo = nuevoCorreo;
          localStorage.setItem('user_session', JSON.stringify(userObj));
        }
        presentToast({ message: 'Correo actualizado correctamente.', duration: 3000, color: 'success' });
        setShowCorreoModal(false);
        setNuevoCorreo('');
      } else {
        throw new Error(data.error || 'Error al actualizar correo');
      }
    } catch (error) {
      presentToast({ message: 'Error al actualizar el correo. Intenta de nuevo.', duration: 3000, color: 'danger' });
    } finally {
      setGuardandoCorreo(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!userId || userId === 0) {
      presentToast({ message: 'Error de sincronización: No se detectó tu ID. Por favor, recarga la página.', duration: 4000, color: 'danger' });
      return;
    }
    setSubiendoArchivo(true);
    const formData = new FormData();
    formData.append('usuario_id', String(userId));
    formData.append('documento_residencia', file);
    try {
      const BACKEND_URL = 'http://localhost:3000/api/usuarios/residencia';
      const response = await fetch(BACKEND_URL, { method: 'POST', body: formData });
      const data = await response.json();
      if (data.ok) {
        presentToast({ message: 'Documento subido con éxito. En revisión.', duration: 3000, color: 'success' });
        setEstadoDocumento('En revisión');
        const sessionData = localStorage.getItem('user_session');
        if (sessionData) {
          let userObj = JSON.parse(sessionData);
          if (Array.isArray(userObj)) userObj[0].estado_validacion = 'En revisión';
          else userObj.estado_validacion = 'En revisión';
          localStorage.setItem('user_session', JSON.stringify(userObj));
        }
      } else {
        throw new Error(data.error || 'Error al subir documento');
      }
    } catch (error) {
      presentToast({ message: 'Hubo un error al conectar con el servidor.', duration: 3000, color: 'danger' });
    } finally {
      setSubiendoArchivo(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!isLoaded) return null;

  const esResidente = rolUsuario === 'residente';

  return (
    <IonPage>
      <IonContent scrollY={true} style={{ '--background': '#001830' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          * { box-sizing: border-box; }

          .prf-root {
            display: flex;
            min-height: 100vh;
            font-family: 'Inter', sans-serif;
            background: #001830;
          }

          /* ── SIDEBAR ── */
          .prf-sidebar {
            width: 200px;
            flex-shrink: 0;
            background: #002050;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 20px 12px;
            gap: 4px;
            position: sticky;
            top: 0;
            height: 100vh;
          }
          .prf-sidebar-logo {
            width: 90px;
            margin-bottom: 24px;
            align-self: flex-start;
            filter: brightness(0) invert(1);
          }
          .prf-nav-btn {
            --background: transparent;
            --background-hover: rgba(255,255,255,0.10);
            --color: rgba(255,255,255,0.75);
            --border-radius: 8px;
            --padding-start: 10px; --padding-end: 10px;
            --padding-top: 10px; --padding-bottom: 10px;
            text-transform: none;
            font-family: 'Inter', sans-serif;
            font-size: 0.88rem; font-weight: 500;
            width: 100%; margin: 0;
            justify-content: flex-start;
          }
          .prf-nav-btn.active-nav {
            --background: rgba(255,255,255,0.14);
            --color: #ffffff; font-weight: 700;
          }
          .prf-nav-icon {
            width: 20px; height: 20px; margin-right: 10px;
            flex-shrink: 0; filter: brightness(0) invert(1); opacity: 0.80;
          }
          .prf-sidebar-spacer { flex: 1; }

          .prf-nav-volver {
            --background: rgba(255,255,255,0.08);
            --background-hover: rgba(255,255,255,0.15);
            --color: #ffffff;
            --border-radius: 8px;
            --padding-start: 10px; --padding-end: 10px;
            --padding-top: 10px; --padding-bottom: 10px;
            text-transform: none;
            font-family: 'Inter', sans-serif;
            font-size: 0.88rem; font-weight: 600;
            width: 100%; margin: 0 0 8px 0;
            justify-content: flex-start;
            border: 1px solid rgba(255,255,255,0.20);
          }

          .prf-nav-logout {
            --background: transparent;
            --background-hover: rgba(255,255,255,0.08);
            --color: rgba(255,255,255,0.60);
            --border-radius: 8px;
            --padding-start: 10px; --padding-end: 10px;
            --padding-top: 10px; --padding-bottom: 10px;
            text-transform: none;
            font-family: 'Inter', sans-serif;
            font-size: 0.88rem; font-weight: 500;
            width: 100%; margin: 0;
            justify-content: flex-start;
          }

          .prf-right {
            flex: 1; display: flex; flex-direction: column; min-width: 0;
          }

          .prf-header {
            position: relative;
            background-image: url('${ASSETS.fondo}');
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;
            min-height: 200px;
            display: flex;
            align-items: flex-end;
            padding: 24px 28px;
          }
          .prf-header::after {
            content: '';
            position: absolute; inset: 0;
            background: rgba(0,10,40,0.55);
          }
          .prf-header-content {
            position: relative; z-index: 2; flex: 1;
          }
          .prf-header-content h1 {
            font-size: 2rem; font-weight: 700; color: #fff;
            margin: 0 0 2px; font-family: 'Inter', sans-serif;
          }
          .prf-header-content p {
            font-size: 0.85rem; font-weight: 300;
            color: rgba(255,255,255,0.75); margin: 0;
            font-family: 'Inter', sans-serif;
          }

          .prf-photo-area {
            position: absolute; top: 16px; right: 20px; z-index: 2;
            display: flex; flex-direction: column; align-items: center; gap: 8px;
          }
          .prf-photo-box {
            width: 110px; height: 110px; background: #c0c8d0;
            border-radius: 10px; display: flex;
            align-items: center; justify-content: center; overflow: hidden;
          }
          .prf-photo-box img { width: 80px; height: 80px; opacity: 0.6; }
          .prf-photo-btn {
            --background: #002050; --background-hover: #003080; --color: #fff;
            --border-radius: 8px;
            --padding-start: 10px; --padding-end: 10px;
            --padding-top: 6px; --padding-bottom: 6px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.78rem; font-weight: 500; width: 110px; margin: 0;
          }
          .prf-photo-btn img {
            width: 14px; height: 14px; margin-right: 6px;
            filter: brightness(0) invert(1);
          }

          .prf-fields-area {
            background: #001830; padding: 32px 36px 28px; flex: 1; color: #fff;
          }
          .prf-item {
            --background: #002050; --border-color: #003070;
            --border-radius: 10px; --border-style: solid; --border-width: 1px;
            --color: #ffffff; --padding-start: 12px; --inner-padding-end: 12px;
            --highlight-color-focused: #5bb8ff;
            border-radius: 10px; margin-bottom: 4px;
            font-family: 'Inter', sans-serif;
          }
          .prf-item ion-input {
            --color: #ffffff; --placeholder-color: rgba(255,255,255,0.30);
            font-family: 'Inter', sans-serif; font-size: 0.95rem;
          }
          .prf-field-label {
            display: block; font-size: 0.85rem; font-weight: 600;
            color: rgba(255,255,255,0.80); margin-bottom: 8px;
            letter-spacing: 0.2px; font-family: 'Inter', sans-serif;
          }
          .prf-field-group { margin-bottom: 24px; }
          .prf-field-icon {
            width: 20px; height: 20px; margin-right: 6px; flex-shrink: 0;
            filter: brightness(0) invert(1); opacity: 0.50;
          }

          .prf-correo-wrapper {
            display: flex; align-items: center; gap: 0;
            border: 1.5px solid #42B3DB; border-radius: 10px;
            background: #002050; overflow: hidden;
          }
          .prf-correo-inner {
            flex: 1; display: flex; align-items: center; padding: 0 12px;
          }
          .prf-correo-inner img {
            width: 20px; height: 20px; filter: brightness(0) invert(1);
            opacity: 0.50; flex-shrink: 0; margin-right: 10px;
          }
          .prf-correo-input {
            flex: 1; border: none; background: transparent;
            padding: 13px 0; font-size: 0.95rem;
            font-family: 'Inter', sans-serif; font-weight: 400;
            color: #ffffff; outline: none; min-width: 0;
          }
          .prf-correo-divider {
            width: 1px; background: #42B3DB; align-self: stretch;
          }
          .btn-modificar {
            --background: transparent;
            --background-hover: rgba(66,179,219,0.10);
            --color: #42B3DB; --border-radius: 0;
            --padding-start: 18px; --padding-end: 18px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.85rem; font-weight: 500;
            height: 48px; margin: 0; flex-shrink: 0;
          }

          .prf-estado-box {
            display: flex; align-items: center; gap: 12px;
            background: #19314A; border: 1px solid #254d73;
            border-radius: 10px; padding: 16px 18px; margin-bottom: 20px;
          }
          .prf-estado-box img { width: 24px; height: 24px; }
          .prf-estado-text {
            font-size: 0.95rem; font-weight: 400;
            color: rgba(255,255,255,0.90); font-family: 'Inter', sans-serif;
          }
          .prf-estado-verde { color: #4cde80; font-weight: 700; }
          .prf-estado-normal { color: #fff; font-weight: 700; }

          .prf-residencia-box {
            display: flex; align-items: center; gap: 16px;
            background: #19314A; border: 1px solid #254d73;
            border-radius: 10px; padding: 18px 22px; margin-bottom: 24px;
          }
          .prf-residencia-icon {
            width: 40px; height: 40px; flex-shrink: 0;
            filter: brightness(0) invert(1); opacity: 0.75;
          }
          .prf-residencia-texts { flex: 1; }
          .prf-residencia-texts h4 {
            margin: 0 0 4px; font-size: 0.95rem; font-weight: 600;
            color: #fff; font-family: 'Inter', sans-serif;
          }
          .prf-residencia-texts p {
            margin: 0; font-size: 0.80rem; font-weight: 300;
            color: rgba(255,255,255,0.55); font-family: 'Inter', sans-serif;
          }
          .btn-subir {
            --background: #003060; --background-hover: #004090; --color: #fff;
            --border-radius: 8px; --padding-start: 16px; --padding-end: 16px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.88rem; font-weight: 600; flex-shrink: 0; margin: 0;
          }
          .btn-subir img {
            width: 18px; height: 18px;
            filter: brightness(0) invert(1); margin-right: 6px;
          }

          .prf-footer {
            background: #003060; border-top: 1px solid rgba(255,255,255,0.10);
            padding: 28px 36px 16px;
            display: flex; justify-content: space-between;
            align-items: flex-start; flex-wrap: wrap; gap: 20px;
          }
          .prf-footer-block {
            display: flex; flex-direction: column; gap: 4px;
            font-family: 'Inter', sans-serif;
          }
          .prf-footer-block strong { color: #fff; font-size: 1rem; font-weight: 700; }
          .prf-footer-block span { color: rgba(255,255,255,0.75); font-size: 0.88rem; font-weight: 300; }
          .prf-footer-icon-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
          .prf-footer-icon-row img { width: 22px; height: 22px; }
          .prf-footer-divider { width: 1px; background: rgba(255,255,255,0.20); align-self: stretch; }
          .prf-footer-copy {
            text-align: center; color: rgba(255,255,255,0.35);
            font-size: 0.75rem; font-weight: 300;
            padding: 12px 0 8px; background: #003060;
            font-family: 'Inter', sans-serif;
          }

          .modal-overlay {
            position: fixed; inset: 0; z-index: 1000;
            background: rgba(0,0,0,0.65);
            display: flex; align-items: center; justify-content: center;
            padding: 20px;
          }
          .modal-box {
            background: #002050;
            border: 1px solid #42B3DB;
            border-radius: 16px;
            padding: 32px 28px;
            width: 100%; max-width: 420px;
            display: flex; flex-direction: column; gap: 16px;
            box-shadow: 0 24px 60px rgba(0,0,0,0.50);
          }
          .modal-box h2 {
            margin: 0; font-size: 1.2rem; font-weight: 700;
            color: #fff; font-family: 'Inter', sans-serif;
          }
          .modal-box p {
            margin: 0; font-size: 0.85rem; font-weight: 300;
            color: rgba(255,255,255,0.65); font-family: 'Inter', sans-serif;
          }
          .modal-input-wrapper {
            display: flex; align-items: center;
            border: 1.5px solid #42B3DB; border-radius: 10px;
            background: #001830; overflow: hidden; padding: 0 14px;
          }
          .modal-input-wrapper img {
            width: 20px; height: 20px;
            filter: brightness(0) invert(1); opacity: 0.50;
            flex-shrink: 0; margin-right: 10px;
          }
          .modal-input {
            flex: 1; border: none; background: transparent;
            padding: 13px 0; font-size: 0.95rem;
            font-family: 'Inter', sans-serif; font-weight: 400;
            color: #fff; outline: none;
          }
          .modal-input::placeholder { color: rgba(255,255,255,0.30); font-weight: 300; }
          .modal-actions {
            display: flex; gap: 12px; justify-content: flex-end; margin-top: 4px;
          }
          .btn-modal-cancel {
            --background: transparent;
            --background-hover: rgba(255,255,255,0.08);
            --color: rgba(255,255,255,0.60);
            --border-color: rgba(255,255,255,0.25);
            --border-width: 1px; --border-style: solid;
            --border-radius: 8px;
            --padding-start: 20px; --padding-end: 20px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.9rem; font-weight: 500; margin: 0;
          }
          .btn-modal-save {
            --background: #003060; --background-hover: #004090;
            --color: #fff; --border-radius: 8px;
            --padding-start: 20px; --padding-end: 20px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.9rem; font-weight: 600; margin: 0;
          }

          .prf-bottom-nav { display: none; }

          @media (max-width: 600px) and (orientation: portrait) {
            .prf-root { flex-direction: column; }
            .prf-sidebar { display: none; }
            .prf-header { min-height: 150px; padding: 16px; }
            .prf-header-content h1 { font-size: 1.6rem; }
            .prf-photo-area { top: 10px; right: 12px; }
            .prf-photo-box { width: 80px; height: 80px; }
            .prf-photo-box img { width: 55px; height: 55px; }
            .prf-photo-btn { width: 80px; font-size: 0.72rem; }
            .prf-fields-area { padding: 20px 16px 16px; }
            .prf-correo-wrapper { flex-direction: column; border-radius: 10px; }
            .prf-correo-divider { width: 100%; height: 1px; align-self: auto; }
            .btn-modificar { width: 100%; height: 40px; --border-radius: 0 0 8px 8px; }
            .prf-residencia-box { flex-direction: column; align-items: flex-start; }
            .btn-subir { align-self: flex-end; }
            .prf-footer { flex-direction: column; padding: 20px 20px 12px; gap: 16px; }
            .prf-footer-divider { display: none; }
            .modal-box { padding: 24px 18px; }
            .modal-actions { flex-direction: column; }
            .btn-modal-cancel, .btn-modal-save { width: 100%; }
            .prf-bottom-nav {
              display: flex; justify-content: space-around;
              background: #003060; border-top: 1px solid rgba(255,255,255,0.15);
              padding: 10px 0 14px;
              position: sticky; bottom: 0; z-index: 20; width: 100%;
            }
            .prf-bottom-btn {
              --background: transparent; --color: rgba(255,255,255,0.70);
              --border-radius: 8px; text-transform: none;
              font-family: 'Inter', sans-serif;
              font-size: 0.70rem; font-weight: 500;
              flex: 1; margin: 0;
              display: flex; flex-direction: column; align-items: center;
            }
            .prf-bottom-btn.active-nav { --color: #fff; }
            .prf-bottom-icon {
              width: 24px; height: 24px; filter: brightness(0) invert(1);
              opacity: 0.75; display: block; margin: 0 auto 4px;
            }
          }
        `}</style>

        {/* POPUP MODIFICAR CORREO */}
        {showCorreoModal && (
          <div className="modal-overlay" onClick={() => setShowCorreoModal(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <h2>Modificar correo electrónico</h2>
              <p>Ingresa tu nuevo correo. Una vez guardado reemplazará el actual.</p>
              <div className="modal-input-wrapper">
                <img src={ASSETS.email} alt="" />
                <input
                  className="modal-input"
                  type="email"
                  placeholder="nuevo@correo.cl"
                  value={nuevoCorreo}
                  onChange={e => setNuevoCorreo(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="modal-actions">
                <IonButton
                  className="btn-modal-cancel"
                  fill="outline"
                  onClick={() => { setShowCorreoModal(false); setNuevoCorreo(''); }}
                >
                  Cancelar
                </IonButton>
                <IonButton
                  className="btn-modal-save"
                  onClick={handleGuardarCorreo}
                  disabled={guardandoCorreo}
                >
                  {guardandoCorreo ? <IonSpinner name="dots" /> : 'Guardar'}
                </IonButton>
              </div>
            </div>
          </div>
        )}

        <div className="prf-root">

          {/* SIDEBAR */}
          <div className="prf-sidebar">
            <img className="prf-sidebar-logo" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />
            <IonButton className="prf-nav-btn active-nav" fill="clear" onClick={() => history.push('/profile')}>
              <img className="prf-nav-icon" src={ASSETS.perfilBlanco} alt="" />Mi perfil
            </IonButton>
            <IonButton className="prf-nav-btn" fill="clear" onClick={() => history.push('/mis-tramites')}>
              <img className="prf-nav-icon" src={ASSETS.tramite} alt="" />Mis trámites
            </IonButton>
            <IonButton className="prf-nav-btn" fill="clear" onClick={() => history.push('/mis-agendas')}>
              <img className="prf-nav-icon" src={ASSETS.calendario} alt="" />Mis agendas
            </IonButton>
            <div className="prf-sidebar-spacer" />
            <IonButton className="prf-nav-volver" fill="clear" onClick={() => history.push('/tramites-user')}>
              ← Volver a trámites
            </IonButton>
            <IonButton className="prf-nav-logout" fill="clear" onClick={handleLogout}>
              <img className="prf-nav-icon" src={ASSETS.puerta} alt="" />Cerrar sesión
            </IonButton>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="prf-right">

            <div className="prf-header">
              <div className="prf-header-content">
                <h1>Mi perfil</h1>
                <p>Gestiona tu información personal</p>
              </div>
              <div className="prf-photo-area">
                <div className="prf-photo-box">
                  <img src={ASSETS.usuarioGris} alt="Foto perfil" />
                </div>
                <ConstructionAlert>
                  <IonButton className="prf-photo-btn" fill="clear">
                    <img src={ASSETS.camara} alt="" />Agregar foto
                  </IonButton>
                </ConstructionAlert>
              </div>
            </div>

            <div className="prf-fields-area">
              <IonGrid style={{ padding: 0 }}>
                <IonRow>

                  <IonCol size="12" sizeMd="6">
                    <div className="prf-field-group">
                      <label className="prf-field-label">Nombre</label>
                      <IonItem lines="full" className="prf-item">
                        <img slot="start" className="prf-field-icon" src={ASSETS.usuarioGris} alt="" />
                        <IonInput value={nombre} readonly={true} />
                      </IonItem>
                    </div>
                  </IonCol>

                  <IonCol size="12" sizeMd="6">
                    <div className="prf-field-group">
                      <label className="prf-field-label">Rut</label>
                      <IonItem lines="full" className="prf-item">
                        <img slot="start" className="prf-field-icon" src={ASSETS.usuarioGris} alt="" />
                        <IonInput value={rut} readonly={true} />
                      </IonItem>
                    </div>
                  </IonCol>

                  <IonCol size="12">
                    <div className="prf-field-group">
                      <label className="prf-field-label">Correo Electrónico</label>
                      <div className="prf-correo-wrapper">
                        <div className="prf-correo-inner">
                          <img src={ASSETS.email} alt="" />
                          <input
                            className="prf-correo-input"
                            type="email"
                            value={correo}
                            readOnly
                            placeholder="correo@ejemplo.cl"
                          />
                        </div>
                        <div className="prf-correo-divider" />
                        <IonButton
                          className="btn-modificar"
                          fill="clear"
                          onClick={() => { setNuevoCorreo(''); setShowCorreoModal(true); }}
                        >
                          Modificar correo
                        </IonButton>
                      </div>
                    </div>
                  </IonCol>

                  <IonCol size="12" sizeMd="6">
                    <div className="prf-field-group">
                      <label className="prf-field-label">Región</label>
                      <IonItem lines="full" className="prf-item">
                        <img slot="start" className="prf-field-icon" src={ASSETS.ciudad} alt="" />
                        <IonInput value={region} readonly={true} />
                      </IonItem>
                    </div>
                  </IonCol>

                  <IonCol size="12" sizeMd="6">
                    <div className="prf-field-group">
                      <label className="prf-field-label">Comuna</label>
                      <IonItem lines="full" className="prf-item">
                        <img slot="start" className="prf-field-icon" src={ASSETS.ubicacionGris} alt="" />
                        <IonInput value={comuna} readonly={true} />
                      </IonItem>
                    </div>
                  </IonCol>

                  <IonCol size="12">
                    <div className="prf-estado-box">
                      <img src={esResidente ? ASSETS.perfilVerde : ASSETS.perfilBlanco} alt="" />
                      <IonText className="prf-estado-text">
                        Estado actual:{' '}
                        <strong className={esResidente ? 'prf-estado-verde' : 'prf-estado-normal'}>
                          {esResidente ? 'Residente' : 'Ciudadano'}
                        </strong>
                      </IonText>
                    </div>
                  </IonCol>

                  <IonCol size="12">
                    <div className="prf-residencia-box">
                      <img className="prf-residencia-icon" src={ASSETS.tramite} alt="" />
                      <div className="prf-residencia-texts">
                        <h4>Acreditar Residencia en la comuna</h4>
                        <p>
                          {esResidente
                            ? 'Residencia acreditada'
                            : estadoDocumento === 'En revisión'
                              ? 'Documento en revisión'
                              : 'Puedes subir un documento que acredite tu residencia'}
                        </p>
                      </div>
                      <input
                        type="file" accept="image/*,.pdf"
                        ref={fileInputRef} style={{ display: 'none' }}
                        onChange={handleFileUpload}
                      />
                      <IonButton
                        className="btn-subir"
                        onClick={triggerFileSelect}
                        disabled={subiendoArchivo || esResidente || estadoDocumento === 'En revisión'}
                      >
                        {subiendoArchivo
                          ? <IonSpinner name="dots" />
                          : <><img src={ASSETS.nube} alt="" />Subir archivo</>
                        }
                      </IonButton>
                    </div>
                  </IonCol>

                </IonRow>
              </IonGrid>
            </div>

            <div className="prf-footer">
              <div className="prf-footer-block">
                <div className="prf-footer-icon-row">
                  <img src={ASSETS.ubicacion} alt="" /><strong>Dirección</strong>
                </div>
                <span>Avenida Santa Teresa N°1.</span>
                <span>Santo Domingo, Chile</span>
              </div>
              <div className="prf-footer-divider" />
              <div className="prf-footer-block">
                <div className="prf-footer-icon-row">
                  <img src={ASSETS.phone} alt="" /><strong>Emergencias 24 horas:</strong>
                </div>
                <span>+563 2238 1603 • +563 5220 4200</span>
                <span>Seguridad: 1458 • contacto@santodomingo.cl</span>
              </div>
              <div className="prf-footer-divider" />
              <div className="prf-footer-block">
                <div className="prf-footer-icon-row">
                  <img src={ASSETS.reloj} alt="" /><strong>Horario</strong>
                </div>
                <span>Lunes a Viernes: 08:45am a 14:00 pm</span>
                <span>Sábado: 09:30am a 13:30pm</span>
              </div>
            </div>
            <div className="prf-footer-copy">
              ©2026 Municipalidad de Santo Domingo &nbsp;•&nbsp; Política de Privacidad
            </div>

            <div className="prf-bottom-nav">
              <IonButton className="prf-bottom-btn active-nav" fill="clear" onClick={() => history.push('/profile')}>
                <img className="prf-bottom-icon" src={ASSETS.perfilBlanco} alt="" />Mi perfil
              </IonButton>
              <IonButton className="prf-bottom-btn" fill="clear" onClick={() => history.push('/mis-tramites')}>
                <img className="prf-bottom-icon" src={ASSETS.tramite} alt="" />Mis trámites
              </IonButton>
              <IonButton className="prf-bottom-btn" fill="clear" onClick={() => history.push('/mis-agendas')}>
                <img className="prf-bottom-icon" src={ASSETS.calendario} alt="" />Mis agendas
              </IonButton>
              <IonButton className="prf-bottom-btn" fill="clear" onClick={() => history.push('/tramites-user')}>
                <img className="prf-bottom-icon" src={ASSETS.puerta} alt="" />Volver
              </IonButton>
            </div>

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
