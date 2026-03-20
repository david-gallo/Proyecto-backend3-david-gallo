import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import swaggerUiExpress from 'swagger-ui-express';
import YAML from 'yamljs';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Cargar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/adoptme';

// Conexión a MongoDB
mongoose.connect(MONGO_URL)
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Cargar documentación Swagger desde archivo YAML
const swaggerDocument = YAML.load(join(__dirname, 'docs', 'swagger.yaml'));

// Configuración de CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

// Rate limiting: máximo 100 requests por 15 minutos
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de requests
    message: { status: 'error', error: 'Demasiadas peticiones, intenta de nuevo más tarde' }
});
app.use('/api/', limiter);

app.use(express.json());
app.use(cookieParser());

// Ruta de documentación Swagger
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocument));

// Rutas
app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks',mocksRouter);

// Ruta de health check
app.get('/health', (req, res) => {
    res.send({ status: 'ok', message: 'Server is running' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).send({ status: 'error', error: 'Ruta no encontrada' });
});

// Middleware global de manejo de errores (debe ir al final)
app.use(errorHandler);

// Solo iniciar el servidor si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}

export default app;
