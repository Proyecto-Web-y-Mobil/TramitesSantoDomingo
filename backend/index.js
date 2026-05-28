const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
require('dotenv').config();
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'llave_secreta_municipalidad_2026';

// ---------------------------------------------------
// MIDDLEWARE DE AUTENTICACIÓN (El Guardia de Seguridad)
// ---------------------------------------------------
const verifyToken = (req, res, next) => {
  // El frontend debe enviar el token en la cabecera (Header) 'Authorization'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrae el token de "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado: Se requiere un token.' });
  }

  try {
    // Verificamos si el token es válido y no ha caducado
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Guardamos los datos desencriptados (id, rut, rol) en la request
    next(); // Permite que el código siga hacia la ruta protegida
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado. Inicie sesión nuevamente.' });
  }
};

// ---------------------------------------------------
// RUTAS PÚBLICAS (No exigen Token)
// ---------------------------------------------------
app.get('/api', (req, res) => {
  res.json({ status: 'success', message: 'Servidor Backend Municipal operativo y seguro.' });
});

app.post('/api/auth/login', async (req, res) => {
  const { credential, password } = req.body;

  if (!credential || !password) {
    return res.status(400).json({ message: 'Por favor, complete todos los campos.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE rut = ? OR correo = ?',
      [credential, credential]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const user = rows[0];

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const [roles] = await pool.query(
      'SELECT nombre FROM roles WHERE id = ?',
      [user.id_rol]
    );
    const rol = roles[0]?.nombre || 'ciudadano';

    const token = jwt.sign(
      { id: user.id, rut: user.rut, rol: rol },
      JWT_SECRET,
      { expiresIn: '2h' } 
    );

    res.json({
      message: 'Login exitoso',
      token: token, 
      user: {
        rut: user.rut,
        correo: user.correo,
        nombres: user.nombres,
        apellidoP: user.apellido_p,
        apellidoM: user.apellido_m,
        region: user.region,
        comuna: user.comuna,
        rol: rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { rut, nombres, apellidoP, apellidoM, correo, password, region, comuna } = req.body;

  if (!rut || !correo || !password) {
    return res.status(400).json({ message: 'RUT, correo y contraseña son obligatorios.' });
  }

  try {
    const [existe] = await pool.query(
      'SELECT id FROM usuarios WHERE rut = ? OR correo = ?',
      [rut, correo]
    );

    if (existe.length > 0) {
      return res.status(400).json({ message: 'El usuario ya está registrado.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pool.query(
      `INSERT INTO usuarios 
        (nombres, apellido_p, apellido_m, rut, correo, region, comuna, password_hash, id_rol) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [nombres, apellidoP, apellidoM, rut, correo, region, comuna, hashedPassword] 
    );

    res.status(201).json({
      message: 'Usuario registrado con éxito.',
      user: { rut, correo, rol: 'ciudadano' }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// ---------------------------------------------------
// RUTAS PRIVADAS (Exigen Token - EP 2.5)
// ---------------------------------------------------

// Fíjate cómo metemos "verifyToken" justo en medio de la ruta
app.get('/api/dashboard/datos', verifyToken, (req, res) => {
  // Si el código llega aquí, significa que el token es 100% válido y real
  res.json({
    message: 'Acceso autorizado a datos municipales',
    datosSeguros: {
      informacion: 'Aquí irían los trámites, pagos o datos sensibles desde la BD.',
      usuarioToken: req.user // Te devuelve los datos que estaban ocultos dentro del token
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});