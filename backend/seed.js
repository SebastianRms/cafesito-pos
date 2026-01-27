import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js    ';

dotenv.config();

const seedProducts = [
    { name: 'Café Americano', price: 35, stock: 50, category: 'Bebidas' },
    { name: 'Capuchino', price: 45, stock: 30, category: 'Bebidas' },
    { name: 'Muffin de Chocolate', price: 25, stock: 15, category: 'Comida' }
];

const runSeed = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING);
        await Product.deleteMany(); // Limpia la base de datos
        await Product.insertMany(seedProducts);
        console.log('✅ Datos sembrados con éxito');
        process.exit();
    } catch (error) {
        console.error('❌ Error en el seeding:', error);
        process.exit(1);
    }
};

runSeed();