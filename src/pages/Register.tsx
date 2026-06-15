import React, { useState } from 'react';
import {
  IonContent, IonPage, IonGrid, IonRow, IonCol,
  IonItem, IonInput, IonButton, IonIcon, IonSelect, IonSelectOption
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { authService } from '../services/authService';

const ASSETS = {
  fondo:         'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/FondoSantoDomigno.png',
  logo:          'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/LogoSantoDomingoAzul.png',
  usuarioAzul:   'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UsuarioAzul.png',
  usuarioGris:   'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UsuarioGris.png',
  candado:       'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/CandadoGris.png',
  reloj:         'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/RelojBlanco.png',
  ubicacion:     'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UbicacionBlanco.png',
  ciudad:        'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/CiudadGris.png',
  crearCuenta:   'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/CrearCuentaBlanco.png',
  ubicacionGris: 'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UbicacionGris.png',
};

const REGIONES_COMUNAS: Record<string, string[]> = {
  'Arica y Parinacota': ['Arica', 'Camarones', 'Putre', 'General Lagos'],
  'Tarapacá': ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica'],
  'Antofagasta': ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal', 'Calama', 'Ollagüe', 'San Pedro de Atacama', 'Tocopilla', 'María Elena'],
  'Atacama': ['Copiapó', 'Caldera', 'Tierra Amarilla', 'Chañaral', 'Diego de Almagro', 'Vallenar', 'Alto del Carmen', 'Freirina', 'Huasco'],
  'Coquimbo': ['La Serena', 'Coquimbo', 'Andacollo', 'La Higuera', 'Paiguano', 'Vicuña', 'Illapel', 'Canela', 'Los Vilos', 'Salamanca', 'Ovalle', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Río Hurtado'],
  'Valparaíso': ['Valparaíso', 'Casablanca', 'Concón', 'Juan Fernández', 'Puchuncaví', 'Quintero', 'Viña del Mar', 'Isla de Pascua', 'Los Andes', 'Calle Larga', 'Rinconada', 'San Esteban', 'La Ligua', 'Cabildo', 'Papudo', 'Petorca', 'Zapallar', 'Quillota', 'Calera', 'Hijuelas', 'La Cruz', 'Nogales', 'San Antonio', 'Algarrobo', 'Cartagena', 'El Quisco', 'El Tabo', 'Santo Domingo', 'San Felipe', 'Catemu', 'Llaillay', 'Panquehue', 'Putaendo', 'Santa María', 'Quilpué', 'Limache', 'Olmué', 'Villa Alemana'],
  'Metropolitana de Santiago': ['Santiago', 'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura', 'Puente Alto', 'Pirque', 'San José de Maipo', 'Colina', 'Lampa', 'Tiltil', 'San Bernardo', 'Buin', 'Calera de Tango', 'Paine', 'Melipilla', 'Alhué', 'Curacaví', 'María Pinto', 'San Pedro', 'Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor'],
  "O'Higgins": ['Rancagua', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'Las Cabras', 'Machalí', 'Malloa', 'Mostazal', 'Olivar', 'Peumo', 'Pichidegua', 'Quinta de Tilcoco', 'Rengo', 'Requínoa', 'San Vicente', 'Pichilemu', 'La Estrella', 'Litueche', 'Marchihue', 'Navidad', 'Paredones', 'San Fernando', 'Chépica', 'Chimbarongo', 'Lolol', 'Nancagua', 'Palmilla', 'Peralillo', 'Placilla', 'Pumanque', 'Santa Cruz'],
  'Maule': ['Talca', 'Constitución', 'Curepto', 'Empedrado', 'Maule', 'Pelarco', 'Pencahue', 'Río Claro', 'San Clemente', 'San Rafael', 'Cauquenes', 'Chanco', 'Pelluhue', 'Curicó', 'Hualañé', 'Licantén', 'Molina', 'Rauco', 'Romeral', 'Sagrada Familia', 'Teno', 'Vichuquén', 'Linares', 'Colbún', 'Longaví', 'Parral', 'Retiro', 'San Javier', 'Villa Alegre', 'Yerbas Buenas'],
  'Ñuble': ['Chillán', 'Bulnes', 'Chillán Viejo', 'El Carmen', 'Pemuco', 'Pinto', 'Quillón', 'San Ignacio', 'Yungay', 'Cobquecura', 'Coelemu', 'Ninhue', 'Portezuelo', 'Quirihue', 'Ránquil', 'Treguaco', 'Coihueco', 'Ñiquén', 'San Carlos', 'San Fabián', 'San Nicolás'],
  'Biobío': ['Concepción', 'Coronel', 'Chiguayante', 'Florida', 'Hualqui', 'Lota', 'Penco', 'San Pedro de la Paz', 'Santa Juana', 'Talcahuano', 'Tomé', 'Hualpén', 'Lebu', 'Arauco', 'Cañete', 'Contulmo', 'Curanilahue', 'Los Álamos', 'Tirúa', 'Los Ángeles', 'Antuco', 'Cabrero', 'Laja', 'Mulchén', 'Nacimiento', 'Negrete', 'Quilaco', 'Quilleco', 'San Rosendo', 'Santa Bárbara', 'Tucapel', 'Yumbel', 'Alto Biobío'],
  'La Araucanía': ['Temuco', 'Carahue', 'Cunco', 'Curarrehue', 'Freire', 'Galvarino', 'Gorbea', 'Lautaro', 'Loncoche', 'Melipeuco', 'Nueva Imperial', 'Padre las Casas', 'Perquenco', 'Pitrufquén', 'Pucón', 'Saavedra', 'Teodoro Schmidt', 'Toltén', 'Vilcún', 'Villarrica', 'Cholchol', 'Angol', 'Collipulli', 'Curacautín', 'Ercilla', 'Lonquimay', 'Los Sauces', 'Lumaco', 'Purén', 'Renaico', 'Traiguén', 'Victoria'],
  'Los Ríos': ['Valdivia', 'Corral', 'Futrono', 'La Unión', 'Lago Ranco', 'Lanco', 'Los Lagos', 'Máfil', 'Mariquina', 'Paillaco', 'Panguipulli', 'Río Bueno'],
  'Los Lagos': ['Puerto Montt', 'Calbuco', 'Cochamó', 'Fresia', 'Frutillar', 'Los Muermos', 'Llanquihue', 'Maullín', 'Puerto Varas', 'Castro', 'Ancud', 'Chonchi', 'Curaco de Vélez', 'Dalcahue', 'Puqueldón', 'Queilén', 'Quellón', 'Quemchi', 'Quinchao', 'Osorno', 'Puerto Octay', 'Purranque', 'Puyehue', 'Río Negro', 'San Juan de la Costa', 'San Pablo', 'Chaitén', 'Futaleufú', 'Hualaihué', 'Palena'],
  'Aysén': ['Coyhaique', 'Lago Verde', 'Aysén', 'Cisnes', 'Guaitecas', 'Cochrane', "O'Higgins", 'Tortel', 'Chile Chico', 'Río Ibáñez'],
  'Magallanes': ['Punta Arenas', 'Laguna Blanca', 'Río Verde', 'San Gregorio', 'Cabo de Hornos', 'Antártica', 'Porvenir', 'Primavera', 'Timaukel', 'Natales', 'Torres del Paine'],
};

const REGIONES = Object.keys(REGIONES_COMUNAS);

const Register: React.FC = () => {
  const history = useHistory();
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [regionSel, setRegionSel]     = useState('');
  const [comunaSel, setComunaSel]     = useState('');

  const comunas = regionSel ? REGIONES_COMUNAS[regionSel] : [];

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const password        = (data.get('password-input') as string || '').trim();
    const confirmPassword = (data.get('confirmPassword-input') as string || '').trim();

    if (password !== confirmPassword) { alert("Las contraseñas no coinciden"); return; }

    const nuevoUsuario = {
      nombres:   (data.get('nombres-input')   as string || '').trim(),
      apellidoP: (data.get('apellidoP-input') as string || '').trim(),
      apellidoM: (data.get('apellidoM-input') as string || '').trim(),
      rut:       (data.get('rut-input')       as string || '').trim(),
      correo:    (data.get('correo-input')    as string || '').trim(),
      region:    regionSel,
      comuna:    comunaSel,
      password,
      rol: 'ciudadano',
    };

    if (!nuevoUsuario.rut || !nuevoUsuario.correo || !nuevoUsuario.password) {
      alert("RUT, Correo y Contraseña son campos obligatorios."); return;
    }

    try {
      await authService.register(nuevoUsuario);
      alert("¡Registro exitoso! Ahora inicia sesión.");
      history.push('/login');
    } catch (error: any) {
      alert(error.message || "Error al procesar el registro.");
    }
  };

  return (
    <IonPage>
      <IonContent scrollY={true} style={{ '--background': 'transparent' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

          .reg-bg-fixed {
            position: fixed; inset: 0; z-index: 0;
            background-image: url('${ASSETS.fondo}');
            background-size: cover; background-position: center;
          }
          .reg-bg-fixed::after {
            content: ''; position: absolute; inset: 0;
            background: rgba(0,10,30,0.32);
          }
          .reg-wave {
            position: fixed; bottom: 0; left: 0; right: 0;
            height: 220px; background: #003060;
            border-radius: 55% 55% 0 0 / 60px 60px 0 0; z-index: 1;
          }
          .reg-logo-desktop {
            position: fixed; top: 20px; left: 24px;
            z-index: 10; width: 100px; display: block;
          }
          .reg-logo-mobile { display: none; }

          .reg-outer {
            position: relative; z-index: 5;
            display: flex; align-items: center; justify-content: center;
            min-height: 100vh; padding: 40px 20px 240px;
            font-family: 'Inter', sans-serif;
          }
          .reg-card {
            background: #fff; border-radius: 20px;
            padding: 36px 48px 32px; width: 100%; max-width: 860px;
            box-shadow: 0 24px 60px rgba(0,0,0,0.22);
            display: flex; flex-direction: column; align-items: center;
          }
          .reg-avatar { width: 72px; height: 72px; margin-bottom: 10px; }
          .reg-card h1 {
            font-size: 1.75rem; font-weight: 700; color: #003060;
            margin: 0 0 4px; letter-spacing: -0.3px; text-align: center;
            font-family: 'Inter', sans-serif;
          }
          .reg-card p.subtitle {
            font-size: 0.875rem; font-weight: 300; color: #757575;
            margin: 0 0 24px; text-align: center; font-family: 'Inter', sans-serif;
          }

          /* Sobreescribir IonItem para estética custom */
          .reg-card .custom-item {
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
          .reg-card .custom-item ion-input,
          .reg-card .custom-item ion-select {
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

          /* Botón registrarse */
          .btn-register {
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
            margin-top: 24px;
            width: 100%;
            max-width: 340px;
          }
          .btn-register-icon {
            width: 52px; height: 52px;
            filter: brightness(0) invert(1);
            object-fit: cover;
            object-position: 60% 70%;
            margin-right: 8px;
            margin-top: -4px;
            margin-bottom: -4px;
          }

          .login-link-text {
            margin-top: 14px; font-size: 0.85rem;
            font-weight: 300; color: #757575; text-align: center;
            font-family: 'Inter', sans-serif;
          }
          .login-link-text a {
            color: #1a73c8; font-weight: 500; text-decoration: none;
          }
          .login-link-text a:hover { text-decoration: underline; }

          /* Footer desktop */
          .reg-footer-desktop {
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
            .reg-logo-desktop   { display: none; }
            .reg-wave           { display: none; }
            .reg-footer-desktop { display: none; }
            .footer-copy-desktop { display: none; }

            .reg-logo-mobile {
              display: block; width: 110px;
              margin-bottom: 20px; align-self: flex-start;
            }
            .reg-outer {
              align-items: flex-start; min-height: unset; padding: 24px 14px 0;
            }
            .reg-card { padding: 28px 18px; border-radius: 16px; max-width: 100%; }
            .reg-avatar { width: 80px; height: 80px; }
            .reg-card h1 { font-size: 1.9rem; }
            .btn-register { max-width: 100%; }

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
        <div className="reg-bg-fixed" />
        <div className="reg-wave" />

        {/* Logo desktop */}
        <img className="reg-logo-desktop" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />

        <div className="reg-outer">
          <div className="reg-card">

            {/* Logo móvil */}
            <img className="reg-logo-mobile" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />

            <img className="reg-avatar" src={ASSETS.usuarioAzul} alt="Usuario" />
            <h1>Crear cuenta</h1>
            <p className="subtitle">Completa tus datos para registrarte</p>

            <form onSubmit={handleRegister} style={{ width: '100%' }}>

              {/* IonGrid para dos columnas en desktop, una en móvil */}
              <IonGrid style={{ padding: 0 }}>
                <IonRow>

                  {/* ── Columna izquierda ── */}
                  <IonCol size="12" sizeMd="6">

                    <div className="field-group-custom">
                      <label className="field-label-custom">Nombres</label>
                      <IonItem lines="full" className="custom-item">
                        <img slot="start" className="field-icon-left" src={ASSETS.usuarioGris} alt="" />
                        <IonInput name="nombres-input" placeholder="Ingresa tu/s nombre/s" />
                      </IonItem>
                    </div>

                    <div className="field-group-custom">
                      <label className="field-label-custom">Apellido paterno</label>
                      <IonItem lines="full" className="custom-item">
                        <img slot="start" className="field-icon-left" src={ASSETS.usuarioGris} alt="" />
                        <IonInput name="apellidoP-input" placeholder="Ingresa tu apellido paterno" />
                      </IonItem>
                    </div>

                    <div className="field-group-custom">
                      <label className="field-label-custom">Apellido materno</label>
                      <IonItem lines="full" className="custom-item">
                        <img slot="start" className="field-icon-left" src={ASSETS.usuarioGris} alt="" />
                        <IonInput name="apellidoM-input" placeholder="Ingresa tu apellido materno" />
                      </IonItem>
                    </div>

                    <div className="field-group-custom">
                      <label className="field-label-custom">RUT</label>
                      <IonItem lines="full" className="custom-item">
                        <img slot="start" className="field-icon-left" src={ASSETS.usuarioGris} alt="" />
                        <IonInput name="rut-input" placeholder="Ej: 12345678-9" />
                      </IonItem>
                    </div>

                    <div className="field-group-custom">
                      <label className="field-label-custom">Correo electrónico</label>
                      <IonItem lines="full" className="custom-item">
                        <svg slot="start" className="field-icon-left" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="20" height="16" rx="2"/>
                          <polyline points="2,4 12,13 22,4"/>
                        </svg>
                        <IonInput name="correo-input" type="email" placeholder="Ingresa tu correo electrónico" />
                      </IonItem>
                    </div>

                  </IonCol>

                  {/* ── Columna derecha ── */}
                  <IonCol size="12" sizeMd="6">

                    {/* Región */}
                    <div className="field-group-custom">
                      <label className="field-label-custom">Región</label>
                      <IonItem lines="full" className="custom-item">
                        <img slot="start" className="field-icon-left" src={ASSETS.ciudad} alt="" />
                        <IonSelect
                          placeholder="Selecciona tu región"
                          value={regionSel}
                          onIonChange={e => { setRegionSel(e.detail.value); setComunaSel(''); }}
                          interface="popover"
                        >
                          {REGIONES.map(r => (
                            <IonSelectOption key={r} value={r}>{r}</IonSelectOption>
                          ))}
                        </IonSelect>
                      </IonItem>
                    </div>

                    {/* Comuna */}
                    <div className="field-group-custom">
                      <label className="field-label-custom">Comuna</label>
                      <IonItem lines="full" className="custom-item">
                        <img slot="start" className="field-icon-left" src={ASSETS.ubicacionGris} alt="" />
                        <IonSelect
                          placeholder={regionSel ? 'Selecciona tu comuna' : 'Primero selecciona una región'}
                          value={comunaSel}
                          onIonChange={e => setComunaSel(e.detail.value)}
                          disabled={!regionSel}
                          interface="popover"
                        >
                          {comunas.map(c => (
                            <IonSelectOption key={c} value={c}>{c}</IonSelectOption>
                          ))}
                        </IonSelect>
                      </IonItem>
                    </div>

                    {/* Contraseña */}
                    <div className="field-group-custom">
                      <label className="field-label-custom">Contraseña</label>
                      <IonItem lines="full" className="custom-item">
                        <img slot="start" className="field-icon-left" src={ASSETS.candado} alt="" />
                        <IonInput
                          name="password-input"
                          type={showPass ? 'text' : 'password'}
                          placeholder="Crea tu contraseña"
                          autocomplete="new-password"
                        />
                        <IonButton fill="clear" slot="end" onClick={() => setShowPass(!showPass)}>
                          <IonIcon icon={showPass ? eyeOffOutline : eyeOutline} style={{ color: '#757575' }} />
                        </IonButton>
                      </IonItem>
                    </div>

                    {/* Confirmar contraseña */}
                    <div className="field-group-custom">
                      <label className="field-label-custom">Confirmar contraseña</label>
                      <IonItem lines="full" className="custom-item">
                        <img slot="start" className="field-icon-left" src={ASSETS.candado} alt="" />
                        <IonInput
                          name="confirmPassword-input"
                          type={showConfirm ? 'text' : 'password'}
                          placeholder="Confirma tu contraseña"
                          autocomplete="new-password"
                        />
                        <IonButton fill="clear" slot="end" onClick={() => setShowConfirm(!showConfirm)}>
                          <IonIcon icon={showConfirm ? eyeOffOutline : eyeOutline} style={{ color: '#757575' }} />
                        </IonButton>
                      </IonItem>
                    </div>

                  </IonCol>
                </IonRow>
              </IonGrid>

              {/* Botón y link centrados */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <IonButton expand="block" type="submit" className="btn-register">
                  <img className="btn-register-icon" src={ASSETS.crearCuenta} alt="" />
                  Registrarse
                </IonButton>
                <p className="login-link-text">
                  ¿Ya tienes una cuenta?{' '}
                  <a href="/login">Inicia sesión</a>
                </p>
              </div>

            </form>
          </div>
        </div>

        {/* Footer desktop */}
        <div className="reg-footer-desktop">
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

export default Register;
