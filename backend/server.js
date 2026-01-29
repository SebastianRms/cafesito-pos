import express from 'express';
import cors from 'cors'; 
import dotenv from 'dotenv';
import dbConection from './src/config/database.js';
import router from './src/routes/index.js';
import  errorHandler  from './src/middlewares/error-handler.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'API is running' });
});

app.use('/api', router);


dbConection(); 

// 3. Ruta de prueba (Opcional, para ver si el servidor responde)


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});

app.use(errorHandler);