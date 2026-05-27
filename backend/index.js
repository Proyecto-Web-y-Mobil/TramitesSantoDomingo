const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares obligatorios de la EP 2.1
app.use(cors()); // Evita bloqueos de conexión con Ionic/StackBlitz
app.use(express.json()); // Permite procesar datos en formato JSON

// Simulación temporal de datos (Basado en tu login actual)
const usuariosSimulados = [
  {
    id: 1,
    nombres: 'Admin',
    apellidoP: 'Municipal',
    apellidoM: '',
    rut: '11111111-1',
    correo: 'admin@municipalidad.cl',
    password: 'admin123', // En la EP 2.5 esto usará bcrypt
    rol: 'funcionario'
  }
];

// Endpoint Base de Verificación (EP 2.1)
app.get('/api', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Servidor Backend Municipal de la EP 2.1 Operativo con Éxito.' 
  });
});

// Contrato inicial para el Login (EP 2.4)
app.post('/api/auth/login', (req, res) => {
  const { credential, password } = req.body;

  if (!credential || !password) {
    return res.status(400).json({ message: 'Por favor, complete todos los campos.' });
  }

  const user = usuariosSimulados.find(u => 
    (u.rut === credential || u.correo === credential) && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Credenciales de inicio de sesión incorrectas.' });
  }

  res.json({
    message: 'Login exitoso',
    token: 'jwt_token_simulado_ep2', // En la EP 2.6 generaremos un JWT real
    user: {
      rut: user.rut,
      correo: user.correo,
      nombres: user.nombres,
      rol: user.rol
    }
  });
});

// Contrato inicial para el Registro (EP 2.4)
app.post('/api/auth/register', (req, res) => {
  const { rut, nombres, apellidoP, apellidoM, correo, password, rol } = req.body;

  if (!rut || !correo || !password) {
    return res.status(400).json({ message: 'RUT, correo y contraseña son obligatorios.' });
  }

  const existe = usuariosSimulados.find(u => u.rut === rut || u.correo === correo);
  if (existe) {
    return res.status(400).json({ message: 'El usuario ya está registrado en el sistema.' });
  }

  const nuevoUsuario = {
    id: usuariosSimulados.length + 1,
    rut, nombres, apellidoP, apellidoM, correo, password,
    rol: rol || 'ciudadano'
  };

  usuariosSimulados.push(nuevoUsuario);

  res.status(201).json({
    message: 'Usuario registrado con éxito',
    user: { rut, correo, rol: nuevoUsuario.rol }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
  console.log(`==================================================`);
});