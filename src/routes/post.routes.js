import { Router } from "express";
import * as postCtrl from '../controllers/post.controller'
const router = Router();
require('dotenv').config();


//------------
//const path = require ('path');
//const multer = require('multer');
//const tamañoArchivo = process.env.FILE_SIZE_IMAGE

/*let storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        //cb(null, './src/medias')
        cb(null, process.env.ROUTE_MEDIA)
    },
    filename: (req, file, cb) => {
        //cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
        
        cb(null, file.originalname+ path.extname(file.originalname));
    }
});
const upload = multer({ 
    storage,
    //limits: {fileSize: process.env.FILE_SIZE_IMAGE}
    limits: {fileSize: 1000000}
    
 }).single('file');
 console.log("tamaño archivo 2",tamañoArchivo)
 




//------------*/



router.post('/', postCtrl.newPost);

router.put('/', postCtrl.updatePost);

router.delete('/', postCtrl.deletePost);

router.get('/',  postCtrl.imagen);


export default router;