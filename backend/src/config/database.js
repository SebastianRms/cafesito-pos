import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const dbConection = async () => {
    try {
        const dbURI = process.env.DB_CONNECTION_STRING;

        await mongoose.connect(dbURI, {}); 
        
        console.log(`MongoDB is connected`);
    } catch (error) {
        console.log("Error connecting to database:", error.message);
        process.exit(1);
    }
};

export default dbConection;