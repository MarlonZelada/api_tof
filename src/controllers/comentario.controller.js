import { usuario } from "../models/user";
import { posts } from "../models/post";
import { inmueble } from "../models/inmueble";
import { media } from "../models/media";
import { comentarios } from '../models/comentario';

require('dotenv').config();

export const newComment = async (req, res) => {
    const {id_post, id_usuario_emisor, comentario, id_post_comentario_padre, tipo, id_usuario_receptor} = req.body;
    let nid_post_comentario_padre = "";

    if(!id_post){
        return res.json({
            "result":{
                "msgtype": "E",
                "dataCount": 0,
                "message": "Es necesario el id_post",
                "redirect": "",
                "customRtn": null
            }
        })
    }
    if(!id_usuario_emisor){
        return res.json({
            "result":{
                "msgtype": "E",
                "dataCount": 0,
                "message": "Es necesario el id_usuario",
                "redirect": "",
                "customRtn": null
            }
        })
    }
    if(!comentario){
        return res.json({
            "result":{
                "msgtype": "E",
                "dataCount": 0,
                "message": "Es necesario el comentario",
                "redirect": "",
                "customRtn": null
            }
        })
    }
    if(!id_post_comentario_padre || (id_post_comentario_padre == 0)){
        nid_post_comentario_padre = null;
    }else{
        nid_post_comentario_padre = id_post_comentario_padre;
    }
    if(!tipo){
        return res.json({
            "result":{
                "msgtype": "E",
                "dataCount": 0,
                "message": "Es necesario el tipo de comentario",
                "redirect": "",
                "customRtn": null
            }
        })
    }
    if(!id_usuario_receptor){
        return res.json({
            "result":{
                "msgtype": "E",
                "dataCount": 0,
                "message": "Es necesario el id_usuario_receptor",
                "redirect": "",
                "customRtn": null
            }
        })
    }
    const values = {};
    values.id_post = id_post;
    values.id = id_usuario_emisor;
    values.comentario = comentario;
    values.tipo = tipo;
    values.id_post_comentario_padre = nid_post_comentario_padre;
    
    async function nComentario(){
        const buscarIdPost = await posts.findPostById(values);
        if(!buscarIdPost){
            return res.json({
                "result":{
                    "msgtype": "W",
                    "dataCount": 0,
                    "message": "El Post no Existe",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }
        //Validar que exista el usuario que hace el comentario
        const buscarIdUsuarioEmisor = await usuario.fyndById(values);
        if(!buscarIdUsuarioEmisor){
            return res.json({
                "result":{
                    "msgtype": "W",
                    "dataCount": 0,
                    "message": "El Usuario no Existe, no puede agregar comentarios",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }
        values.id_usuario_emisor = id_usuario_emisor;
        values.id = id_usuario_receptor;
        
        //validar que exista el usuario que recibe el comentario
        const buscarIdUsuarioReceptor = await usuario.fyndById(values);
        if(!buscarIdUsuarioReceptor){
            return res.json({
                "result":{
                    "msgtype": "W",
                    "dataCount": 0,
                    "message": "El Usuario no Existe, no puede recibir comentarios",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }
        values.id_usuario_receptor = id_usuario_receptor;
        delete values.id;
        //Si se ingresa id_post_comentario_padre, validar que exista
        if(nid_post_comentario_padre){
            values.id_post_comentario = nid_post_comentario_padre;
            const buscarIdComentarioPadre = await comentarios.findMessageById(values);
            
            //Respuesta si id_post_comentario_padre no existe
            if(!buscarIdComentarioPadre){
                return res.json({
                    "result": {
                        "msgtype": "W",
                        "dataCount": 0,
                        "message": "El id_post_comentario_padre no existe",
                        "redirect": "",
                        "customRtn": null
                    }
                })
            }
            /*Respuesta si id_post_comentario_padre no corresponde al id_post con el se
            creo el post*/
            if(buscarIdComentarioPadre.id_post != id_post){
                console.log(buscarIdComentarioPadre.id_post, id_post);
                return res.json({
                    "result": {
                        "msgtype": "E",
                        "dataCount": 0,
                        "message": "El id_post no corresponde con el id_post_comentario_padre",
                        "redirect": "",
                        "customRtn": null
                    }
                })
            }
            //Respuesta si el comentario correspondiente a id_post_comentario_padre ya fue eliminado
            if(buscarIdComentarioPadre.eliminado == 1){
                return res.json({
                    "result": {
                        "msgtype": "Q",
                        "dataCount": 1,
                        "message": "El comentario de id_post_comentario_padre fue eliminado",
                        "redirect": "",
                        "customRtn": null
                    }
                })
            }
        }
        const guardarComentario = await comentarios.newComment(values);
        if(!guardarComentario){
            return res.json({
                "result":{
                    "msgtype": "E",
                    "dataCount": 0,
                    "message": "No se creo el comentario",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }else{
            const id_comentario = guardarComentario.id;
            return res.json({
                "data":{
                    "id_comentario": id_comentario,
                    "id_post": id_post,
                    "id_usuario": id_usuario_emisor,
                    "comentario": comentario,
                    "id_comentario_padre": nid_post_comentario_padre,
                    "tipo": tipo,
                    "id_usuario_receptor": id_usuario_receptor
                },
                "result":{
                    "msgtype": "C",
                    "dataCount": 1,
                    "message": "Comentario creado",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }
    }
    nComentario();
}

export const updateComment = async (req, res) => {

}

export const deleteComment = async (req, res) =>{
    const {id_post_comentario} = req.body;
    const values = {};
    values.id_post_comentario = id_post_comentario;
    if(!id_post_comentario){
        return res.json({
            "result":{
                "msgtype": "W",
                "dataCount": 0,
                "message": "Se debe ingresar id_post_comentario",
                "redirect": "",
                "customRtn": null
            }
        })
    }
    async function dComment(){
        const buscarIdComentario = await comentarios.findMessageById(values);
        if(!buscarIdComentario){
            return res.json({
                "result": {
                    "msgtype": "W",
                    "dataCount": 0,
                    "message": "El id_post_comentario no existe",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }
        if(buscarIdComentario.eliminado == 1){
            return res.json({
                "result":{
                    "msgtype": "Q",
                    "dataCount": 1,
                    "message": "Este comentario ya fue eliminado",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }
       
        const borrarComentario = await comentarios.deleteComment(values);
        if(borrarComentario){
            return res.json({
                "result":{
                    "msgtype": "D",
                    "dataCount": 1,
                    "message": "Comentario borrado",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }else{
            return res.json({
                "result": {
                    "msgtype": "W",
                    "dataCount": 0,
                    "message": "No se borro el comentario",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }
    }
    dComment();
}