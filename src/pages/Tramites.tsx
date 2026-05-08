import { 
  IonPage, 
  IonContent, 
  IonButton, 
  IonGrid, 
  IonRow, 
  IonCol,
  IonCard,
  IonCardContent
} from "@ionic/react";
import { useHistory } from 'react-router-dom';

export default function Tramites() {
  const history = useHistory();
  const tramites = [
    { titulo: "Permiso Circulación", img: "/assets/permiso.png" },
    { titulo: "Patentes Comerciales", img: "/assets/patente.png" },
    { titulo: "Pago Derechos de aseo", img: "/assets/aseo.png" },
    { titulo: "Tránsito", subtitulo: "(Primer permiso de circulación)", img: "/assets/transito.png" },
    { titulo: "Talleres DIDECO", img: "/assets/talleres.png" },
    { titulo: "Dirección de obras municipales", subtitulo: "(DOM)", img: "/assets/dom.png" },
    { titulo: "Trámites Presenciales", img: "/assets/presencial.png" },
  ];

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>

          <header
            style={{
              backgroundImage: `linear-gradient(rgba(68, 43, 146, 0.4), rgba(68, 43, 146, 0.4)), url('/assets/headerTramites.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: '20px',
              color: 'white',
              minHeight: '160px'
            }}
          >
            <IonGrid>
              <IonRow className="ion-align-items-center">
                <IonCol size="6" sizeMd="4">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="/assets/logo.webp" alt="Logo" style={{ height: '60px' }} />
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Trámites</h1>
                  </div>
                </IonCol>
                
                <IonCol size="6" sizeMd="8" style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-block' }}>
                    <IonButton 
                      onClick={() => history.push('/login')}
                      style={{ '--background': '#0088d6', '--border-radius': '4px', fontWeight: 'bold' }}
                    >
                      Iniciar Sesión
                    </IonButton>
                    <p 
                      onClick={() => history.push('/login-funcionario')}
                      style={{ fontSize: '0.75rem', marginTop: '5px', cursor: 'pointer', color: 'white' }}
                    >
                      Inicio Sesión Funcionarios
                    </p>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </header>

          <main style={{ flex: 1, padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ 
              display: 'grid',
              /* Se ajusta para que no crezca más de 300px por tarjeta */
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 300px))', 
              gap: '20px',
              width: '100%',
              maxWidth: '1000px',
              justifyContent: 'center' // Mantiene el bloque centrado
            }}>
              {tramites.map((item, index) => (
                <IonCard key={index} style={{ 
                  margin: '0 auto', 
                  width: '100%',
                  display: 'flex', 
                  flexDirection: 'column', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  backgroundColor: 'white',
                  border: 'none',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: '100%', 
                    paddingTop: '85%', 
                    position: 'relative'
                  }}>
                    <img 
                      src={item.img} 
                      alt={item.titulo} 
                      style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }} 
                    />
                  </div>
                  
                  <IonCardContent style={{ padding: '0', flex: 1 }}>
                    <IonButton 
                      expand="block" 
                      style={{ 
                        '--background': '#1b3a6b', 
                        '--border-radius': '0',
                        margin: '0',
                        minHeight: '60px'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', width: '100%' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'none', whiteSpace: 'normal' }}>
                          {item.titulo}
                        </span>
                        {item.subtitulo && (
                          <span style={{ fontSize: '0.7rem', fontWeight: 'normal', fontStyle: 'italic', marginTop: '2px', textTransform: 'none', whiteSpace: 'normal', opacity: 0.9 }}>
                            {item.subtitulo}
                          </span>
                        )}
                      </div>
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          </main>

          <footer style={{ backgroundColor: '#0088d6', color: 'white', padding: '25px 20px' }}>
            <IonGrid style={{ maxWidth: '1000px' }}>
              <IonRow>
                <IonCol size="12" sizeMd="7">
                  <p style={{ margin: '0 0 5px 0' }}>Dirección: Avenida Santa Teresa N°1</p>
                  <p style={{ margin: '0 0 5px 0' }}>Horario de atención:</p>
                  <ul style={{ margin: 0, paddingLeft: '15px', listStyle: 'none', fontSize: '0.9rem' }}>
                    <li>- Lunes a Viernes: 08:45 am a 14:00 pm.</li>
                    <li>- Sábado: 09:30 am a 13:30 pm</li>
                  </ul>
                </IonCol>
                <IonCol size="12" sizeMd="5" style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 5px 0' }}>Emergencias 24 horas:</p>
                  <p style={{ margin: '0 0 5px 0' }}>+563 2236 1603 - +563 5222 4200</p>
                  <p style={{ margin: '0 0 5px 0' }}>Seguridad: 1458</p>
                  <p style={{ margin: '0' }}>contacto@santodomingo.cl</p>
                </IonCol>
              </IonRow>
            </IonGrid>
          </footer>
        </div>
      </IonContent>
    </IonPage>
  );
}