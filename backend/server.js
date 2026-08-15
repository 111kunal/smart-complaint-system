import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'

dotenv.config();
await connectDB();

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

// app.use('/api',users);

app.get('/',(req,res)=>{
    console.log("i am inside the home page");
    res.send("Hello jee, welcome to home");
})

app.listen(PORT,()=>{    
    console.log(`Server is up on port ${PORT}`);
})