import { IonPage, IonContent, IonButton } from "@ionic/react";

export default function Tramites() {
  const tramites = [
    {
      titulo: "Permiso Circulación",
      img: "/assets/permiso.png",
    },
    {
      titulo: "Patentes Comerciales",
      img: "/assets/patente.png",
    },
    {
      titulo: "Pago Derechos de aseo",
      img: "/assets/aseo.png",
    },
    {
      titulo: "Tránsito",
      subtitulo: "(Primer permiso de circulación)",
      img: "/assets/transito.png",
    },
    {
      titulo: "Talleres DIDECO",
      img: "/assets/talleres.png",
    },
    {
      titulo: "Dirección de obras municipales",
      subtitulo: "(DOM)",
      img: "/assets/dom.png",
    },
    {
      titulo: "Trámites Presenciales",
      img: "/assets/presencial.png",
    },
  ];

  return (
    <IonPage>
      <IonContent fullscreen className="tramites-content">
        <div className="tramites-page">

          {/* HEADER */}
          <header
            className="hero"
            style={{
              backgroundImage: `linear-gradient(
                rgba(68, 43, 146, 0.60),
                rgba(68, 43, 146, 0.60)
              ), url('/assets/headerTramites.png')`,
            }}
          >
            <img
              src="/assets/logo.webp"
              alt="Logo Municipalidad"
              className="hero-logo"
            />

            <h1>Trámites</h1>

            <div className="login-box">
              <IonButton className="login-btn">
                Iniciar Sesión
              </IonButton>

              <p className="funcionarios-link">
                Inicio Sesión funcionarios
              </p>
            </div>
          </header>

          {/* TARJETAS */}
          <main className="cards-grid">
            {tramites.map((item, index) => (
              <div className="tramite-card" key={index}>
                <img src={item.img} alt={item.titulo} />

                <button className="card-title-btn">
                  {item.titulo}

                  {item.subtitulo && (
                    <span className="card-subtitle-inline">
                      {item.subtitulo}
                    </span>
                  )}
                </button>

                <IonButton
                  size="small"
                  className="card-btn"
                >
                  Realizar Trámite
                </IonButton>
              </div>
            ))}
          </main>

          {/* FOOTER */}
          <footer className="footer">
            <div>
              <p>Dirección: Avenida Santa Teresa N°1</p>
              <p>Horario de atención:</p>
              <p>Lunes a Viernes: 08:45 am a 14:00 pm.</p>
              <p>Sábado: 09:30 am a 13:30 pm</p>
            </div>

            <div>
              <p>Emergencias 24 horas:</p>
              <p>+563 2236 1603 - +563 5222 4200</p>
              <p>Seguridad: 1458</p>
              <p>contacto@santodomingo.cl</p>
            </div>
          </footer>

          {/* COPYRIGHT */}
          <div className="copyright">
            <span>
              Copyright © 2026 Municipalidad de Santo Domingo
            </span>

            <span>
              I. Municipalidad de Santo Domingo
            </span>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
}