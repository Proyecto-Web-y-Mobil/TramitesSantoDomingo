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
        rol: rol,
        estado_validacion: user.estado_validacion // <-- ¡Añadido para que el perfil lo lea al logearse!
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
// RUTA: ACREDITAR RESIDENCIA
// ---------------------------------------------------
app.post('/api/usuarios/residencia', upload.single('documento_residencia'), async (req, res) => {
  try {
      const { usuario_id } = req.body;
      
      if (!req.file) {
          return res.status(400).json({ ok: false, error: 'Falta el documento de residencia' });
      }
      if (!usuario_id || usuario_id === 'null' || usuario_id === 'undefined') {
          return res.status(400).json({ ok: false, error: 'Falta o es inválido el ID del usuario' });
      }

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

      const queryUpdate = `
          UPDATE usuarios 
          SET url_residencia = ?, estado_validacion = 'En revisión'
          WHERE id = ?
      `;
      
      const [resultadoBD] = await pool.query(queryUpdate, [url_residencia, usuario_id]);

      if (resultadoBD.affectedRows === 0) {
           return res.status(404).json({ ok: false, error: 'Usuario no encontrado en la BD' });
      }

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
      
      const query = `
          SELECT s.id, s.estado, s.observacion, s.fecha_solicitud, t.nombre AS nombre_tramite
          FROM solicitudes_tramite s
          JOIN tramites t ON s.tramite_id = t.id
          WHERE s.usuario_id = ?
          ORDER BY s.fecha_solicitud DESC
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
// RUTA DE ADMINISTRADOR: LISTAR TODOS LOS TRÁMITES
// ---------------------------------------------------
app.get('/api/admin/tramites', async (req, res) => {
  try {
      // Unimos solicitudes_tramite, tramites y usuarios para tener toda la foto completa
      const query = `
          SELECT 
              s.id AS solicitud_id, 
              s.estado, 
              s.fecha_solicitud, 
              t.nombre AS nombre_tramite,
              u.nombres, 
              u.apellido_p, 
              u.apellido_m, 
              u.rut
          FROM solicitudes_tramite s
          JOIN tramites t ON s.tramite_id = t.id
          JOIN usuarios u ON s.usuario_id = u.id
          ORDER BY s.fecha_solicitud DESC
      `;
      
      const [tramites] = await pool.query(query);
      
      res.status(200).json({
          ok: true,
          tramites: tramites
      });
  } catch (error) {
      console.error('Error al obtener la lista de trámites (Admin):', error);
      res.status(500).json({ ok: false, error: 'Error al cargar los trámites' });
  }
});

// ---------------------------------------------------
// RUTA: VER DETALLE DE UN TRÁMITE ESPECÍFICO (ADMIN)
// ---------------------------------------------------
app.get('/api/admin/tramites/:id', async (req, res) => {
  try {
      const { id } = req.params;
      
      // Unimos solicitudes, tramites, usuarios y detalles_vehiculo
      const query = `
          SELECT 
              s.id AS solicitud_id, s.estado, s.fecha_solicitud, s.observacion,
              t.nombre AS nombre_tramite,
              u.nombres, u.apellido_p, u.apellido_m, u.rut, u.correo,
              d.patente, d.marca, d.modelo, d.anio, d.url_revision_tecnica
          FROM solicitudes_tramite s
          JOIN tramites t ON s.tramite_id = t.id
          JOIN usuarios u ON s.usuario_id = u.id
          LEFT JOIN detalles_vehiculo d ON s.id = d.solicitud_id
          WHERE s.id = ?
      `;
      
      const [rows] = await pool.query(query, [id]);
      
      if (rows.length === 0) {
          return res.status(404).json({ ok: false, error: 'Trámite no encontrado' });
      }
      
      res.status(200).json({ ok: true, tramite: rows[0] });
  } catch (error) {
      console.error('Error al obtener detalle del trámite:', error);
      res.status(500).json({ ok: false, error: 'Error al cargar el detalle' });
  }
});

// ---------------------------------------------------
// RUTA: ACTUALIZAR ESTADO DEL TRÁMITE (APROBAR/OBSERVAR)
// ---------------------------------------------------
app.put('/api/admin/tramites/:id/estado', async (req, res) => {
  try {
      const { id } = req.params;
      const { estado, observacion } = req.body;
      
      const query = `UPDATE solicitudes_tramite SET estado = ?, observacion = ? WHERE id = ?`;
      await pool.query(query, [estado, observacion || null, id]);
      
      res.status(200).json({ ok: true, message: 'Estado del trámite actualizado' });
  } catch (error) {
      console.error('Error al actualizar estado:', error);
      res.status(500).json({ ok: false, error: 'Error al actualizar el trámite' });
  }
});

// ---------------------------------------------------
// RUTAS DE ADMINISTRADOR: RESIDENCIAS
// ---------------------------------------------------

// 1. Obtener la lista de usuarios pendientes
app.get('/api/admin/residencias-pendientes', async (req, res) => {
  try {
      const query = `
          SELECT id, rut, nombres, apellido_p, apellido_m, correo, url_residencia, estado_validacion 
          FROM usuarios 
          WHERE estado_validacion = 'En revisión'
      `;
      const [pendientes] = await pool.query(query);
      
      res.status(200).json({ ok: true, usuarios: pendientes });
  } catch (error) {
      console.error('Error al obtener residencias:', error);
      res.status(500).json({ ok: false, error: 'Error al cargar los datos' });
  }
});

// 2. Aprobar residencia
app.put('/api/admin/residencias/aprobar/:id', async (req, res) => {
  try {
      const userId = req.params.id;
      // Cambiamos el id_rol a 2 (Residente) y el estado a Aprobado
      const query = `UPDATE usuarios SET id_rol = 2, estado_validacion = 'Aprobado' WHERE id = ?`;
      await pool.query(query, [userId]);
      
      res.status(200).json({ ok: true, message: 'Usuario promovido a Residente' });
  } catch (error) {
      console.error('Error al aprobar residencia:', error);
      res.status(500).json({ ok: false, error: 'Error al aprobar' });
  }
});

// 3. Rechazar residencia
app.put('/api/admin/residencias/rechazar/:id', async (req, res) => {
  try {
      const userId = req.params.id;
      // Devolvemos el estado a 'Sin subir' y borramos la URL del documento malo
      const query = `UPDATE usuarios SET estado_validacion = 'Sin subir', url_residencia = NULL WHERE id = ?`;
      await pool.query(query, [userId]);
      
      res.status(200).json({ ok: true, message: 'Documento rechazado' });
  } catch (error) {
      console.error('Error al rechazar residencia:', error);
      res.status(500).json({ ok: false, error: 'Error al rechazar' });
  }
});

// ---------------------------------------------------
// INICIO DEL SERVIDOR
// ---------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});