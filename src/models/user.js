import conexion from '../database';
//require('dotenv').config();

function newUser(data) {
    return new Promise((resolved, reject) => {
        const name = data.name;
        const user = data.user;
        const password = data.passwordH;
        const token = data.token;

        conexion.query('insert into usuario (nombre, usuario, password) values (?,?,?)', [name, user, password], function (err, res) {
            if (err) {
                return console.log("err", err);
            } else {
                let val = {};
                val.id = res.insertId;
                resolved(val);
            }
        });

    });
}
function fyndByUser(data){
  return new Promise((resolved, reject) =>{
      const user = data.user;
      conexion.query('select *from usuario where usuario = ?', [user], function(err, res){
          if(err){
              return console.log("err", err);
          }else{
              if(res.length > 0){
                  resolved(true);
              }else{
                  resolved(false);
              }
          }
      })
  });
}

function fyndById(data){
    return new Promise((resolved, reject) => {
        const id = data.id;
        console.log("id fynd", id);
        conexion.query('select *from usuario where id_usuario = ?', [id], function(err, res){
            if(err){
                return console.log("err fyndById", err);
            }else{
                if(res.length > 0){
                    resolved(true);
                }else{
                    resolved(false);
                }
            }
        })
    });
}

function activateAccount(data){
    return new Promise((resolved, reject) => {
        const id= data.id;
        console.log("id activate", id);
        conexion.query('update usuario set estado = 1 where id_usuario = ?', [id], function(err, res){
            if(err){
                return console.log("err", err);
            }else{
                resolved(true);
            }
        });
    });
}

function saveToken(data){
    return new Promise((resolved, reject) =>{
        const token = data.token;
        const user = data.user;
        conexion.query('update usuario set token = ? where usuario = ?', [token, user], function(err, res){
            if(err){
                return console.log("err", err);
            }else{
                resolved(true);
            }
        })
    });
}
function newPassword() {

}

export const usuario = {
    newUser,
    newPassword,
    fyndByUser,
    fyndById,    
    saveToken,
    activateAccount
}