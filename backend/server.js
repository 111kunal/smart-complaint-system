import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import complaintRoutes from './routes/complaintRoutes.js'

dotenv.config();
await connectDB();

const app = express();

const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];

// app.use(cors({
//     origin: process.env.FRONTEND_URL,
//     // credentials: true,
// }));

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^https:\/\/smart-complaint-system-[a-z0-9-]+\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
}));

app.use(express.json());

const PORT = process.env.PORT;

app.use('/api/auth', authRoutes);

app.use('/api/admin', userRoutes);

app.use('/api/complaints', complaintRoutes);

app.get('/',(req,res)=>{
    res.send("Hello jee, welcome to home");
})

app.listen(PORT,()=>{    
    console.log(`Server is up on port ${PORT}`);
})