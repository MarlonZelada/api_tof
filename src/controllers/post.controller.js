import { usuario } from '../models/user';
import { posts } from '../models/post';
import { inmueble } from '../models/inmueble';
import { media } from '../models/media';
//import { multer } from "multer";
//import { path } from "path";


const path = require ('path');
const multer = require('multer');
require('dotenv').config();

export const newPost = async (req, res) => {

    const { tipo, privacidad, descripcion, user, id_inmueble, admin_post} = req.body;
    const values = {};

    if(!tipo){
        return res.json({
            result: ({
                "msgtype": "E",
                "dataCount": 0,
                "message": "Es necesario el tipo",
                "redirect": "",
                "customRtn": null

            })
        })
    }
    if(!privacidad){
        return res.json({
            result: ({
                "msgtype": "E",
                "dataCount": 0,
                "message": "Es necesaria la privacidad",
                "redirect": "",
                "customRtn": null

            })
        })
    }
    if(!descripcion){
        return res.json({
            result: ({
                "msgtype": "E",
                "dataCount": 0,
                "message": "Es necesaria la descripcion",
                "redirect": "",
                "customRtn": null

            })
        })
    }
    if(!user){
        return res.json({
            result: ({
                "msgtype": "E",
                "dataCount": 0,
                "message": "Es necesario el usuario",
                "redirect": "",
                "customRtn": null

            })
        })
    }
    if(!id_inmueble){
        return res.json({
            result: ({
                "msgtype": "E",
                "dataCount": 0,
                "message": "Es necesario el id_inmueble",
                "redirect": "",
                "customRtn": null

            })
        })
    }
    if(!admin_post){
        return res.json({
            result: ({
                "msgtype": "E",
                "dataCount": 0,
                "message": "Es necesario el admin_post",
                "redirect": "",
                "customRtn": null

            })
        })
    }
    values.tipo = tipo;
    values.privacidad = privacidad;
    values.descripcion = descripcion;
    values.user = user;
    values.id_inmueble = id_inmueble;
    values.admin_post = admin_post;

    async function nuevoPost (){
        const buscarIdUsuario = await usuario.fyndByUser(values);
        const buscarIdInmueble = await inmueble.buscarInmuebleId(values);
        if(!buscarIdUsuario){
            return res.json({
                result: {
                    "msgtype": "W",
                    "dataCount": 0,
                    "message": "El usuario no existe",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }
        if(!buscarIdInmueble){
            return res.json({
                result: {
                    "msgtype": "W",
                    "dataCount": 0,
                    "message": "El inmueble no existe",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }
        values.id_usuario = buscarIdUsuario.id;
        values.id_inmueble_padre = buscarIdInmueble.id_inmueble_padre;
        const nuevoPost = await posts.newPost(values);
        if(!nuevoPost){
            return res.json({
                "result": {
                    "msgtype": "E",
                    "dataCount": 0,
                    "message": "No se creo el Post",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }
        //-----------Imagenes
        values.id_post = nuevoPost.id_post;
        const tamaño = req.files.length;

        for(let i=0; i<tamaño; i++){
            const originalname = req.files[i].originalname;
            const filename = req.files[i].filename;
            const tipoArchivo = req.files[i].mimetype.split('/')[0];
            console.log("tipo archivo", tipoArchivo);
            const path = req.files[i].path;
            const size = req.files[i].size;
            const tipo = '';
            if(tipoArchivo==='image'){
                tipo = 0;
            }else if(tipoArchivo==='video'){
                tipo = 1;
            }else{
                tipo = 2;
            }
            values.tipoArchivo = tipo;
            values.filename = filename;
            values.path = path;
        
            const guardarArchivo = await media.saveMedia(values);
            if(guardarArchivo){
                console.log("Archivo Guardado");
            }else{
                console.log("Algo salio mal");
            }
        }
        //-----------Imagenes
        return res.json({
            "data": {
                "id_post": nuevoPost.id_post,
                "tipo": tipo,
                "privacidad": privacidad,
                "descripcion": descripcion,
                "id_usuario": buscarIdUsuario.id,
                "id_inmueble": id_inmueble,
                "id_inmueble_padre": buscarIdInmueble.id_inmueble_padre,
                "admin_post": admin_post
            },
            "result":{
                "msgtype": "C",
                "dataCount": 1,
                "message": "Post creado",
                "redirect": "",
                "customRtn": null
            }
        })
    }
    nuevoPost();
}

export const updatePost = async (req, res) => {
    
    const {id_post, tipo, privacidad, descripcion, user, id_inmueble, admin_post} = req.body;
    if(!id_post){
        return res.json({
            result: {
                "msgtype": "W",
                "dataCount": 0,
                "message": "El id_post es necesario",
                "redirect": "",
                "customRtn": null
            }
        });
    }
    
    const values = {};
    values.id_post = id_post;
    values.descripcion = descripcion;
    values.user = user;
    values.id_inmueble = id_inmueble;

    async function cambiarPost(){
        const buscarIdPost = await posts.findPostById(values);
        if(!buscarIdPost){
            return res.json({
                "result":{
                    "msgtype": "W",
                    "dataCount": 0,
                    "message": "El post no existe",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }
        const eliminado = buscarIdPost.eliminado;
        if(eliminado===1){
            return res.json({
                "result": {
                    "msgtype": "W",
                    "dataCount": 1,
                    "message": "El post fue eliminado",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }
        
        const buscarUsuario = await usuario.fyndByUser(values);
        if(!buscarUsuario){
            return res.json({
                "result": {
                    "msgtype": "W",
                    "dataCount": 0,
                    "message": "El usuario no existe",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }
        const id_usuario = buscarUsuario.id_usuario;
        
        const buscarInmueble = await inmueble.buscarInmuebleId(values);
        if(!buscarInmueble){
            return res.json({
                "result": {
                    "msgtype": "W",
                    "dataCount": 0,
                    "message": "El inmueble no existe",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }
        values.id_inmueble_padre = buscarInmueble.id_inmueble_padre;
        
        if(tipo || tipo == 0){
            values.tipo = tipo;
        }else{
            values.tipo = buscarIdPost.tipo;
        }
        
        if(privacidad || privacidad == 0){
            values.privacidad = privacidad;
        }else{
            values.privacidad = buscarIdPost.privacidad;
        }

        if(!descripcion){
            values.descripcion = buscarIdPost.descripcion;
        }
        
        if(admin_post || admin_post == 0){
            values.admin_post = admin_post;
        }else{
            values.admin_post = buscarIdPost.admin_post;
        }
        const guardarCambiosPost = await posts.updatePost(values);
        
        if(guardarCambiosPost){
            return res.json({
                "data": {
                    "id_post": id_post,
                    "tipo": values.tipo,
                    "privacidad": values.privacidad,
                    "descripcion": values.descripcion,
                    "id_usuario": id_usuario,
                    "id_inmueble": id_inmueble,
                    "id_inmueble_padre": values.id_inmueble_padre,
                    "admin_post": values.admin_post
                },
                "result": {
                    "msgtype": "U",
                    "dataCount": 1,
                    "message": "Post actualizado",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }else{
            return res.json({
                "result": {
                    "msgtype": "E",
                    "dataCount": 0,
                    "message": "No se actualizo el post",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }
    }
    cambiarPost();
}

export const deletePost = async (req, res) => {
    const { id_post, user } = req.body;

    if(!id_post){
        return res.json({
            "result": {
                "msgtype": "E",
                "dataCount": 0,
                "message": "Se debe ingresar el id_post",
                "redirect": "",
                "customRtn": null
            }
        })
    }
    if(!user){
        return res.json({
            "result": {
                "msgtype": "E",
                "dataCount": 0,
                "message": "Se debe ingresar el usuario",
                "redirect": "",
                "customRtn": null
            }
        })
    }

    const values = {};
    values.id_post = id_post;
    values.user = user;

    async function borrarPost(){
        const buscarIdPost = await posts.findPostById(values);
        if(!buscarIdPost){
            return res.json({
                "result": {
                    "msgtype": "W",
                    "dataCount": 0,
                    "message": "El post no existe",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }
        const id_usuario_post = buscarIdPost.id_usuario;
    
        const buscarUsuario = await usuario.fyndByUser(values);
        if(!buscarUsuario){
            return res.json({
                "result": {
                    "msgtype": "W",
                    "dataCount": 0,
                    "message": "El usuario no existe",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }
        const id_usuario = buscarUsuario.id;
        if(id_usuario !== id_usuario_post){
            return res.json({
                "result": {
                    "msgtype": "W",
                    "dataCount": 0,
                    "message": "El usuario no puede eliminar este post",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }
        const eliminarPost = await posts.deletePost(values);
        if(eliminarPost){
            const eliminarPostMedia = await media.deletePostMedia(values);
            if(eliminarPostMedia){
                return res.json({
                    "result": {
                        "msgtype": "D",
                        "dataCount": 1,
                        "message": "Post eliminado",
                        "redirect": "",
                        "customRtn": null
                    }
                })

            }
        }else{
            return res.json({
                "result": {
                    "msgtype": "E",
                    "dataCount": 0,
                    "message": "No se elimino el post",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }

    }
    borrarPost();
}

export const imagen = async (req, res) => {

    const {id} = req.body;
    const values = {};
    values.id = id;

    
    console.log("id",id);
    
    
    const tamaño = req.files.length;
    console.log("Cantidad archivos", tamaño);
    for(let i=0; i<tamaño; i++){
        const originalname = req.files[i].originalname;
        const filename = req.files[i].filename;
        const tipoArchivo = req.files[i].mimetype.split('/')[0];
        console.log("tipo archivo", tipoArchivo);
        const path = req.files[i].path;
        const size = req.files[i].size;
        console.log("Nombre Archivo",filename);
        const tipo = '';
        if(tipoArchivo==='image'){
            console.log("Es una imagen");
            tipo = 0;
        }else if(tipoArchivo==='video'){
            console.log("Es un Video")
            tipo = 1;
        }else{
            console.log("No valido");
            tipo = 2;
        }
        values.tipoArchivo = tipo;
        values.filename = filename;
        values.path = path;

        async function nuevoArchivo(){
            const guardarArchivo = await media.saveMedia(values);
            if(guardarArchivo){
                console.log("Archivo Guardado");
            }else{
                console.log("Algo salio mal");
            }
        }
        nuevoArchivo();





    }
    
    res.send(req.files);
   
    
}