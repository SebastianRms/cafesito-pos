import express from 'express';
import cors from 'cors'; // Instálalo si no lo tienes: npm install cors
import dotenv from 'dotenv';
import dbConection from './src/config/database.js';
import router from './src/routes/index.js';

const app = express();

app.use('/api', router);

dotenv.config();



// 1. Middlewares Esenciales (Solo estos por ahora)
app.use(cors());
app.use(express.json());

// 2. Intentar conectar la DB
dbConection(); 

// 3. Ruta de prueba (Opcional, para ver si el servidor responde)
app.get('/api/health', (req, res) => {
    res.json({ status: 'API is running' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor en puerto ${PORT}`);
});