import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import mongoose, { mongo } from 'mongoose';
import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/user.routes.js'


dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.static("uploads"))

app.use(postRoutes);
app.use(userRoutes);


const start = async () => {
    await mongoose.connect("mongodb+srv://adityakrsingh4455:2Ocl64p1coe69nDI@linkedin.7ggjl.mongodb.net/?retryWrites=true&w=majority&appName=LinkedIn").then(()=>{
        console.log("connected");
    })

    app.listen(8080, ()=>{
        console.log("listening to port 8080")
    })
};
start();
