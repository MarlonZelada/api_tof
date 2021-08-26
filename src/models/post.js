import conexion from '../database';

function newPost(data){
    return new Promise((resolved, reject) => {
        const tipo = data.tipo;
        const privacidad = data.privacidad;
        const descripcion = data.descripcion;
        const id_usuario = data.id_usuario;
        const id_inmueble = data.id_inmueble;
        const id_inmueble_padre = data.id_inmueble_padre;
        const admin_post = data.admin_post;
        conexion.query(`insert into post (Tipo, Privacidad, Descripcion, Id_Usuario, Id_Inmueble, Id_Inmueble_Padre, Admin_Post) values(?, ?, ?, ?, ?, ?, ?)`, [tipo, privacidad, descripcion, id_usuario, id_inmueble, id_inmueble_padre, admin_post], function(err, res){
                if(err){
                    console.log(err);
                }else{
                    let val = {};
                    val.id_post = res.insertId;
                    resolved(val);
                }
            })
    })
}
function findPostById(data){
    return new Promise((resolved, reject) => {
        const id_post = data.id_post;
        conexion.query('select *from post where Id_Post = ?', [id_post], function(err, res){
            if(err){
                console.log(err);
            }else{
                if(res.length < 1){
                    resolved(false);
                }else{
                    const val = {};
                    val.id_post = res[0].Id_Post;
                    val.tipo = res[0].Tipo;
                    val.privacidad = res[0].Privacidad;
                    val.descripcion = res[0].Descripcion;
                    val.id_usuario = res[0].Id_Usuario;
                    val.id_inmueble = res[0].Id_Inmueble;
                    val.id_inmueble_padre = res[0].Id_Inmueble_Padre;
                    val.admin_post = res[0].Admin_Post;
                    val.eliminado = res[0].Eliminado;
                    resolved(val);
                }
            }
        })
    })
}
function updatePost(data){
    return new Promise((resolved, reject) => {
        const id_post = data.id_post;
        const tipo = data.tipo;
        const privacidad = data.privacidad;
        const descripcion = data.descripcion;
        const id_usuario = data.id_usuario;
        const id_inmueble = data.id_inmueble;
        const id_inmueble_padre = data.id_inmueble_padre;
        const admin_post = data.admin_post;
        conexion.query(`update post set Tipo=?, Privacidad=?, Descripcion=?, Admin_Post=? where Id_Post = ?`, [tipo, privacidad, descripcion, admin_post, id_post], function(err, res){
            if(err){
                console.log(err)
            }else{
                resolved(true);
            }
        })

    })
}

function deletePost(data){
    return new Promise((resolved, reject) => {
        const id_post = data.id_post;
        conexion.query('update post set Eliminado=1 where Id_Post = ?', [id_post], function(err, res){
            if(err){
                console.log(err);
            }else{
                resolved(true);
            }
        })
    })
}
function allPostComment(data) {
    return new Promise((resolved, reject) => {
        const id_post = data.id_post;
        const id_post_comentario_padre = data.id_post_comentario_padre;
        const val = {};
    
        const query1 = `select pc.Id_Post, pc.Id_Post_Comentario, pc.FechaHora_Creacion, pc.Comentario, us.Nombre
                        from post_comentario pc INNER JOIN usuario  us
                        ON pc.Id_Usuario = us.Id_Usuario
                        WHERE Id_Post_Comentario_Padre is null
                        AND Id_Post = ?
                        AND pc.Eliminado=0 `;
        const query2 = `select pc.Id_Post, pc.Id_Post_Comentario, pc.FechaHora_Creacion, pc.Comentario, us.Nombre
                        from post_comentario pc INNER JOIN usuario  us
                        ON pc.Id_Usuario = us.Id_Usuario
                        WHERE Id_Post_Comentario_Padre = ?
                        AND Id_Post = ?
                        AND pc.Eliminado=0`
        if(!id_post_comentario_padre){
            console.log("ES null");
            conexion.query(query1, [id_post], function (err, res) {
                if(err){
                    reject("error", err)
                }else{
                    for(let i=0; i<res.length; i++){
                        let valores = {}
                        valores.id_post_comentario = res[i].Id_Post_Comentario;
                        valores.comentario = res[i].Comentario;
                        valores.usuario = res[i].Nombre;
                        valores.id_post = res[i].Id_Post
                        val[i] = valores
                    }
                    resolved(val);
                }   
            })
        }else{
            console.log("NO es null");
            conexion.query(query2, [id_post_comentario_padre, id_post], function (err, res) {
                if(err){
                    reject("error", err);
                }else{
                    for(let i=0; i<res.length; i++){
                        let valores = {}
                        valores.id_post_comentario = res[i].Id_Post_Comentario;
                        valores.comentario = res[i].Comentario;
                        valores.usuario = res[i].Nombre;
                        valores.id_post = res[i].Id_Post
                        val[i] = valores
                    }
                    resolved(val);
                }                
            })
        }
        


    })    
}

export const posts = {
    newPost,
    findPostById,
    updatePost,
    deletePost,
    allPostComment
}