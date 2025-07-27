import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import authRoutes from './Routes/authRoutes.js'
import { connectDB } from './configfiles/database.js';



// // setup multer to where too store data 
// const storage = multer.diskStorage({
//     destination: (req,file,cb)=>{
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb)=>{
//         const suffix = new Date.now()
//         cb(null, suffix + '-' + file.originalname)
//     }
// })

// const upload = multer({storage: storage})






const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}))
app.use(express.json())
dotenv.config()
app.use(cookieParser());

const PORT = process.env.PORT || 3004

app.use('/',  authRoutes)


connectDB().then(()=>{
    console.log('connected to db');
    app.listen(PORT,()=>{
        console.log(`listing on ${process.env.PORT || PORT}`);
    }) 
}).catch((err)=>{
    console.log(err);
})



