import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonButton, IonIcon,
  useIonToast, IonSelect, IonSelectOption, IonItem, IonInput, IonLabel
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  printOutline, peopleOutline, carOutline
} from 'ionicons/icons';
import { authService } from '../services/authService';

const ASSETS = {
  fondo:  'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/FondoSantoDomigno.png',
  logo:   'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/LogoSantoDomingoAzul.png',
  puerta: 'https://raw.githubusercontent.com/MrD1ego/AssetsProyectoMunicipalidadSD/main/Ingenier%C3%ADa%20Web/InicioSesion/PuertaSalir.png',
};

export default function ReportesAdmin() {
  const history = useHistory();
  const [presentToast] = useIonToast();
  const [nombreAdmin, setNombreAdmin] = useState('');

  const [tipoReporte, setTipoReporte] = useState<'dideco' | 'transito'>('dideco');

  const [talleres, setTalleres]                   = useState<any[]>([]);
  const [tallerSeleccionado, setTallerSeleccionado] = useState<string>('');
  const [resultadosDideco, setResultadosDideco]   = useState<any[]>([]);

  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('');
  const [resultadosTransito, setResultadosTransito] = useState<any[]>([]);

  // ── Lógica original intacta ──
  useEffect(() => {
    const sessionData = localStorage.getItem('user_session');
    if (!sessionData) { history.push('/login-funcionario'); return; }
    const userObj = JSON.parse(sessionData);
    const user = Array.isArray(userObj) ? userObj[0] : userObj;
    if (user.rol !== 'funcionario') { history.replace('/tramites-logueado'); return; }
    setNombreAdmin(`${user.nombres} ${user.apellidoP}`);
    cargarListaTalleres();
  }, [history]);

  const cargarListaTalleres = async () => {
    try {
      const response = await fetch('https://tramitessantodomingo-production-5cb4.up.railway.app/api/admin/reportes/talleres');
      const data = await response.json();
      if (data.ok) setTalleres(data.talleres);
    } catch (error) { console.error(error); }
  };

  const generarReporteDideco = async (idTaller: string) => {
    try {
      const response = await fetch(`https://tramitessantodomingo-production-5cb4.up.railway.app/api/admin/reportes/taller/${idTaller}`);
      const data = await response.json();
      if (data.ok) setResultadosDideco(data.inscritos);
    } catch (error) {
      presentToast({ message: 'Error al generar reporte', duration: 2000, color: 'danger' });
    }
  };

  const generarReporteTransito = async (fecha: string) => {
    try {
      const response = await fetch(`https://tramitessantodomingo-production-5cb4.up.railway.app/api/admin/reportes/transito/${fecha}`);
      const data = await response.json();
      if (data.ok) setResultadosTransito(data.agendas);
    } catch (error) {
      presentToast({ message: 'Error al generar reporte', duration: 2000, color: 'danger' });
    }
  };

  const handleCerrarSesion = () => { authService.logout(); history.push('/login-funcionario'); };
  const imprimirReporte = () => window.print();

  const nombreTallerActual = talleres.find(t => t.id.toString() === tallerSeleccionado?.toString())?.nombre || '';

  const hayResultados = tipoReporte === 'dideco'
    ? resultadosDideco.length > 0
    : resultadosTransito.length > 0;

  const haySeleccion = tipoReporte === 'dideco' ? !!tallerSeleccionado : !!fechaSeleccionada;

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': '#f0f2f5' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          * { box-sizing: border-box; }

          @media print {
            .no-print { display: none !important; }
            .rp-sidebar { display: none !important; }
            .rp-header  { display: none !important; }
            .print-area { padding: 20px; background: white; }
            body, ion-content { background: white !important; --background: white !important; }
          }

          .rp-root {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            display: flex; flex-direction: row;
            font-family: 'Inter', sans-serif;
            background: #f0f2f5; overflow: hidden;
          }

          /* SIDEBAR */
          .rp-sidebar {
            width: 200px; flex-shrink: 0; background: #002050;
            display: flex; flex-direction: column;
            align-items: center; padding: 28px 16px 24px; height: 100%;
          }
          .rp-sidebar-logo { width: 120px; filter: brightness(0) invert(1); }

          /* COLUMNA DERECHA */
          .rp-right { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow-y: auto; }

          /* HEADER */
          .rp-header {
            flex-shrink: 0; position: relative; min-height: 130px;
            background-image: url('${ASSETS.fondo}');
            background-size: cover; background-position: center;
            display: flex; align-items: center;
            padding: 20px 32px; justify-content: space-between;
            gap: 16px; flex-wrap: wrap;
          }
          .rp-header::after { content: ''; position: absolute; inset: 0; background: rgba(0,10,40,0.58); }
          .rp-header-texts { position: relative; z-index: 2; }
          .rp-header-texts h1 {
            font-size: 2.2rem; font-weight: 800; color: #fff;
            margin: 0 0 4px; font-family: 'Inter', sans-serif; line-height: 1;
          }
          .rp-header-texts .bienvenido {
            font-size: 0.82rem; color: rgba(255,255,255,0.80); margin: 0 0 1px;
            font-family: 'Inter', sans-serif;
          }
          .rp-header-texts .bienvenido strong { font-weight: 600; font-style: italic; color: #fff; }
          .rp-header-texts .subtitulo {
            font-size: 0.76rem; font-weight: 600;
            color: rgba(255,255,255,0.65); margin: 0; font-family: 'Inter', sans-serif;
          }
          .rp-header-btns {
            position: relative; z-index: 2;
            display: flex; flex-direction: column; gap: 8px; align-items: flex-end;
          }
          .btn-cerrar {
            --background: #003060; --background-hover: #00428a; --color: #fff;
            --border-radius: 8px; --padding-start: 14px; --padding-end: 14px;
            --padding-top: 8px; --padding-bottom: 8px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.82rem; font-weight: 600; margin: 0;
          }
          .btn-volver {
            --background: #003060; --background-hover: #00428a; --color: #fff;
            --border-radius: 8px; --padding-start: 14px; --padding-end: 14px;
            --padding-top: 8px; --padding-bottom: 8px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.88rem; font-weight: 700; margin: 0; min-width: 130px;
          }
          .rp-btn-icon { width: 16px; height: 16px; filter: brightness(0) invert(1); margin-right: 6px; }

          /* CONTENIDO */
          .rp-main { padding: 28px 40px; }
          .rp-page-titulo {
            font-size: 1.9rem; font-weight: 800; color: #003060;
            margin: 0 0 4px; font-family: 'Inter', sans-serif;
          }
          .rp-page-subtitulo {
            font-size: 0.85rem; color: #6b7280; margin: 0 0 24px;
            font-family: 'Inter', sans-serif;
          }

          /* Panel */
          .rp-panel {
            background: #fff; border: 1px solid #e0e7ef;
            border-radius: 16px; overflow: hidden;
          }

          /* Tabs */
          .rp-tabs-bar {
            display: flex; align-items: center; justify-content: space-between;
            padding: 16px 20px; border-bottom: 1px solid #f0f2f5;
            flex-wrap: wrap; gap: 12px;
          }
          .rp-tabs { display: flex; gap: 4px; }
          .btn-tab {
            --background: transparent; --background-hover: rgba(0,48,96,0.06);
            --border-radius: 6px; --padding-start: 16px; --padding-end: 16px;
            --padding-top: 8px; --padding-bottom: 8px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.88rem; font-weight: 500; margin: 0; --color: #6b7280;
          }
          .btn-tab.activa { --color: #003060; font-weight: 700; border-bottom: 2px solid #003060; }

          .btn-imprimir {
            --background: transparent; --background-hover: rgba(0,48,96,0.06);
            --color: #6b7280;
            --border-color: #d0d8e4; --border-width: 1px; --border-style: solid;
            --border-radius: 8px; --padding-start: 16px; --padding-end: 16px;
            --padding-top: 8px; --padding-bottom: 8px;
            text-transform: none; font-family: 'Inter', sans-serif;
            font-size: 0.82rem; font-weight: 500; margin: 0;
          }

          /* Zona selector */
          .rp-selector-area {
            padding: 20px 24px;
            border-bottom: 1px solid #f0f2f5;
            background: #f7f9fc;
          }
          .rp-selector-label {
            font-size: 0.75rem; font-weight: 700; color: rgba(0,48,96,0.55);
            text-transform: uppercase; letter-spacing: 0.8px;
            margin: 0 0 8px; font-family: 'Inter', sans-serif;
          }
          .rp-select-item {
            --background: #fff; --border-color: #d0d8e4;
            --border-radius: 10px; --border-style: solid; --border-width: 1.5px;
            --padding-start: 12px; --inner-padding-end: 12px;
            --min-height: 46px; border-radius: 10px;
            --highlight-color-focused: #003060;
            max-width: 420px;
          }
          .rp-select-item ion-select,
          .rp-select-item ion-input {
            --color: #003060; font-family: 'Inter', sans-serif; font-size: 0.92rem;
          }

          /* Área de resultados */
          .rp-results { padding: 24px; }

          /* Cabecera del reporte */
          .rp-reporte-header {
            text-align: center; margin-bottom: 24px;
            padding-bottom: 16px; border-bottom: 2px solid #003060;
          }
          .rp-reporte-header h2 {
            font-size: 0.8rem; font-weight: 700; color: rgba(0,48,96,0.50);
            text-transform: uppercase; letter-spacing: 1px;
            margin: 0 0 4px; font-family: 'Inter', sans-serif;
          }
          .rp-reporte-header h3 {
            font-size: 1.3rem; font-weight: 700; color: #003060;
            margin: 0; font-family: 'Inter', sans-serif;
          }

          /* Tabla */
          .rp-tabla { width: 100%; border-collapse: collapse; }
          .rp-tabla thead tr {
            background: #f0f4ff;
            border-bottom: 2px solid #c5d8f8;
          }
          .rp-tabla thead th {
            padding: 12px 16px; text-align: left;
            font-size: 0.78rem; font-weight: 700; color: #003060;
            font-family: 'Inter', sans-serif; text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .rp-tabla tbody tr {
            border-bottom: 1px solid #f0f2f5;
            transition: background 0.12s;
          }
          .rp-tabla tbody tr:last-child { border-bottom: none; }
          .rp-tabla tbody tr:hover { background: #f7f9ff; }
          .rp-tabla tbody td {
            padding: 12px 16px; font-size: 0.85rem;
            color: #374151; font-family: 'Inter', sans-serif;
          }
          .rp-hora-badge {
            display: inline-block; padding: 3px 10px;
            border-radius: 6px; background: #eef4ff;
            color: #1a73c8; font-weight: 700;
            font-family: 'Inter', sans-serif; font-size: 0.82rem;
          }
          .rp-total {
            margin-top: 16px; padding-top: 12px;
            border-top: 1px solid #e0e7ef;
            font-size: 0.82rem; font-weight: 600; color: #6b7280;
            font-family: 'Inter', sans-serif; text-align: right;
          }

          /* Vacío */
          .rp-vacio {
            padding: 48px 20px; text-align: center;
            color: #6b7280; font-family: 'Inter', sans-serif;
          }
          .rp-vacio h3 { font-size: 1rem; font-weight: 600; margin: 0 0 6px; color: #374151; }
          .rp-vacio p  { font-size: 0.82rem; margin: 0; }

          /* Estado vacío inicial */
          .rp-placeholder {
            padding: 56px 20px; text-align: center;
            font-family: 'Inter', sans-serif;
          }
          .rp-placeholder-icon {
            font-size: 2.8rem; color: #d0d8e4; margin-bottom: 12px;
          }
          .rp-placeholder h3 {
            font-size: 1rem; font-weight: 600; color: #9ca3af; margin: 0 0 4px;
          }
          .rp-placeholder p { font-size: 0.82rem; color: #b0b8c4; margin: 0; }

          /* MÓVIL */
          @media (max-width: 600px) {
            .rp-root { flex-direction: column; overflow-y: auto; }
            .rp-sidebar { display: none; }
            .rp-right { overflow-y: unset; }
            .rp-header { min-height: 110px; padding: 14px 16px; }
            .rp-header-texts h1 { font-size: 1.5rem; }
            .rp-main { padding: 16px 12px; }
            .rp-tabs-bar { flex-direction: column; align-items: flex-start; }
          }
        `}</style>

        <div className="rp-root">

          {/* SIDEBAR */}
          <div className="rp-sidebar">
            <img className="rp-sidebar-logo" src={ASSETS.logo} alt="Municipalidad de Santo Domingo" />
          </div>

          {/* COLUMNA DERECHA */}
          <div className="rp-right">

            {/* HEADER */}
            <div className="rp-header no-print">
              <div className="rp-header-texts">
                <h1>Administrador</h1>
                <p className="bienvenido">Bienvenido, <strong>{nombreAdmin || 'Cargando...'}</strong></p>
                <p className="subtitulo">Gestiona y administra los trámites y servicios municipales</p>
              </div>
              <div className="rp-header-btns">
                <IonButton className="btn-cerrar" onClick={handleCerrarSesion}>
                  <img className="rp-btn-icon" src={ASSETS.puerta} alt="" />
                  Cerrar sesión
                </IonButton>
                <IonButton className="btn-volver" onClick={() => history.push('/admin-dashboard')}>
                  ← Volver
                </IonButton>
              </div>
            </div>

            {/* CONTENIDO */}
            <div className="rp-main">
              <p className="rp-page-titulo no-print">Generador de reportes</p>
              <p className="rp-page-subtitulo no-print">
                Selecciona el tipo de reporte y los parámetros para visualizar y exportar los datos
              </p>

              <div className="rp-panel">

                {/* Tabs + botón imprimir */}
                <div className="rp-tabs-bar no-print">
                  <div className="rp-tabs">
                    <IonButton
                      className={`btn-tab${tipoReporte === 'dideco' ? ' activa' : ''}`}
                      fill="clear"
                      onClick={() => { setTipoReporte('dideco'); setResultadosTransito([]); }}
                    >
                      <IonIcon slot="start" icon={peopleOutline} />
                      Talleres DIDECO
                    </IonButton>
                    <IonButton
                      className={`btn-tab${tipoReporte === 'transito' ? ' activa' : ''}`}
                      fill="clear"
                      onClick={() => { setTipoReporte('transito'); setResultadosDideco([]); }}
                    >
                      <IonIcon slot="start" icon={carOutline} />
                      Tránsito
                    </IonButton>
                  </div>

                  <IonButton className="btn-imprimir" fill="outline" onClick={imprimirReporte}>
                    <IonIcon slot="start" icon={printOutline} />
                    Imprimir / Guardar PDF
                  </IonButton>
                </div>

                {/* Selector */}
                <div className="rp-selector-area no-print">
                  {tipoReporte === 'dideco' ? (
                    <>
                      <p className="rp-selector-label">Seleccionar taller</p>
                      <IonItem lines="none" className="rp-select-item">
                        <IonSelect
                          value={tallerSeleccionado}
                          placeholder="Elige un taller"
                          interface="popover"
                          onIonChange={e => {
                            const valor = e.detail.value;
                            setTallerSeleccionado(valor);
                            if (valor) generarReporteDideco(valor);
                          }}
                        >
                          {talleres.map(t => (
                            <IonSelectOption key={t.id} value={t.id}>{t.nombre}</IonSelectOption>
                          ))}
                        </IonSelect>
                      </IonItem>
                    </>
                  ) : (
                    <>
                      <p className="rp-selector-label">Fecha de agendamiento</p>
                      <IonItem lines="none" className="rp-select-item">
                        <IonInput
                          type="date"
                          value={fechaSeleccionada}
                          onIonChange={e => {
                            const valor = e.detail.value!;
                            setFechaSeleccionada(valor);
                            if (valor) generarReporteTransito(valor);
                          }}
                        />
                      </IonItem>
                    </>
                  )}
                </div>

                {/* Resultados / placeholders */}
                {!haySeleccion ? (
                  <div className="rp-placeholder">
                    <div className="rp-placeholder-icon">
                      <IonIcon icon={tipoReporte === 'dideco' ? peopleOutline : carOutline} />
                    </div>
                    <h3>
                      {tipoReporte === 'dideco'
                        ? 'Selecciona un taller para ver los inscritos'
                        : 'Selecciona una fecha para ver la agenda'}
                    </h3>
                    <p>Los resultados aparecerán aquí automáticamente</p>
                  </div>
                ) : !hayResultados ? (
                  <div className="rp-vacio">
                    <h3>No hay registros</h3>
                    <p>
                      {tipoReporte === 'dideco'
                        ? 'No hay inscritos en el taller seleccionado.'
                        : 'No hay agendamientos para la fecha seleccionada.'}
                    </p>
                  </div>
                ) : (
                  <div className="rp-results print-area">

                    {/* Cabecera reporte */}
                    <div className="rp-reporte-header">
                      <h2>Municipalidad de Santo Domingo</h2>
                      <h3>
                        {tipoReporte === 'dideco'
                          ? `Reporte de inscritos — ${nombreTallerActual}`
                          : `Agenda Tránsito — ${new Date(fechaSeleccionada + 'T00:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}`
                        }
                      </h3>
                    </div>

                    {/* Tabla DIDECO */}
                    {tipoReporte === 'dideco' && (
                      <>
                        <table className="rp-tabla">
                          <thead>
                            <tr>
                              <th>RUT</th>
                              <th>Nombre Completo</th>
                              <th>Correo</th>
                            </tr>
                          </thead>
                          <tbody>
                            {resultadosDideco.map((u, i) => (
                              <tr key={i}>
                                <td>{u.rut}</td>
                                <td>{u.nombres} {u.apellido_p} {u.apellido_m}</td>
                                <td>{u.correo}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <p className="rp-total">Total inscritos: {resultadosDideco.length}</p>
                      </>
                    )}

                    {/* Tabla Tránsito */}
                    {tipoReporte === 'transito' && (
                      <>
                        <table className="rp-tabla">
                          <thead>
                            <tr>
                              <th>Hora</th>
                              <th>RUT</th>
                              <th>Nombre Completo</th>
                            </tr>
                          </thead>
                          <tbody>
                            {resultadosTransito.map((a, i) => (
                              <tr key={i}>
                                <td><span className="rp-hora-badge">{a.hora_reserva}</span></td>
                                <td>{a.rut}</td>
                                <td>{a.nombres} {a.apellido_p} {a.apellido_m}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <p className="rp-total">Total agendamientos: {resultadosTransito.length}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
