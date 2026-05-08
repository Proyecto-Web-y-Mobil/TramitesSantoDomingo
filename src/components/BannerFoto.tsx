import React from 'react';

interface BannerProps {
  titulo: string;
}

const BannerFoto: React.FC<BannerProps> = ({ titulo }) => {
  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '140px', 
      overflow: 'hidden' 
    }}>
      <img 
        src="/assets/FondoSantoDomingo.jpg" 
        alt="Santo Domingo" 
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%' }} 
      />
      
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'linear-gradient(to right, rgba(27,58,107,0.75) 0%, rgba(27,58,107,0.35) 60%, transparent 100%)' 
      }} />
      
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        bottom: 0, 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px', // Aumentado el espacio entre logo y título
        padding: '0 30px' // Aumentado el padding izquierdo total
      }}>
        <img 
          src="/assets/logo.webp" 
          alt="Logo Municipalidad" 
          style={{ height: '75px', width: 'auto', borderRadius: '4px' }} 
        />
        <h1 style={{ 
          color: '#ffffff', 
          fontSize: '28px', 
          fontWeight: '700', 
          margin: 0,
          textShadow: '0 2px 8px rgba(0,0,0,0.5)'
        }}>
          {titulo}
        </h1>
      </div>

      <div style={{ 
        position: 'absolute', 
        top: '12px', 
        right: '16px', 
        width: '72px', 
        height: '72px', 
        borderRadius: '50%', 
        border: '3px solid #ffffff', 
        overflow: 'hidden', 
        background: '#d1d5db',
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)'
      }}>
        <img src="/assets/IconoPerfil.png" alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
  );
};

export default BannerFoto;