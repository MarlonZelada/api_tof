import conexion from '../database';

function newComment(data){
    return new Promise((resolved, reject) => {
        const {id_post, comentario, tipo, id_post_comentario_padre, id_usuario_emisor, id_usuario_receptor}= data;
        conexion.query('insert into post_comentario(Id_Post, Id_Usuario, FechaHora_Creacion, Comentario, Id_Post_Comentario_Padre, Tipo, Id_Usuario_Receptor) values(?,?,now(),?,?,?,?)', [id_post, id_usuario_emisor, comentario, id_post_comentario_padre,tipo, id_usuario_receptor ], function(err, res){
            if(err){
                console.log("err", err)
            }else{
                let val = {};
                val.id = res.insertId;
                resolved(val);
            }

        })
    })
}
function updateComment(data){
    return new Promise((resolved, reject) => {
        const id_post_comentario = data.id_post_comentario;
        const comentario = data.comentario;
        conexion.query('update post_comentario set Comentario = ?, FechaHora_Actualizacion = now() where Id_Post_Comentario = ?', [comentario, id_post_comentario], function(err, res){
            if(err){
                console.log("error", err);
            }else{
                resolved(true);

            }
        })
    })

}
function deleteComment(data){
    return new Promise((resolved, reject) => {
        const id_post_comentario = data.id_post_comentario;
        conexion.query('update post_comentario set Eliminado = 1, FechaHora_Actualizacion = now() where Id_Post_Comentario = ?', [id_post_comentario], function(err, res){
            if(err){
                console.log("error", err)
            }else{
                resolved(true);
            }
        })
    })

}
function findMessageById(data){
    return new Promise((resolved, reject) => {
        const id_post_comentario = data.id_post_comentario;
        conexion.query('select *from post_comentario where Id_Post_Comentario = ?', [id_post_comentario], function(err, res){
            if(err){
                console.log("error", err);
            }else{
                if(res.length < 1){
                    resolved(false);
                }else{
                    const val = {};
                    val.id_post = res[0].Id_Post;
                    val.id_usuario = res[0].Id_Usuario;
                    val.eliminado = res[0].Eliminado;
                    val.fechaHora_Creacion = res[0].FechaHora_Creacion;
                    val.comentario = res[0].Comentario;
                    val.id_post_comentario_padre = res[0].Id_Post_Comentario_Padre;
                    val.tipo = res[0].Tipo;
                    val.id_usuario_receptor = res[0].Id_Usuario_Receptor;
                    resolved(val);
                }
            }
        })
    })
}

export const comentarios = {
    newComment,
    updateComment,
    deleteComment,
    findMessageById
}