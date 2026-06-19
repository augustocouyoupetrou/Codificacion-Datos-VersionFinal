import express from 'express';
import cors from 'cors';
import compressionRoutes from './src/routes/compressionRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Permite que el frontend (en otro origen/puerto) consuma esta API.
app.use(cors());

// Parsea el body de las peticiones POST como JSON.
app.use(express.json());

// Todas las rutas de la API quedan bajo el prefijo /api
// (POST /api/compress, POST /api/decompress).
app.use('/api', compressionRoutes);

// Endpoint de salud simple, útil para verificar que el backend está arriba.
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'huffman-shannon-backend' });
});

// Cualquier ruta no reconocida devuelve 404 en formato JSON.
app.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado.' });
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
