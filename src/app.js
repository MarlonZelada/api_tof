import express from 'express';
import morgan from 'morgan';
import pkg from '../package.json';
import userRoutes from './routes/user.routes';
require('dotenv').config();

const app = express();
//app.set('pkg', pkg);




//app.use(morgan('dev'));

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




export default app;