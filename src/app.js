import express from 'express';
import morgan from 'morgan';
import pkg from '../package.json';
import userRoutes from './routes/user.routes';
import postRoutes from './routes/post.routes';
import cometarioRouter from './routes/comentario.router';
import { fileURLToPath } from 'url';
import multer from 'multer';
import path from 'path';
import { extras } from './helpers/extras';



require('dotenv').config();

const app = express();
//app.set('pkg', pkg);

function aleatorio() {
    const max = 999999, min=100000
    const num= Math.floor(Math.random()*(max-min+1))+min;
    return num;
}

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, process.env.ROUTE_MEDIA)
    },
    filename: (req, file, cb) => {
        //cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
        //cb(null, file.originalname+ path.extname(file.originalname));
        cb(null,  "A"+aleatorio() +"CDB"+ path.extname(file.originalname));
    }
});
const upload = multer({ 
    storage,
    /*fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimetype = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));
        //if(mimetype && extname){
        //    return cb(null, true);
        //}
        //cb("Error, archivo invalido");
    },*/
    //limits: {fileSize: process.env.FILE_SIZE_IMAGE}
    limits: {fileSize: 1000000}
    
 }).array('file');


//app.use(morgan('dev'));
app.use(upload);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.get('/', (req, res) => {
    res.json({
        name: pkg.name,
        author: pkg.author,
        description: pkg.description,
        version: pkg.version
    });
});

//Routes
app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/comentario', cometarioRouter);




export default app;