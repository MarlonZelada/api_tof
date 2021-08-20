import { usuario } from "../models/user";
import { posts } from "../models/post";
import { inmueble } from "../models/inmueble";
import { media } from "../models/media";
import { comentarios } from '../models/comentario';
import {extras} from '../helpers/extras';

require('dotenv').config();

export const newComment = async (req, res) => {
    const {id_post, id_usuario_emisor, comentario, id_post_comentario_padre, tipo, id_usuario_receptor} = req.body;
    let nid_post_comentario_padre = "";

    if(!id_post){
        return res.json(
            extras.respuestaJson("E", 0, "Es necesario el id_post", "", null)
        )
    }
    if(!id_usuario_emisor){
        return res.json(
            extras.respuestaJson("E", 0, "Es necesario el id_usuario", "", null)
        )
    }
    if(!comentario){
        return res.json(
            extras.respuestaJson("E", 0, "Es necesario el comentario", "", null)
        )
    }
    if(!id_post_comentario_padre || (id_post_comentario_padre == 0)){
        nid_post_comentario_padre = null;
    }else{
        nid_post_comentario_padre = id_post_comentario_padre;
    }
    if(!tipo){
        return res.json(
            extras.respuestaJson("E", 0, "Es necesario el tipo de comentario", "", null)
        )
    }
    if(!id_usuario_receptor){
        return res.json(
            extras.respuestaJson("E", 0, "Es necesario el id_usuario_receptor", "", null)
        )
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
            return res.json(
                extras.respuestaJson("W", 0, "El Post no Existe", "", null)
            )
        }
        //Validar que exista el usuario que hace el comentario
        const buscarIdUsuarioEmisor = await usuario.fyndById(values);
        if(!buscarIdUsuarioEmisor){
            return res.json(
                extras.respuestaJson("W", 0, "El Usuario no Existe, no puede agregar comentarios", "", null)
            )
        }
        values.id_usuario_emisor = id_usuario_emisor;
        values.id = id_usuario_receptor;
        
        //validar que exista el usuario que recibe el comentario
        const buscarIdUsuarioReceptor = await usuario.fyndById(values);
        if(!buscarIdUsuarioReceptor){
            return res.json(
                extras.respuestaJson("W", 0, "El Usuario no Existe, no puede recibir comentarios", "", null)
            )
        }
        values.id_usuario_receptor = id_usuario_receptor;
        delete values.id;
        //Si se ingresa id_post_comentario_padre, validar que exista
        if(nid_post_comentario_padre){
            values.id_post_comentario = nid_post_comentario_padre;
            const buscarIdComentarioPadre = await comentarios.findMessageById(values);
            
            //Respuesta si id_post_comentario_padre no existe
            if(!buscarIdComentarioPadre){
                return res.json(
                    extras.respuestaJson("W", 0, "El id_post_comentario_padre no existe", "", null)
                )
            }
            /*Respuesta si id_post_comentario_padre no corresponde al id_post con el que se
            creo el post*/
            if(buscarIdComentarioPadre.id_post != id_post){
                console.log(buscarIdComentarioPadre.id_post, id_post);
                return res.json(
                    extras.respuestaJson("E", 0, "El id_post no corresponde con el id_post_comentario_padre", "", null)
                )
            }
            //Respuesta si el comentario correspondiente a id_post_comentario_padre ya fue eliminado
            if(buscarIdComentarioPadre.eliminado == 1){
                return res.json(
                    extras.respuestaJson("Q", 1, "El comentario de id_post_comentario_padre fue eliminado", "", null)
                )
            }
        }
        const guardarComentario = await comentarios.newComment(values);
        if(!guardarComentario){
            return res.json(
                extras.respuestaJson("E", 0, "No se creo el comentario", "", null)
            )
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
    const { id_post_comentario, id_usuario, comentario } = req.body;
    const values = {};
    
    if(!id_post_comentario){
        return res.json(
            extras.respuestaJson("W", 0, "Es necesario el id_post_comentario", "", null)
        )
    }
    if(!id_usuario){
        return res.json(
            extras.respuestaJson("W", 0, "Es necesario el id_usuario", "", null)
        )
    }
    values.id_post_comentario = id_post_comentario;
    values.id = id_usuario;
    
    async function uComment(){
        const buscarIdComentario = await comentarios.findMessageById(values);
        //Respuesta si el id_post_comentario no existe
        if(!buscarIdComentario){
            return res.json(
                extras.respuestaJson("W", 0, "El id_post_comentario no existe", "", null)
            )
        }
        //Respusta si el id_post_comentario fue eliminado
        if(buscarIdComentario.eliminado == 1){
            return res.json(
                extras.respuestaJson("Q", 1, "Este comentario ya fue eliminado", "", null)
            )
        }
        const buscarIdUsuario = await usuario.fyndById(values);
        //Respuesta si el id_usuario no existe
        if(!buscarIdUsuario){
            return res.json(
                extras.respuestaJson("W", 0, "El id_usuario no existe", "", null)
            
            )
        }
        //Verificar que el id_usuario ingresado es el mismo que hizo el comentario
        if(buscarIdComentario.id_usuario != id_usuario){
            return res.json(
                extras.respuestaJson("W", 1, "El usuario no puede modificar este comentario", "", null)
            )
        }
        //Asignacion si el comentario viene vacio
        if(!comentario){
            values.comentario = buscarIdComentario.comentario;
        }else{
            values.comentario = comentario;
        }
        const cambiarComentario = await comentarios.updateComment(values);
        if(cambiarComentario){
            return res.json(
                extras.respuestaJson("U", 1, "Mensaje Cambiado", "", null)
            )
        }else{
            return res.json(
                extras.respuestaJson("E", 0, "No se actualizo el comentario", "", null)
            )
        }
    }
    uComment();
}

export const deleteComment = async (req, res) =>{
    const {id_post_comentario, id_usuario} = req.body;
    const values = {};
    values.id_post_comentario = id_post_comentario;
    if(!id_post_comentario){
        return res.json(
            extras.respuestaJson("W", 0, "Se debe ingresar id_post_comentario", "", null)
        )
    }
    if(!id_usuario){
        return res.json(
            extras.respuestaJson("W", 0, "Se debe ingresar el id_usuario", "", null)
        )
    }
    values.id_usuario = id_usuario;
    async function dComment(){
        const buscarIdComentario = await comentarios.findMessageById(values);
        //Respuesta si el id_post_comentario no existe
        if(!buscarIdComentario){
            return res.json(
                extras.respuestaJson("W", 0, "El id_post_comentario no existe", "", null)
            )
        }
        //Respuesta si el comentario ya fue eliminado
        if(buscarIdComentario.eliminado == 1){
            return res.json(
                extras.respuestaJson("Q", 1, "Este comentario ya fue eliminado", "", null)
            )
        }
        if(buscarIdComentario.id_usuario != id_usuario){
            return res.json(
                extras.respuestaJson("W", 0, "Este usuario no puede eliminar el comentario", "", null)
            )
        }
       
        const borrarComentario = await comentarios.deleteComment(values);
        if(borrarComentario){
            return res.json(
                extras.respuestaJson("D", 1, "Comentario borrado", "", null)
            )
        }else{
            return res.json(
                extras.respuestaJson("W", 0, "No se borro el comentario", "", null)
            )
        }
    }
    dComment();
}