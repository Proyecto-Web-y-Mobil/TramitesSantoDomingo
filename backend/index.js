const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
require('dotenv').config();
const pool = require('./db');

// --- NUEVAS HERRAMIENTAS PARA SUBIR ARCHIVOS ---
const multer = require('multer');
const cloudinary = require('./config/cloudinary'); 

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'llave_secreta_municipalidad_2026';

// ---------------------------------------------------
// MIDDLEWARE DE AUTENTICACIÓN (El Guardia de Seguridad)
// ---------------------------------------------------
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado: Se requiere un token.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next(); 
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
        id: user.id,
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
app.get('/api/dashboard/datos', verifyToken, (req, res) => {
  res.json({
    message: 'Acceso autorizado a datos municipales',
    datosSeguros: {
      informacion: 'Aquí irían los trámites, pagos o datos sensibles desde la BD.',
      usuarioToken: req.user 
    }
  });
});

// ---------------------------------------------------
// NUEVA RUTA: TRÁMITES CON SUBIDA DE ARCHIVOS (EP 3)
// ---------------------------------------------------

// Configurar Multer: Guardamos el archivo en la memoria temporal del servidor
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/api/tramites/permiso-circulacion', upload.single('documento'), async (req, res) => {
    try {
        const { usuario_id, tramite_id, patente, marca, modelo, anio } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ ok: false, error: 'Falta el documento de revisión técnica' });
        }

        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'municipalidad/revisiones' }, 
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        const url_revision_tecnica = uploadResult.secure_url;

        // Utilizamos el "pool" que ya tienes configurado en tu proyecto
        const querySolicitud = `INSERT INTO solicitudes_tramite (usuario_id, tramite_id) VALUES (?, ?)`;
        const [resultSolicitud] = await pool.query(querySolicitud, [usuario_id, tramite_id]);
        
        const solicitud_id = resultSolicitud.insertId;

        const queryVehiculo = `
            INSERT INTO detalles_vehiculo (solicitud_id, patente, marca, modelo, anio, url_revision_tecnica)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await pool.query(queryVehiculo, [solicitud_id, patente, marca, modelo, anio, url_revision_tecnica]);

        res.status(201).json({
            ok: true,
            message: 'Trámite ingresado correctamente',
            solicitud_id: solicitud_id,
            url_documento: url_revision_tecnica
        });

    } catch (error) {
        console.error('Error al procesar el trámite:', error);
        res.status(500).json({ ok: false, error: 'Error interno del servidor al procesar la solicitud' });
    }
});

// ---------------------------------------------------
// NUEVA RUTA: ACREDITAR RESIDENCIA
// ---------------------------------------------------
app.post('/api/usuarios/residencia', upload.single('documento_residencia'), async (req, res) => {
  try {
      const { usuario_id } = req.body;
      
      if (!req.file) {
          return res.status(400).json({ ok: false, error: 'Falta el documento de residencia' });
      }
      if (!usuario_id) {
          return res.status(400).json({ ok: false, error: 'Falta el ID del usuario' });
      }

      // 1. Subir a Cloudinary (en una carpeta separada para mantener el orden)
      const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
              { folder: 'municipalidad/residencia' }, 
              (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
              }
          );
          stream.end(req.file.buffer);
      });

      const url_residencia = uploadResult.secure_url;

      // 2. Actualizar al usuario en la Base de Datos
      // Aquí no hacemos un INSERT, hacemos un UPDATE porque el usuario ya existe
      const queryUpdate = `
          UPDATE usuarios 
          SET url_residencia = ?, estado_validacion = 'En revisión'
          WHERE id = ?
      `;
      await pool.query(queryUpdate, [url_residencia, usuario_id]);

      res.status(200).json({
          ok: true,
          message: 'Documento subido y en revisión',
          url_documento: url_residencia
      });

  } catch (error) {
      console.error('Error al subir documento de residencia:', error);
      res.status(500).json({ ok: false, error: 'Error interno del servidor' });
  }
});

// ---------------------------------------------------
// NUEVA RUTA: OBTENER MIS TRÁMITES
// ---------------------------------------------------
app.get('/api/tramites/usuario/:id', async (req, res) => {
  try {
      const { id } = req.params;
      
      // Unimos la tabla de solicitudes con la tabla maestra de trámites para obtener el nombre real
      const query = `
          SELECT s.id, s.estado, s.observaciones, s.fecha_creacion, t.nombre AS nombre_tramite
          FROM solicitudes_tramite s
          JOIN tramites t ON s.tramite_id = t.id
          WHERE s.usuario_id = ?
          ORDER BY s.fecha_creacion DESC
      `;
      
      const [tramites] = await pool.query(query, [id]);
      
      res.status(200).json({
          ok: true,
          tramites: tramites
      });
  } catch (error) {
      console.error('Error al obtener trámites:', error);
      res.status(500).json({ ok: false, error: 'Error interno al cargar los trámites' });
  }
});

// ---------------------------------------------------
// INICIO DEL SERVIDOR
// ---------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});