import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import GlobalSync from './components/GlobalSync';
import Login from './pages/Login'; 
import LoginFuncionario from './pages/LoginFuncionario'; 
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tramites from './pages/Tramites';
import TramitesLogueado from './pages/TramitesLogueado';
import AdminDashboard from './pages/AdminDashboard';
import TalleresDideco from './pages/TalleresDideco';
import MisTramites from './pages/MisTramites';
import ValidarResidencias from './pages/ValidarResidencias';
import AdminTramites from './pages/AdminTramites';
import AdminRevisarTramite from './pages/AdminRevisarTramite';
import ReportesAdmin from './pages/ReportesAdmin';
import DetalleMiTramite from './pages/DetalleMiTramite';
import TallerZumbaInfo from './pages/TallerZumbaInfo';
import TallerZumbaInscripcion from './pages/TallerZumbaInscripcion';
import TramitesPresenciales from './pages/TramitesPresenciales';
import LicenciaInfo from './pages/LicenciaInfo';
import LicenciaInscripcion from './pages/LicenciaInscripcion';
import MisAgendas from './pages/MisAgendas';

// Importamos la nueva pantalla
import PermisoCirculacionInfo from './pages/PermisoCirculacionInfo';
import PermisoCirculacionForm from './pages/PermisoCirculacionForm';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      {/* Nuestro vigía invisible que sincronizará la sesión al navegar */}
      <GlobalSync />
      
      <IonRouterOutlet>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/profile">
          <Profile />
        </Route>
        <Route exact path="/login-funcionario">
          <LoginFuncionario />
        </Route>
        <Route exact path="/tramites">
          <Tramites />
        </Route>
        <Route exact path="/admin-dashboard">
          <AdminDashboard />
        </Route>
        <Route exact path="/talleres">
          <TalleresDideco />
        </Route>
        <Route exact path="/tramites-user">
          <TramitesLogueado/>
        </Route>
        <Route exact path="/mis-tramites">
          <MisTramites />
        </Route>

        <Route exact path="/mis-agendas">
          <MisAgendas />
        </Route>

        <Route exact path="/tramite/permiso-circulacion/info">
          <PermisoCirculacionInfo />
        </Route>

        <Route exact path="/tramite/permiso-circulacion/formulario">
          <PermisoCirculacionForm />
        </Route>

        <Route exact path="/tramites-presenciales">
          <TramitesPresenciales />
        </Route>

        <Route exact path="/tramites-presenciales/licencia-b/info">
          <LicenciaInfo />
        </Route>

        <Route exact path="/tramites-presenciales/licencia-b/agendar">
          <LicenciaInscripcion />
        </Route>

        <Route exact path="/talleres/zumba">
          <TallerZumbaInfo />
        </Route>

        <Route exact path="/talleres/zumba/inscripcion">
          <TallerZumbaInscripcion />
        </Route>

        <Route exact path="/admin/residencias">
          <ValidarResidencias />
        </Route>

        <Route exact path="/admin/tramites">
          <AdminTramites />
        </Route>

        <Route exact path="/admin/tramites/revisar/:id">
          <AdminRevisarTramite />
        </Route>

        <Route exact path="/admin/reportes">
          <ReportesAdmin />
        </Route>

        <Route exact path="/mis-tramites/detalle/:id">
          <DetalleMiTramite />
        </Route>
        
        <Route exact path="/">
          <Redirect to="/tramites" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;