import React, { useState, useEffect } from 'react';
import { 
  IonPage, IonContent, IonCard, IonCardContent, IonButton, IonIcon, 
  useIonToast, IonSegment, IonSegmentButton, IonLabel, IonSelect, IonSelectOption, IonInput, IonItem
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { printOutline, peopleOutline, carOutline, searchOutline } from 'ionicons/icons';
import HeaderBanner from '../components/HeaderBanner';

export default function ReportesAdmin() {
  const history = useHistory();
  const [presentToast] = useIonToast();
  
  const [tipoReporte, setTipoReporte] = useState<'dideco' | 'transito'>('dideco');
  
  // Estados para DIDECO
  const [talleres, setTalleres] = useState<any[]>([]);
  const [tallerSeleccionado, setTallerSeleccionado] = useState<string>('');
  const [resultadosDideco, setResultadosDideco] = useState<any[]>([]);

  // Estados para Tránsito
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('');
  const [resultadosTransito, setResultadosTransito] = useState<any[]>([]);

  // 🔒 CANDADO DE SEGURIDAD
  useEffect(() => {
    const verificarPermisosAdmin = () => {
      const sessionData = localStorage.getItem('user_session');
      if (!sessionData) {
        history.push('/login-funcionario');
        return;
      }
      const userObj = JSON.parse(sessionData);
      const user = Array.isArray(userObj) ? userObj[0] : userObj;
      if (user.rol !== 'funcionario') {
        history.replace('/tramites-logueado');
      }
    };
    verificarPermisosAdmin();
    cargarListaTalleres();
  }, [history]);

  const cargarListaTalleres = async () => {
    try {
      const response = await fetch('https://tramitessantodomingo-production-5cb4.up.railway.app/api/admin/reportes/talleres');
      const data = await response.json();
      if (data.ok) setTalleres(data.talleres);
    } catch (error) {
      console.error(error);
    }
  };

  const generarReporteDideco = async () => {
    if (!tallerSeleccionado) {
      presentToast({ message: 'Selecciona un taller primero', duration: 2000, color: 'warning' });
      return;
    }
    try {
      const response = await fetch(`https://tramitessantodomingo-production-5cb4.up.railway.app/api/admin/reportes/taller/${tallerSeleccionado}`);
      const data = await response.json();
      if (data.ok) setResultadosDideco(data.inscritos);
    } catch (error) {
      presentToast({ message: 'Error al generar reporte', duration: 2000, color: 'danger' });
    }
  };

  const generarReporteTransito = async () => {
    if (!fechaSeleccionada) {
      presentToast({ message: 'Selecciona una fecha primero', duration: 2000, color: 'warning' });
      return;
    }
    try {
      const response = await fetch(`https://tramitessantodomingo-production-5cb4.up.railway.app/api/admin/reportes/transito/${fechaSeleccionada}`);
      const data = await response.json();
      if (data.ok) setResultadosTransito(data.agendas);
    } catch (error) {
      presentToast({ message: 'Error al generar reporte', duration: 2000, color: 'danger' });
    }
  };

  const imprimirReporte = () => {
    window.print();
  };

  return (
    <IonPage>
      <IonContent fullscreen style={{ '--background': '#f5f5f5' }}>
        <HeaderBanner 
          title="Generador de Reportes"
          backgroundImage="/assets/headerAdmin.png" 
          buttonText="Volver al Panel"
          buttonRoute="/admin-dashboard" 
          showSecondaryButton={false} 
        />

        <main style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
          
          {/* Estilos para ocultar botones al imprimir */}
          <style>
            {`
              @media print {
                .no-print { display: none !important; }
                .print-area { width: 100%; border: none; box-shadow: none; }
                body { background: white; }
              }
            `}
          </style>

          <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <IonSegment value={tipoReporte} onIonChange={e => setTipoReporte(e.detail.value as any)} style={{ maxWidth: '400px' }}>
              <IonSegmentButton value="dideco">
                <IonLabel><IonIcon icon={peopleOutline} /> Talleres DIDECO</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="transito">
                <IonLabel><IonIcon icon={carOutline} /> Tránsito</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            <IonButton color="medium" fill="outline" onClick={imprimirReporte}>
              <IonIcon slot="start" icon={printOutline} /> Exportar PDF
            </IonButton>
          </div>

          <IonCard className="no-print" style={{ marginBottom: '20px', borderRadius: '8px' }}>
            <IonCardContent>
              {tipoReporte === 'dideco' ? (
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <IonItem style={{ flex: 1, minWidth: '250px', border: '1px solid #ccc', borderRadius: '6px' }} lines="none">
                    <IonLabel position="stacked">Seleccionar Taller</IonLabel>
                    <IonSelect value={tallerSeleccionado} onIonChange={e => setTallerSeleccionado(e.detail.value)} placeholder="Elige un taller">
                      {talleres.map(t => (
                        <IonSelectOption key={t.id} value={t.id}>{t.nombre}</IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                  <IonButton onClick={generarReporteDideco} style={{ height: '50px' }}>
                    <IonIcon slot="start" icon={searchOutline} /> Buscar
                  </IonButton>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <IonItem style={{ flex: 1, minWidth: '250px', border: '1px solid #ccc', borderRadius: '6px' }} lines="none">
                    <IonLabel position="stacked">Fecha de Agendamiento</IonLabel>
                    <IonInput type="date" value={fechaSeleccionada} onIonChange={e => setFechaSeleccionada(e.detail.value!)} />
                  </IonItem>
                  <IonButton onClick={generarReporteTransito} style={{ height: '50px' }}>
                    <IonIcon slot="start" icon={searchOutline} /> Buscar
                  </IonButton>
                </div>
              )}
            </IonCardContent>
          </IonCard>

          {/* ÁREA DE RESULTADOS */}
          <div className="print-area">
            {tipoReporte === 'dideco' && resultadosDideco.length > 0 && (
              <>
                <h2 style={{ color: '#1b3a6b', borderBottom: '2px solid #1b3a6b', paddingBottom: '10px' }}>
                  Reporte de Inscritos: Taller DIDECO
                </h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: 'white' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>RUT</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Nombre Completo</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Correo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultadosDideco.map((u, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>{u.rut}</td>
                        <td style={{ padding: '12px' }}>{u.nombres} {u.apellido_p} {u.apellido_m}</td>
                        <td style={{ padding: '12px' }}>{u.correo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {tipoReporte === 'transito' && resultadosTransito.length > 0 && (
              <>
                <h2 style={{ color: '#1b3a6b', borderBottom: '2px solid #1b3a6b', paddingBottom: '10px' }}>
                  Agenda Tránsito: {new Date(fechaSeleccionada + 'T00:00:00').toLocaleDateString()}
                </h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: 'white' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Hora</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>RUT</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Nombre Completo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultadosTransito.map((a, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold', color: '#1a73c8' }}>{a.hora_reserva}</td>
                        <td style={{ padding: '12px' }}>{u.rut}</td>
                        <td style={{ padding: '12px' }}>{a.nombres} {a.apellido_p} {a.apellido_m}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {((tipoReporte === 'dideco' && resultadosDideco.length === 0 && tallerSeleccionado) || 
              (tipoReporte === 'transito' && resultadosTransito.length === 0 && fechaSeleccionada)) && (
              <p style={{ textAlign: 'center', marginTop: '40px', color: '#666', fontSize: '1.2rem' }}>
                No hay registros encontrados para la selección.
              </p>
            )}
          </div>

        </main>
      </IonContent>
    </IonPage>
  );
}