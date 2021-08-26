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
import { error, log } from 'console';


require('dotenv').config();

const app = express();
//app.set('pkg', pkg);








function aleatorio() {
    const max = 999999, min=100000
    const num= Math.floor(Math.random()*(max-min+1))+min;
    return num;
}




//app.use(morgan('dev'));
//app.use(upload);
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
