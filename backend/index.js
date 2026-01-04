import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
dotenv.config();

const port = process.env.PORT || 5000;
const app = express();
app.listen(port,() => {
  connectDb();
  console.log(`Server is running on port ${port}`);
})