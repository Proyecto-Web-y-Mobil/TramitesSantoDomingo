import React from 'react';
import { IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

interface BannerProps {
  titulo: string;
}

const BannerFoto: React.FC<BannerProps> = ({ titulo }) => {
  const history = useHistory();

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '140px', 
      overflow: 'hidden' 
    }}>
      {/* Imagen de fondo compartida */}
      <img 
        src="/assets/FondoSantoDomingo.jpg" 
        alt="Santo Domingo" 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
      />
      
      {/* Degradado institucional */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'linear-gradient(to right, rgba(27,58,107,0.75), transparent)' 
      }} />
      
      {/* Logo y Título Variable */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        bottom: 0, 
        display: 'flex', 
        alignItems: 'center', 
        gap: '14px', 
        padding: '0 20px' 
      }}>
        <img src="/assets/logo.webp" alt="Logo" style={{ height: '56px' }} />
        <h1 style={{ color: '#ffffff', fontSize: '28px', fontWeight: '700', margin: 0 }}>
          {titulo}
        </h1>
      </div>

      {/* Círculo de Perfil */}
      <div style={{ 
        position: 'absolute', 
        top: '12px', 
        right: '16px', 
        width: '72px', 
        height: '72px', 
        borderRadius: '50%', 
        border: '3px solid #ffffff', 
        overflow: 'hidden', 
        background: '#d1d5db' 
      }}>
        <img src="/assets/IconoPerfil.png" alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Navegación inferior izquierda */}
      <div style={{ position: 'absolute', bottom: '10px', left: '20px', display: 'flex', gap: '10px' }}>
        <IonButton size="small" onClick={() => history.push('/tramites')} style={{ '--background': '#1a73c8' }}>
          Mis Trámites
        </IonButton>
        <IonButton size="small" style={{ '--background': '#1a73c8' }}>
          Mis Agendas
        </IonButton>
      </div>
    </div>
  );
};

export default BannerFoto;