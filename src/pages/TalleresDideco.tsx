import { IonPage, IonContent } from "@ionic/react";

export default function TalleresDideco() {
  const talleres = [
    {
      titulo: "Arteterapia",
      img: "/assets/arte.png",
    },
    {
      titulo: "Zumba",
      img: "/assets/zumba.png",
    },
    {
      titulo: "Folklore",
      img: "/assets/folklore.png",
    },
    {
      titulo: "Cocina Saludable",
      img: "/assets/cocina.png",
    },
    {
      titulo: "Yoga 3ra edad",
      img: "/assets/yoga.png",
    },
    {
      titulo: "Fútbol Femenino",
      img: "/assets/futbol.png",
    },
  ];

  return (
    <IonPage>
      <IonContent fullscreen className="talleres-content">
        <div className="talleres-page">

          {/* HEADER */}
          <header
            className="talleres-hero"
            style={{
              backgroundImage: `
                linear-gradient(
                  rgba(68, 43, 146, 0.55),
                  rgba(68, 43, 146, 0.55)
                ),
                url('/assets/headtalleres.png')
              `,
            }}
          >
            <img
              src="/assets/logo.webp"
              alt="Logo Municipalidad"
              className="talleres-logo"
            />

            <h1>Talleres DIDECO</h1>

            <div className="talleres-login">
              <button className="login-main-btn">
                Iniciar Sesión
              </button>

              <button className="funcionarios-btn">
                Inicio Sesión Funcionarios
              </button>
            </div>
          </header>

          {/* GRID */}
          <main className="talleres-grid">
            {talleres.map((item, index) => (
              <div className="taller-card" key={index}>
                <img src={item.img} alt={item.titulo} />

                <button className="taller-title">
                  {item.titulo}
                </button>
              </div>
            ))}
          </main>

          {/* FOOTER */}
          <footer className="talleres-footer">
            <div>
              <p>
                <strong>Dirección:</strong> Avenida Santa Teresa N°1.
              </p>

              <p>
                <strong>Horario de atención:</strong>
              </p>

              <p>- Lunes a Viernes: 08:45 am a 14:00 pm.</p>

              <p>- Sábado: 09:30 am a 13:30 pm</p>
            </div>

            <div>
              <p>
                <strong>Emergencias 24 horas:</strong>
              </p>

              <p>+563 2238 1603 - +563 5220 4200</p>

              <p>
                <strong>Seguridad:</strong> 1458
              </p>

              <p>contacto@santodomingo.cl</p>
            </div>
          </footer>

          {/* COPYRIGHT */}
          <div className="talleres-copy">
            <span>
              Copyright © 2026 I. Municipalidad de Santo Domingo
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