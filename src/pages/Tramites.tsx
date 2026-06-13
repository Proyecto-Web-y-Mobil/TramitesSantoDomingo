import { 
  IonPage, 
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonButton 
} from "@ionic/react";
import { useHistory } from 'react-router-dom';
import FooterBanner from '../components/FooterBanner';
import HeaderBanner from '../components/HeaderBanner';
import ConstructionAlert from '../components/ConstructionAlert';

export default function Tramites() {
  const history = useHistory();
  
  const tramites = [
    // Marcamos Permiso de Circulación como especial
    { titulo: "Permiso Circulación", img: "/assets/permiso.png", especial: true },
    { titulo: "Patentes Comerciales", img: "/assets/patente.png" },
    { titulo: "Pago Derechos de aseo", img: "/assets/aseo.png" },
    { titulo: "Tránsito", subtitulo: "(Primer permiso de circulación)", img: "/assets/transito.png" },
    { titulo: "Talleres DIDECO", img: "/assets/talleres.png", especial: true },
    { titulo: "Dirección de obras municipales", subtitulo: "(DOM)", img: "/assets/dom.png" },
    // Marcamos Trámites Presenciales como especial
    { titulo: "Trámites Presenciales", img: "/assets/presencial.png", especial: true },
  ];

  // Renombramos la función para que tenga sentido con cualquier trámite
  const handleProtectedClick = () => {
    alert("Esta función es solo para usuarios logueados. Por favor, inicia sesión.");
    history.push('/login');
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>

          <HeaderBanner 
            title="Trámites"
            backgroundImage="/assets/headerTramites.png"
            buttonText="Iniciar Sesión"
            buttonRoute="/login"
            showSecondaryButton={true} 
          />

          <main style={{ flex: 1, padding: '40px 20px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '30px', 
              margin: '0 auto',
              width: '100%',
              maxWidth: '1200px',
              justifyContent: 'center'
            }}>
              {tramites.map((item, index) => {
                
                const CardContent = (
                  <IonCard style={{ 
                    margin: '0', 
                    width: '100%',
                    display: 'flex', 
                    flexDirection: 'column', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    backgroundColor: 'white',
                    border: 'none',
                    overflow: 'hidden',
                    height: '100%'
                  }}>
                    <div style={{ width: '100%', paddingTop: '65%', position: 'relative' }}>
                      <img src={item.img} alt={item.titulo} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
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
                );

                // Si es especial (Permiso, Talleres o Presencial), usa la redirección al login
                if (item.especial) {
                  return (
                    <div key={index} onClick={handleProtectedClick} style={{ cursor: 'pointer' }}>
                      {CardContent}
                    </div>
                  );
                }

                // Si no, muestra la alerta de construcción
                return (
                  <ConstructionAlert key={index}>
                    {CardContent}
                  </ConstructionAlert>
                );
              })}
            </div>
          </main>

          <FooterBanner />

        </div>
      </IonContent>
    </IonPage>
  );
}