import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'

dotenv.config();
await connectDB();

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    // credentials: true,
}));

app.use(express.json());

const PORT = process.env.PORT;

app.use('/api/auth', authRoutes);

app.get('/',(req,res)=>{
    res.send("Hello jee, welcome to home");
})

app.listen(PORT,()=>{    
    console.log(`Server is up on port ${PORT}`);
})