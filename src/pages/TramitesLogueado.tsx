import { 
  IonPage, 
  IonContent, 
  IonButton, 
  IonCard, 
  IonCardContent 
} from "@ionic/react";
import { useHistory } from 'react-router-dom';
import FooterBanner from '../components/FooterBanner';
import HeaderBanner from '../components/HeaderBanner';
import ConstructionAlert from '../components/ConstructionAlert'; // Importación de la alerta reutilizable

export default function TramitesLogueado() {
  const history = useHistory();

  const tramites = [
    { titulo: "Permiso Circulación", img: "/assets/permiso.png" },
    { titulo: "Patentes Comerciales", img: "/assets/patente.png" },
    { titulo: "Pago Derechos de aseo", img: "/assets/aseo.png" },
    { titulo: "Tránsito", subtitulo: "(Primer permiso de circulación)", img: "/assets/transito.png" },
    { 
      titulo: "Talleres DIDECO", 
      img: "/assets/talleres.png", 
      ruta: "/talleres" // Única ruta activa por ahora
    },
    { titulo: "Dirección de obras municipales", subtitulo: "(DOM)", img: "/assets/dom.png" },
    { titulo: "Trámites Presenciales", img: "/assets/presencial.png" },
  ];

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>

          <HeaderBanner 
            title="Trámites"
            backgroundImage="/assets/headerTramites.png"
            buttonText="Mi Perfil"
            buttonRoute="/profile"
            showSecondaryButton={false} 
          />

          <main style={{ flex: 1, padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 300px))', 
              gap: '20px',
              width: '100%',
              maxWidth: '1000px',
              justifyContent: 'center'
            }}>
              {tramites.map((item, index) => {
                // Contenido base de la tarjeta
                const CardContent = (
                  <IonCard style={{ 
                    margin: '0 auto', 
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
                    <div style={{ width: '100%', paddingTop: '85%', position: 'relative' }}>
                      <img 
                        src={item.img} 
                        alt={item.titulo} 
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                    <IonCardContent style={{ padding: '0', flex: 1 }}>
                      <IonButton 
                        expand="block" 
                        onClick={() => item.ruta ? history.push(item.ruta) : null}
                        style={{ '--background': '#1b3a6b', '--border-radius': '0', margin: '0', minHeight: '60px' }}
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

                // Si tiene ruta (Talleres), se renderiza normal; si no, se envuelve en la alerta
                return item.ruta ? (
                  <div key={index}>
                    {CardContent}
                  </div>
                ) : (
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