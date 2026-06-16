import React, { useState } from 'react';
import {
  IonPage, IonContent, IonButton, IonIcon,
  IonItem, IonInput, IonLabel, IonSpinner, useIonToast
} from "@ionic/react";
import { useHistory } from 'react-router-dom';
import {
  carOutline, cloudUploadOutline, checkmarkCircleOutline
} from 'ionicons/icons';

const ASSETS = {
  fondo:     'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/FondoSantoDomigno.png',
  logo:      'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/LogoSantoDomingoAzul.png',
  ubicacion: 'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/UbicacionBlanco.png',
  reloj:     'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/RelojBlanco.png',
  phone:     'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PhoneBlanco.png',
};

const API_URL = 'http://localhost:3000/api';

export default function PermisoCirculacionForm() {
  const history = useHistory();
  const [presentToast] = useIonToast();

  const [patente, setPatente]   = useState('');
  const [marca, setMarca]       = useState('');
  const [modelo, setModelo]     = useState('');
  const [anio, setAnio]         = useState('');
  const [archivo, setArchivo]   = useState<File | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivo(e.target.files[0]);
    }
  };

  // ── Lógica original intacta ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patente || !marca || !modelo || !anio || !archivo) {
      presentToast({ message: 'Por favor, completa todos los campos y adjunta tu documento.', duration: 3000, color: 'warning' });
      return;
    }
    setCargando(true);
    const sessionData = localStorage.getItem('user_session');
    if (!sessionData) {
      presentToast({ message: 'Error: No se encontró una sesión activa. Vuelve a iniciar sesión.', duration: 4000, color: 'danger' });
      setCargando(false);
      return;
    }
    const usuarioLogeado = JSON.parse(sessionData);
    const datosReales = Array.isArray(usuarioLogeado) ? usuarioLogeado[0] : usuarioLogeado;
    const formData = new FormData();
    formData.append('usuario_id', String(datosReales.id));
    formData.append('tramite_id', '1');
    formData.append('patente', patente);
    formData.append('marca', marca);
    formData.append('modelo', modelo);
    formData.append('anio', anio);
    formData.append('documento', archivo);
    try {
      const respuesta = await fetch(`${API_URL}/tramites/permiso-circulacion`, { method: 'POST', body: formData });
      const data = await respuesta.json();
      if (data.ok) {
        presentToast({ message: '¡Trámite enviado con éxito! Su solicitud está en revisión.', duration: 4000, color: 'success' });
        setTimeout(() => history.push('/tramites-user'), 2000);
      } else {
        throw new Error(data.error || 'Error al enviar');
      }
    } catch (error) {
      presentToast({ message: 'Hubo un error al conectar con el servidor.', duration: 3000, color: 'danger' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': '#f4f6fa' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          .pf-root * { box-sizing: border-box; }
          .pf-root h1, .pf-root h2, .pf-root h3, .pf-root p { margin: 0; padding: 0; }

          .pf-root {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            display: flex; flex-direction: column;
            font-family: 'Inter', sans-serif;
            background: #f4f6fa;
            overflow-y: auto; overflow-x: hidden;
          }

          /* HEADER */
          .pf-header {
            flex-shrink: 0; position: relative; min-height: 180px;
            background-image: url('${ASSETS.fondo}');
            background-size: cover; background-position: center;
            display: flex; align-items: flex-end;
          }
          .pf-header::after {
            content: ''; position: absolute; inset: 0;
            background: rgba(0,10,40,0.52);
          }
          .pf-header-inner {
            position: relative; z-index: 2; width: 100%;
            display: flex; align-items: flex-end;
            justify-content: space-between;
            padding: 20px 32px 24px; flex-wrap: wrap; gap: 16px;
          }
          .pf-header-left { display: flex; align-items: flex-end; gap: 20px; }
          .pf-header-logo { width: 90px; filter: brightness(0) invert(1); display: block; }
          .pf-header-texts h1 {
            font-size: 0.9rem; font-weight: 400;
            color: rgba(255,255,255,0.80); margin-bottom: 2px;
            font-family: 'Inter', sans-serif;
          }
          .pf-header-texts h2 {
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
          .pf-main-wrap {
            flex: 1; display: flex; justify-content: center;
            padding: 32px 24px 28px;
          }
          .pf-main { max-width: 640px; width: 100%; }

          /* Card */
          .pf-card {
            background: #fff; border: 1px solid #e0e7ef;
            border-radius: 16px; overflow: hidden;
            box-shadow: 0 2px 14px rgba(0,0,0,0.06);
          }
          .pf-card-header {
            background: #003060; padding: 20px 24px;
            display: flex; align-items: center; gap: 12px;
          }
          .pf-card-header ion-icon { font-size: 1.4rem; color: rgba(255,255,255,0.80); }
          .pf-card-header h3 {
            font-size: 1.15rem; font-weight: 700; color: #fff;
            font-family: 'Inter', sans-serif; margin: 0;
          }
          .pf-card-header p {
            font-size: 0.78rem; color: rgba(255,255,255,0.65);
            font-family: 'Inter', sans-serif; font-weight: 300; margin: 2px 0 0;
          }

          .pf-card-body { padding: 28px 24px; }

          /* Grid 2 columnas */
          .pf-grid {
            display: grid; grid-template-columns: 1fr 1fr;
            gap: 14px; margin-bottom: 14px;
          }
          .pf-grid-full { margin-bottom: 14px; }

          /* IonItem estilizado */
          .pf-item {
            --background: #f7f9fc;
            --border-color: #d0d8e4; --border-radius: 10px;
            --border-width: 1.5px; --border-style: solid;
            --padding-start: 12px; --inner-padding-end: 12px;
            --min-height: 56px;
            --highlight-color-focused: #003060;
            border-radius: 10px;
          }
          .pf-item ion-label {
            font-size: 0.76rem !important; font-weight: 700 !important;
            color: #003060 !important; font-family: 'Inter', sans-serif !important;
          }
          .pf-item ion-input {
            --color: #1a1a2e; --placeholder-color: #b0b8c4;
            font-family: 'Inter', sans-serif; font-size: 0.92rem;
          }

          /* Zona archivo */
          .pf-upload-box {
            background: #f7f9fc; border: 1.5px dashed #c5d8f8;
            border-radius: 12px; padding: 20px;
            display: flex; flex-direction: column; align-items: center;
            gap: 10px; cursor: pointer; transition: border-color 0.2s;
            margin-bottom: 24px; text-align: center;
          }
          .pf-upload-box:hover { border-color: #003060; }
          .pf-upload-box ion-icon { font-size: 2rem; color: #003060; opacity: 0.6; }
          .pf-upload-titulo {
            font-size: 0.85rem; font-weight: 700; color: #003060;
            font-family: 'Inter', sans-serif; margin: 0;
          }
          .pf-upload-subtitulo {
            font-size: 0.76rem; color: #9ca3af;
            font-family: 'Inter', sans-serif; margin: 0;
          }
          .pf-archivo-nombre {
            font-size: 0.80rem; color: #27ae60; font-weight: 600;
            font-family: 'Inter', sans-serif;
            display: flex; align-items: center; gap: 6px;
          }
          .pf-archivo-nombre ion-icon { font-size: 1rem; }
          .pf-file-input { display: none; }

          /* Botón enviar */
          .btn-enviar {
            --background: #1a7a3e; --background-hover: #156332; --color: #fff;
            --border-radius: 12px; --padding-top: 16px; --padding-bottom: 16px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 1rem; font-weight: 700; width: 100%; margin: 0;
          }
          .btn-enviar[disabled] { opacity: 0.6; }

          /* FOOTER */
          .pf-footer {
            flex-shrink: 0; background: #003060;
            padding: 28px 36px 20px;
            display: flex; justify-content: space-between;
            align-items: flex-start; flex-wrap: wrap; gap: 20px;
          }
          .pf-footer-block { display: flex; flex-direction: column; gap: 4px; font-family: 'Inter', sans-serif; }
          .pf-footer-block strong { color: #fff; font-size: 1rem; font-weight: 700; }
          .pf-footer-block span   { color: rgba(255,255,255,0.75); font-size: 0.88rem; font-weight: 300; }
          .pf-footer-icon-row     { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
          .pf-footer-icon-row img { width: 22px; height: 22px; }
          .pf-footer-divider      { width: 1px; background: rgba(255,255,255,0.20); align-self: stretch; }
          .pf-footer-copy {
            flex-shrink: 0; text-align: center;
            color: rgba(255,255,255,0.35); font-size: 0.75rem; font-weight: 300;
            padding: 12px 0 10px; background: #003060; font-family: 'Inter', sans-serif;
          }

          /* MÓVIL */
          @media (max-width: 600px) {
            .pf-header-inner { padding: 14px 16px 18px; flex-direction: column; align-items: flex-start; }
            .pf-header-logo  { width: 70px; }
            .pf-header-texts h2 { font-size: 1.3rem; }
            .pf-header-left  { gap: 10px; align-items: flex-start; }
            .pf-main-wrap    { padding: 18px 14px 20px; }
            .pf-grid         { grid-template-columns: 1fr; }
            .pf-card-body    { padding: 20px 16px; }
            .pf-footer       { flex-direction: column; padding: 20px 16px 16px; gap: 16px; }
            .pf-footer-divider { display: none; }
          }
        `}</style>

        <div className="pf-root">

          {/* HEADER */}
          <div className="pf-header">
            <div className="pf-header-inner">
              <div className="pf-header-left">
                <img className="pf-header-logo" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />
                <div className="pf-header-texts">
                  <h1>Formulario de trámite</h1>
                  <h2>Renovación de Circulación</h2>
                </div>
              </div>
              <IonButton className="btn-volver" onClick={() => history.push('/tramite/permiso-circulacion/info')}>
                ← Volver
              </IonButton>
            </div>
          </div>

          {/* CONTENIDO */}
          <div className="pf-main-wrap">
            <div className="pf-main">
              <div className="pf-card">

                {/* Header card */}
                <div className="pf-card-header">
                  <div>
                    <IonIcon icon={carOutline} />
                  </div>
                  <div>
                    <h3>Datos del Vehículo</h3>
                    <p>Completa todos los campos para continuar</p>
                  </div>
                </div>

                <div className="pf-card-body">
                  <form onSubmit={handleSubmit}>

                    {/* Grid patente + año */}
                    <div className="pf-grid">
                      <IonItem lines="full" className="pf-item">
                        <IonLabel position="stacked">Patente</IonLabel>
                        <IonInput
                          value={patente}
                          onIonChange={e => setPatente(e.detail.value!)}
                          placeholder="Ej: AB-CD-12"
                        />
                      </IonItem>
                      <IonItem lines="full" className="pf-item">
                        <IonLabel position="stacked">Año de Fabricación</IonLabel>
                        <IonInput
                          type="number"
                          value={anio}
                          onIonChange={e => setAnio(e.detail.value!)}
                          placeholder="Ej: 2024"
                        />
                      </IonItem>
                    </div>

                    {/* Grid marca + modelo */}
                    <div className="pf-grid">
                      <IonItem lines="full" className="pf-item">
                        <IonLabel position="stacked">Marca</IonLabel>
                        <IonInput
                          value={marca}
                          onIonChange={e => setMarca(e.detail.value!)}
                          placeholder="Ej: Toyota"
                        />
                      </IonItem>
                      <IonItem lines="full" className="pf-item">
                        <IonLabel position="stacked">Modelo</IonLabel>
                        <IonInput
                          value={modelo}
                          onIonChange={e => setModelo(e.detail.value!)}
                          placeholder="Ej: Yaris"
                        />
                      </IonItem>
                    </div>

                    {/* Zona de archivo */}
                    <input
                      id="pf-file"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="pf-file-input"
                    />
                    <label htmlFor="pf-file" className="pf-upload-box">
                      {archivo ? (
                        <p className="pf-archivo-nombre">
                          <IonIcon icon={checkmarkCircleOutline} />
                          {archivo.name}
                        </p>
                      ) : (
                        <>
                          <IonIcon icon={cloudUploadOutline} />
                          <p className="pf-upload-titulo">Adjuntar Revisión Técnica</p>
                          <p className="pf-upload-subtitulo">PDF o imagen — haz clic para seleccionar</p>
                        </>
                      )}
                    </label>

                    {/* Botón enviar */}
                    <IonButton
                      expand="block"
                      type="submit"
                      className="btn-enviar"
                      disabled={cargando}
                    >
                      {cargando
                        ? <IonSpinner name="crescent" />
                        : 'Enviar Trámite'
                      }
                    </IonButton>

                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="pf-footer">
            <div className="pf-footer-block">
              <div className="pf-footer-icon-row">
                <img src={ASSETS.ubicacion} alt="" /><strong>Dirección</strong>
              </div>
              <span>Avenida Santa Teresa N°1.</span>
              <span>Santo Domingo, Chile</span>
            </div>
            <div className="pf-footer-divider" />
            <div className="pf-footer-block">
              <div className="pf-footer-icon-row">
                <img src={ASSETS.phone} alt="" /><strong>Emergencias 24 horas:</strong>
              </div>
              <span>+563 2238 1603 • +563 5220 4200</span>
              <span>Seguridad: 1458 • contacto@santodomingo.cl</span>
            </div>
            <div className="pf-footer-divider" />
            <div className="pf-footer-block">
              <div className="pf-footer-icon-row">
                <img src={ASSETS.reloj} alt="" /><strong>Horario</strong>
              </div>
              <span>Lunes a Viernes: 08:45am a 14:00 pm</span>
              <span>Sábado: 09:30am a 13:30pm</span>
            </div>
          </div>
          <div className="pf-footer-copy">
            ©2026 Municipalidad de Santo Domingo &nbsp;•&nbsp; Política de Privacidad
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
}
