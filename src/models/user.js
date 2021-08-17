import conexion from '../database';
//require('dotenv').config();

function newUser(data) {
    return new Promise((resolved, reject) => {
        const name = data.name;
        const user = data.user;
        const direccion = data.direccion;
        const correo_electronico = data.user;
        const password = data.passwordH;
        const token = data.token;

        conexion.query('insert into usuario (Nombre, Username, Password, Correo_Electronico, Direccion) values (?,?,?,?,?)', [name, user, password, correo_electronico, direccion], function (err, res) {
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
      conexion.query('select *from usuario where Username = ?', [user], function(err, res){
          if(err){
              return console.log("err", err);
          }else{
              if(res.length > 0){
                let dat = {};
                dat.id = res[0].Id_Usuario;
                dat.nombre = res[0].Nombre;
                dat.usuario = res[0].Username;
                dat.direccion = res[0].Direccion;
                dat.correo_electronico = res[0].Correo_Electronico;
                dat.estado = res[0].Estado;
                dat.passwordHash = res[0].Password;
                resolved(dat);
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
        conexion.query('select *from usuario where Id_Usuario = ?', [id], function(err, res){
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
        
        conexion.query('update usuario set Estado = 1, Aprobado = 1 where Id_Usuario = ?', [id], function(err, res){
            if(err){
                return console.log("err", err);
            }else{
                resolved(true);
            }
        });
    });
}

//Cambiar el estado del ultimo token usado a 0=inactivo
function changeLastToken(data){
    return new Promise((resolved, reject) =>{
        const token = data.token;
        const user = data.user;
        const tipo_token = data.tipo_token;
        conexion.query('update token set Ultimo_Token_Usado = 0 where usuario = ? and Tipo_Token = ?', [user, tipo_token], function(err, res){
            if(err){
                return console.log("err", err);
            }else{
                resolved(true);
            }
        })
    });
}

//Guardar token nuevo
function saveToken(data){
    return new Promise((resolved, reject) => {
        const token = data.token;
        const user = data.user;
        const id_user = data.id;
        const tipo_token = data.tipo_token;
        conexion.query('insert into token (Token, Usuario, Tipo_Token) values(?, ?, ?)', [token, user, tipo_token ], function(err, res){
            if(err){
                reject(err);
            }else{
                resolved(true);
            }
        })
    })
}

//Cambiar el estato del token a 1=activo
function updateToken(data){
    return new Promise((resolved, reject) => {
        const token = data.token;
        const user = data.user;
        const tipo_token = data.tipo_token;
        conexion.query('update token set Estado_Token = 1 where Usuario = ? and Tipo_Token = ? and Ultimo_Token_Usado = 1', [user, tipo_token], function(err, res){
            if(err){
                reject(err);
            }else{
                resolved(true);
            }
        })
    })
}
//Actualizar Password
function newPassword(data) {
    return new Promise((resolved, reject) => {
        const user = data.user;
        const password = data.hash;
        conexion.query('update usuario set Password = ? where Username = ?', [password, user], function(err, res) {
            if(err){
                reject(err);
            }else{
                resolved(true);
            }
        })


    })

}

function saveTokenPassword(data){
    return new Promise((resolved, reject) => {
        const token = data.token;
        const user = data.user;
        const ultimo_uso_token = 2;
        //console.log("Token",token);
        //console.log("Usuario",user);
        //console.log("Ultimo token",ultimo_uso_token);
        conexion.query('insert into token (Token, Usuario, Tipo_Token) values(?, ?, ?)', [token, user, ultimo_uso_token], function(err, res){
            if(err){
                reject(err);
            }else{
                resolved(true);
            }
        })

    })
}




export const usuario = {
    newUser,
    newPassword,
    fyndByUser,
    fyndById,    
    saveToken,
    activateAccount,
    updateToken,
    changeLastToken,
    newPassword,
    saveTokenPassword
}