import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Login from './pages/Login'; 
import LoginFuncionario from './pages/LoginFuncionario'; 
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tramites from './pages/Tramites';
import TramitesLogueado from './pages/TramitesLogueado';
import AdminDashboard from './pages/AdminDashboard';
import TalleresDideco from './pages/TalleresDideco';

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

        {/* NUEVAS RUTAS DE TRÁMITES */}
        <Route exact path="/tramite/permiso-circulacion/info">
          <PermisoCirculacionInfo />
        </Route>

        <Route exact path="/tramite/permiso-circulacion/formulario">
          <PermisoCirculacionForm />
        </Route>

        <Route exact path="/">
          <Redirect to="/tramites" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;