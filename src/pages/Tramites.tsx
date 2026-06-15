import React, { useState } from 'react';
import {
  IonPage, IonContent, IonButton, IonIcon, useIonAlert
} from "@ionic/react";
import { useHistory } from 'react-router-dom';
import { personOutline } from 'ionicons/icons';
import ConstructionAlert from '../components/ConstructionAlert';

const ASSETS = {
  fondo:      'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/FondoSantoDomigno.png',
  logo:       'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/LogoSantoDomingoAzul.png',
  ubicacion:  'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UbicacionBlanco.png',
  reloj:      'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/RelojBlanco.png',
  phone:      'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PhoneBlanco.png',
  permiso:    'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PermisoCirculacion.png',
  patente:    'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PatenteComercial.png',
  aseo:       'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/Derecho%20de%20Aseo.png',
  transito:   'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/Transito.png',
  talleres:   'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/TalleresDideco.png',
  presencial: 'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/TramitesPresenciales.png',
  dom:        'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/DOM.png',
};

const REQUISITOS: Record<string, string[]> = {
  permiso: [
    'Inscripción en el Registro Civil (en este Servicio se obtienen las placas patentes).',
    'Factura y documentación de Aduana si es una Importación Directa.',
    'Seguro Obligatorio con vigencia al año siguiente de la obtención del Permiso de Circulación.',
    'Certificado de Homologación Individual (C.H.I.) entregado por la Automotora al comprar el vehículo.',
    'Revisión Técnica / Análisis de Gases.',
    'Permiso de circulación anterior.',
    'Si es con cambio de nombre: Padrón, duplicado de inscripción o anotaciones vigentes.',
  ],
  patente: [
    'Pertenecer y estar registrado en el Municipio.',
    'Registrarse como usuario del Portal de Pagos.',
    'Si es primera vez: ingresa tu RUT y selecciona "Regístrese aquí", luego completa el formulario.',
    'Si ya pagaste antes por el Portal: ingresa tu RUT y la clave registrada.',
    'Importante: Las Patentes de Alcoholes NO se pueden cancelar vía Internet. Presentarse en la Municipalidad.',
  ],
  aseo: [
    'Ser propietario o arrendatario del inmueble correspondiente.',
    'Tener el número de rol de la propiedad.',
    'Contar con RUT y datos personales para el proceso de pago.',
    'En caso de exención, presentar documentación que acredite la situación.',
  ],
  transito: [
    'Inscripción original en el Registro Civil.',
    'Cédula de identidad vigente del propietario.',
    'Documentación del vehículo (factura, importación, etc.).',
    'Certificado de revisión técnica al día.',
    'Seguro obligatorio vigente.',
  ],
  talleres: [
    'Ser residente de la comuna de Santo Domingo.',
    'Inscribirse previamente en la Dirección de Desarrollo Comunitario (DIDECO).',
    'Presentar cédula de identidad vigente al momento de la inscripción.',
    'Cupos limitados: se asignan por orden de llegada.',
  ],
  presencial: [
    'Presentarse en horario de atención: Lunes a Viernes 08:45 a 14:00 hrs, Sábado 09:30 a 13:30 hrs.',
    'Llevar cédula de identidad vigente.',
    'Consultar documentos específicos según el trámite a realizar.',
    'Algunos trámites pueden requerir reserva previa de hora.',
  ],
  dom: [
    'Acceder al portal DOM en línea con RUT y clave.',
    'Tener los planos y documentos del proyecto en formato digital.',
    'Contar con el certificado de informaciones previas del predio.',
    'En caso de obra nueva, presentar memoria descriptiva y presupuesto.',
  ],
};

