import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
dotenv.config();
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';

const app = express();
const port = process.env.PORT || 5000;

//global middleware
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter) 
app.listen(port,() => {
  connectDb();
  console.log(`Server is running on port ${port}`);
})