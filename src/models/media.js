import conexion from '../database'

function saveMedia(data){
    return new Promise((resolved, reject) => {

        const tipo = data.tipoArchivo;
        const id_post = data.id_post;
        const filename = data.filename;
        const path = data.path;
        conexion.query('insert into post_media (Id_Post, Tipo, Data, FechaHora_Creacion) values (?,?,?,now())',[id_post, tipo, path], function(err, res){
            if(err){
                console.log("Error", err)
            }else{
                resolved(true);
            }

        })

    })
}
function updateMedia(data){
    return new Promise((resolved, reject) => {

    })
}
function deletePostMedia(data){
    return new Promise((resolved, reject) => {
        const id_post = data.id_post;
        conexion.query('update post_media set Eliminado=1, FechaHora_Actualizacion=now() where Id_Post = ?', [id_post], function(err, res){
            if(err){
                console.log("Error", err)
            }else{
                resolved(true);
            }
        })

    })
}

export const media = {
    saveMedia,
    updateMedia,
    deletePostMedia
}