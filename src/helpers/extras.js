
import bcrypts from 'bcryptjs';
import jwt from 'jsonwebtoken';
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

function createToken(data) {
    return new Promise((resolved, reject) => {
        const id = data.id;
        const user = data.user;
        const token = jwt.sign({ userId: id, username: user }, process.env.SECRET_JWT, { expiresIn: process.env.TOKEN_EXPIRED });
        console.log("Token", token);
        resolved(token);
    })
}
function verificationToken(data){
    return new Promise((resolved, reject) => {
        const token = data.token;
        let jwtPayload;
        
        let now = Date.now().valueOf() / 1000;
        jwtPayload = jwt.decode(token, process.env.SECRET_JWT);
        //console.log(process.env.TOKEN_EXPIRED)
        //console.log(jwtPayload.exp, now);
        //console.log(jwtPayload.exp -  now);
        
        if(jwtPayload.exp < now){
            resolved(false);
        }else{
            let val = {};
            val.id = jwtPayload.userId;
            val.user = jwtPayload.username;
            resolved(val);
        }
    })
}

function createHash(data) {
    return new Promise((resolved, reject) => {
        const password = data.password;
        bcrypts.hash(password, 10, (err, res) => {
            if (err) {
                console.log("Err in hash", err);
            } else {
                let finalHash = res.replace('$2a$', '$2y$');
                resolved(finalHash);
            }
        });
    });
}
function verificationPassword(data){
    return new Promise((resolved, reject) => {
        const password = data.password;
        const hashsaved = data.hash;
        let compare = bcrypts.compareSync(password, hashsaved);
        if(compare){
            resolved(true);
        }else {
            resolved(false);
        }
    })
}
function verificarCorreo(data){
    const password = data.user;
        
    if(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(password)){
        return(true);
    }else{
        return(false);
    }
}

function respuestaJson(msgtype, dataCount, message, redirect, customRtn) {
    const respuesta = {};
    respuesta.resultado = {
        "result": {
            msgtype,
            dataCount,
            message,
            redirect,
            customRtn 
        }
    }
    return respuesta;
}

function carpeta(id_post) {
    return new Promise((resolved, reject) => {
        const url = process.env.ROUTE_MEDIA
        const id_postURL = url+ '/'+ 'i_'  + id_post;

        if(fs.existsSync(`${id_postURL}`)){
            console.log("Ya existe el directorio");
            resolved(id_postURL);
        }else{
            fs.mkdir(`${id_postURL}`, (error) => {
                if(error){
                    console.log(error.message);
                }
                resolved(id_postURL);
            })
        }       
    })
}

function guardarArchivos(data) {
    return new Promise((resolved, reject) => {
        rutaURL = data.rutaURL;
        const storage = multer.diskStorage({
            destination:(req, file, cb)=>{
                cb(null, rutaURL)
            },
            filename: (req, file, cb) => {
                cb(null,  "A"+aleatorio() +"CDB"+ path.extname(file.originalname));
            }
        });

        const upload = multer({
            storage,
        }).array('file');
    })
}




export const extras = {
    createToken,
    verificationToken,
    createHash,
    verificationPassword,
    verificarCorreo,
    respuestaJson,
    carpeta,
    guardarArchivos
}