export default function Tramites() {
  const history = useHistory();
  const [presentAlert] = useIonAlert();
  const [requisitosAbiertos, setRequisitosAbiertos] = useState<Record<string, boolean>>({});

  const tramites = [
    { id: 'permiso',    titulo: 'Permiso de circulación',  img: ASSETS.permiso,    especial: true  },
    { id: 'patente',    titulo: 'Patente Comercial',        img: ASSETS.patente,    especial: false },
    { id: 'aseo',       titulo: 'Derecho de Aseo',          img: ASSETS.aseo,       especial: false },
    { id: 'transito',   titulo: 'Tránsito',                 img: ASSETS.transito,   especial: false },
    { id: 'talleres',   titulo: 'Talleres DIDECO',          img: ASSETS.talleres,   especial: true  },
    { id: 'presencial', titulo: 'Trámites presenciales',    img: ASSETS.presencial, especial: true  },
    { id: 'dom',        titulo: 'Dirección de obras (DOM)', img: ASSETS.dom,        especial: false },
  ];

  const handleProtectedClick = () => {
    presentAlert({
      header: 'Acceso Restringido',
      message: 'Esta función es solo para usuarios logueados. Por favor, inicia sesión en la plataforma.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Ir al Login', handler: () => history.push('/login') }
      ]
    });
  };

  const toggleRequisitos = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRequisitosAbiertos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <IonPage>
      <IonContent fullscreen scrollY={false} style={{ '--background': '#f4f6fa' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

          .tr-root * { box-sizing: border-box; }
          .tr-root h1, .tr-root h2, .tr-root p { margin: 0; padding: 0; }

          .tr-root {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            display: flex;
            flex-direction: column;
            font-family: 'Inter', sans-serif;
            background: #f4f6fa;
            overflow-y: auto;
            overflow-x: hidden;
          }

          /* HEADER */
          .tr-header {
            flex-shrink: 0;
            position: relative;
            min-height: 180px;
            background-image: url('${ASSETS.fondo}');
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: flex-end;
          }
          .tr-header::after {
            content: '';
            position: absolute; inset: 0;
            background: rgba(0,10,40,0.52);
          }
          .tr-header-inner {
            position: relative; z-index: 2;
            width: 100%;
            display: flex; align-items: flex-end;
            justify-content: space-between;
            padding: 20px 32px 24px;
            flex-wrap: wrap; gap: 16px;
          }
          .tr-header-left  { display: flex; align-items: flex-end; gap: 20px; }
          .tr-header-logo  { width: 90px; filter: brightness(0) invert(1); display: block; }
          .tr-header-texts h1 {
            font-size: 0.9rem; font-weight: 400;
            color: rgba(255,255,255,0.80); margin-bottom: 2px;
            font-family: 'Inter', sans-serif;
          }
          .tr-header-texts h2 {
            font-size: 1.8rem; font-weight: 800; color: #fff;
            line-height: 1.1; font-family: 'Inter', sans-serif;
          }
          .tr-header-right {
            display: flex; flex-direction: column;
            align-items: flex-end; gap: 8px;
          }
          .btn-sesion {
            --background: #003060; --background-hover: #00428a; --color: #fff;
            --border-radius: 10px;
            --padding-start: 20px; --padding-end: 20px;
            --padding-top: 10px; --padding-bottom: 10px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.9rem; font-weight: 600; margin: 0;
          }
          .tr-link-func {
            font-size: 0.78rem; color: rgba(255,255,255,0.65);
            font-family: 'Inter', sans-serif;
            cursor: pointer; background: none; border: none; padding: 0;
          }
          .tr-link-func:hover { color: #fff; text-decoration: underline; }

          /* CONTENIDO */
          .tr-main-wrap {
            flex: 1;
            display: flex;
            justify-content: center;
            padding: 32px 24px 28px;
          }
          .tr-main { max-width: 1200px; width: 100%; }

          /* Grid 3 columnas */
          .tr-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }

          /* Card — sin padding, imagen llena todo el espacio */
          .tr-card-wrap {
            border-radius: 16px;
            box-shadow: 0 2px 14px rgba(0,0,0,0.07);
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.18s, box-shadow 0.18s;
            display: flex;
            flex-direction: column;
            background: transparent; /* sin fondo blanco visible */
          }
          .tr-card-wrap:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.13);
          }

          /* Imagen llena toda la parte de arriba sin bordes ni fondo */
          .tr-card-img {
            width: 100%;
            display: block;
            /* Imagen PNG ya tiene fondo blanco integrado — se muestra tal cual */
          }

          /* Pestaña requisitos — fondo blanco para coincidir con la base de la imagen */
          .btn-req {
            --background: #f0f4fa;
            --background-hover: #e2eaf5;
            --color: #003060;
            --border-radius: 0;
            --padding-start: 14px; --padding-end: 14px;
            --padding-top: 10px; --padding-bottom: 10px;
            text-transform: none;
            font-family: 'Inter', sans-serif;
            font-size: 0.80rem; font-weight: 600;
            width: 100%; margin: 0;
            border-top: 1px solid #e4eaf4;
            justify-content: flex-start;
          }

          /* Flecha ▶ que rota al abrir — sin IonIcon, solo el carácter ▶ */
          .req-arrow {
            display: inline-block;
            margin-right: 6px;
            transition: transform 0.2s;
            font-size: 0.72rem;
          }
          .req-arrow.abierto {
            transform: rotate(90deg);
          }

          .tr-req-lista {
            background: #f7f9fd;
            padding: 10px 16px 14px;
            border-top: 1px solid #e4eaf4;
          }
          .tr-req-lista ul { padding-left: 16px; list-style: disc; }
          .tr-req-lista li {
            font-size: 0.76rem; color: #444;
            font-family: 'Inter', sans-serif;
            line-height: 1.55; margin-bottom: 3px;
          }

          /* FOOTER */
          .tr-footer {
            flex-shrink: 0;
            background: #003060;
            padding: 28px 36px 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 20px;
          }
          .tr-footer-block {
            display: flex; flex-direction: column; gap: 4px;
            font-family: 'Inter', sans-serif;
          }
          .tr-footer-block strong { color: #fff; font-size: 1rem; font-weight: 700; }
          .tr-footer-block span   { color: rgba(255,255,255,0.75); font-size: 0.88rem; font-weight: 300; }
          .tr-footer-icon-row     { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
          .tr-footer-icon-row img { width: 22px; height: 22px; }
          .tr-footer-divider      { width: 1px; background: rgba(255,255,255,0.20); align-self: stretch; }
          .tr-footer-copy {
            flex-shrink: 0;
            text-align: center;
            color: rgba(255,255,255,0.35);
            font-size: 0.75rem; font-weight: 300;
            padding: 12px 0 10px;
            background: #003060;
            font-family: 'Inter', sans-serif;
          }

          /* Tablet */
          @media (min-width: 601px) and (max-width: 900px) {
            .tr-grid { grid-template-columns: repeat(2, 1fr); }
          }

          /* Móvil */
          @media (max-width: 600px) {
            .tr-header-inner {
              padding: 14px 16px 18px;
              flex-direction: column; align-items: flex-start;
            }
            .tr-header-logo  { width: 70px; }
            .tr-header-texts h2 { font-size: 1.25rem; }
            .tr-header-left  { gap: 10px; align-items: flex-start; }
            .tr-header-right { align-items: flex-start; }
            .tr-main-wrap    { padding: 18px 14px 20px; }
            .tr-grid         { grid-template-columns: 1fr; gap: 14px; }
            .tr-footer       { flex-direction: column; padding: 20px 16px 16px; gap: 16px; }
            .tr-footer-divider { display: none; }
          }
        `}</style>

        <div className="tr-root">

          {/* HEADER */}
          <div className="tr-header">
            <div className="tr-header-inner">
              <div className="tr-header-left">
                <img className="tr-header-logo" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />
                <div className="tr-header-texts">
                  <h1>Bienvenido/a a la plataforma de</h1>
                  <h2>Trámites y servicios en línea</h2>
                </div>
              </div>
              <div className="tr-header-right">
                <IonButton className="btn-sesion" onClick={() => history.push('/login')}>
                  <IonIcon slot="start" icon={personOutline} />
                  Iniciar Sesión
                </IonButton>
                <button className="tr-link-func" onClick={() => history.push('/login-funcionario')}>
                  Acceso funcionario →
                </button>
              </div>
            </div>
          </div>

          {/* CONTENIDO */}
          <div className="tr-main-wrap">
            <div className="tr-main">
              <div className="tr-grid">
                {tramites.map((item) => {
                  const abierto = !!requisitosAbiertos[item.id];
                  const reqs    = REQUISITOS[item.id] ?? [];

                  const CardInner = (
                    <div className="tr-card-wrap">
                      {/* Imagen que llena todo — ya tiene fondo blanco, ícono, título y descripción */}
                      <img
                        className="tr-card-img"
                        src={item.img}
                        alt={item.titulo}
                      />

                      {/* Pestaña con una sola flecha ▶ que rota al abrir */}
                      <IonButton
                        className="btn-req"
                        fill="clear"
                        onClick={e => toggleRequisitos(item.id, e)}
                      >
                        <span className={`req-arrow${abierto ? ' abierto' : ''}`}>▶</span>
                        Requisitos
                      </IonButton>

                      {abierto && reqs.length > 0 && (
                        <div className="tr-req-lista">
                          <ul>
                            {reqs.map((r, i) => <li key={i}>{r}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  );

                  if (item.especial) {
                    return (
                      <div key={item.id} onClick={handleProtectedClick} style={{ cursor: 'pointer' }}>
                        {CardInner}
                      </div>
                    );
                  }
                  return (
                    <ConstructionAlert key={item.id}>
                      {CardInner}
                    </ConstructionAlert>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="tr-footer">
            <div className="tr-footer-block">
              <div className="tr-footer-icon-row">
                <img src={ASSETS.ubicacion} alt="" />
                <strong>Dirección</strong>
              </div>
              <span>Avenida Santa Teresa N°1.</span>
              <span>Santo Domingo, Chile</span>
            </div>
            <div className="tr-footer-divider" />
            <div className="tr-footer-block">
              <div className="tr-footer-icon-row">
                <img src={ASSETS.phone} alt="" />
                <strong>Emergencias 24 horas:</strong>
              </div>
              <span>+563 2238 1603 • +563 5220 4200</span>
              <span>Seguridad: 1458 • contacto@santodomingo.cl</span>
            </div>
            <div className="tr-footer-divider" />
            <div className="tr-footer-block">
              <div className="tr-footer-icon-row">
                <img src={ASSETS.reloj} alt="" />
                <strong>Horario</strong>
              </div>
              <span>Lunes a Viernes: 08:45am a 14:00 pm</span>
              <span>Sábado: 09:30am a 13:30pm</span>
            </div>
          </div>
          <div className="tr-footer-copy">
            ©2026 Municipalidad de Santo Domingo &nbsp;•&nbsp; Política de Privacidad
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
}
