//import { express } from "express";
import { extras } from "../helpers/extras";
import { usuario } from "../models/user";
import { email } from "../helpers/email";
const jwt = require('jsonwebtoken');
require('dotenv').config();
        
export const newUser = async (req, res) => {
    const { name, user, password, direccion } = req.body;
    const values = {};
    if(!name){
        return res.json({
            result:{
                "msgtype": "E",
                "dataCount": 0,
                "message": "Debes ingresar un Nombre correcto",
                "redirect": "",
                "customRtn": null                        
            }
        })
    }
    if(!user){
        return res.json({
            result:{
                "msgtype": "E",
                "dataCount": 0,
                "message": "Debes ingresar un Usuario correcto",
                "redirect": "",
                "customRtn": null                        
            }
        })
    }
    if(!password){
        return res.json({
            result:{
                "msgtype": "E",
                "dataCount": 0,
                "message": "Debes ingresar un Password",
                "redirect": "",
                "customRtn": null                        
            }
        })
    }
    if(!direccion){
        return res.json({
            result:{
                "msgtype": "E",
                "dataCount": 0,
                "message": "Debes ingresar una Direccion correcta",
                "redirect": "",
                "customRtn": null                        
            }
        })
    }
    
    values.name = name;
    values.user = user;
    values.password = password;
    values.direccion = direccion;

    const veri = extras.verificarCorreo(values);

    async function newU() {
        if(veri){
            const fyndUser = await usuario.fyndByUser(values);
            
            if(!fyndUser){
                const hash = await extras.createHash(values);
                values.passwordH = hash;

                const insert = await usuario.newUser(values);
                const id = insert.id;
                values.id = insert.id;
                values.tipo_token = 1;

                const updateLastToken = await usuario.changeLastToken(values);

                
                const token = await extras.createToken(values);
                values.token = token;
                

                const savedToken = await usuario.saveToken(values);
                const url_host = process.env.URL_HOST;
                const url_activar = process.env.ACTIVAR_CUENTA

                const verificationLink = `http://${url_host}/user/${token}`;
                let info = await email.transporter.sendMail({
                    from: '"Fred Foo 👻" <marlon.zelada@gmail.com>', // sender address
                    to: user, // list of receivers
                    subject: "Confirmar Correo ✔", // Subject line
                    text: `Bienvenido a Todogar ${name}`, // plain text body
                    html: `<b>Bienvenido a Todogar </b>
                            ${name}
                            <b>, click en el siguiente enlace para activar tu cuenta </b> </>
                            ${verificationLink}`, // html body
                });
                if(savedToken){
                    res.json({
                        result:{
                            "msgtype": "C",
                            "dataCount": 1,
                            "message": "Usuario Creado",
                            "redirect": "",
                            "customRtn": {
                                "idNuevo" : insert.id
                            }                        }
                    })
                }
            }else{
                res.json({
                    data:{
                        "id": fyndUser.id,
                        "nombre": fyndUser.nombre,
                        "usuario": fyndUser.usuario,
                        "direccion": fyndUser.direccion
                    },
                    result:{
                        "msgtype": "W",
                        "dataCount": 0,
                        "message": "User already exists",
                        "redirect": "",
                        "customRtn": null
                    }
                })
            }
        }else{
            res.json({
                result:{
                    "msgtype": "E",
                    "dataCount": 0,
                    "message": "The user is not correct",
                    "redirect": "",
                    "customRtn": null
                }
            })
        }
    }
    newU();
}

export const activate_account = async (req, res) => {
    const token = req.params.token;
    const values = {};
    values.token = token;
 
    if(!(token)){
        res.json({
            "result": {
                "msgtype": "E",
                "dataCount": 0,
                "message": "Son necesarios todos los Campos",
                "redirect": "",
                "customRtn": null
            }
        });
    }
    async function verificar(){
        const tokenExiste = await extras.verificationToken(values);
        if(!(tokenExiste)){
            res.json({
                "result" : {
                    "msgtype": "E",
                    "dataCount": 0,
                    "message": "Token expirado",
                    "redirect": "",
                    "customRtn": null
                },
            });
        }else{
            values.id = tokenExiste.id;
            values.user = tokenExiste.user;
            const idExist = await usuario.fyndById(values);
            if (!idExist){
                res.status(400).json({
                    message: 'Id is wrong'
                });
            }else{
                const userExist = await usuario.fyndByUser(values);
                if(!userExist){
                    res.status(400).json({
                        message: 'User is wrong'
                    });
                }else{
                    const activate = await usuario.activateAccount(values);
                    values.tipo_token = 1;
                    if(activate){
                        const upToken = await usuario.updateToken(values);
                        if(upToken){
                            res.json({
                                "result" : {
                                    "msgtype": "U",
                                    "dataCount": 3,
                                    "message": "Cuenta activada",
                                    "redirect": "",
                                    "customRtn": null
                                },
                            });
                       }else{
                            res.json({
                                "result" : ({
                                    "msgtype": "E",
                                    "dataCount": 0,
                                    "message": "No se pudo Activar la Cuenta",
                                    "redirect": "",
                                    "customRtn": null
                                })
                            })
                        }
                    }else{
                        res.json({
                            "result" : ({
                                "msgtype": "E",
                                "dataCount": 0,
                                "message": "No se guardo el Token",
                                "redirect": "",
                                "customRtn": null
                            })
                        })    
                    }
                }
            }
        }
    }
    verificar();
}

export const login = async (req, res) => {
    const { user, password } = req.body;
    const values = {};
    
    //Validate if the fields are not empty
    if(!(user && password)){
        res.json({
            "result":{
                "msgtype": "E",
                "dataCount": 0,
                "message": "Todos los campos son requeridos",
                "redirect": "",
                "customRtn": null
            }
        });
    }
    values.user = user;
    values.password = password;
    async function findLogin (){
        const findUser = await usuario.fyndByUser(values);
        //Validate if user exists
        if(findUser.usuario){
            values.hash = findUser.passwordHash;
            const estado = findUser.estado;
            const findPassword = await extras.verificationPassword(values);
            //Validate if the password is correct
            if(findPassword && (estado === 1)){
                res.json({
                    "data": {
                        "id": findUser.id,
                        "nombre": findUser.nombre,
                        "usuario": findUser.usuario,
                        "direccion": findUser.direccion,
                        "Correo Electronico": findUser.correo_electronico
                    },
                    "result": {
                        "msgtype": "Q",
                        "dataCount": 1,
                        "message":  "Welcome",
                        "redirect": "",
                        "customRtn":{
                            "IdUsuario": findUser.id
                        }
                    }
                })
            }else{
                res.json({
                    "result" : {
                        "msgtype": "E",
                        "dataCount": 0,
                        "message": "Usuario o Password Incorrectos",
                        "redirect": "",
                        "customRtn": null
                    }
                });
            }
        }else{
            res.json({
                "result" : {
                    "msgtype": "E",
                    "dataCount": 0,
                    "message": "Usuario o Password Incorrectos",
                    "redirect": "",
                    "customRtn": null
                }
            });
        }
    }
    findLogin();
}

export const recoveryPassword = async (req, res) => {
    const {user} = req.body;
    if(!user){
        return res.status(200).json({
            message: "En necesario el usuario"
        })
    }
    const values = {};
    values.user = user;
    async function restablecerCon (){
        const usu= await usuario.fyndByUser(values);
        if(!usu){
            console.log("El usuario no Existe");
        }else{
            const newTokenUser = await extras.createToken(values);
            values.token = newTokenUser;
            values.user = usu.usuario;
            values.tipo_token = 2;
            const name = usu.nombre;
            const updateLastToken = await usuario.changeLastToken(values);
            if(!(updateLastToken)){
                return res.json({
                    "result" : {
                        "msgtype": "E",
                        "dataCount": 0,
                        "message": "Algo salio mal al actualizar el Token",
                        "redirect": "",
                        "customRtn": null
                    }
                });
            }
            const savedTokenPassword = await usuario.saveToken(values);
            if(savedTokenPassword){
                const url_recuperar_password = process.env.RECUPERAR_PASSWORD;
                const url_host = process.env.URL_HOST;
                const nPassword = process.env.NPASSWORD;
                console.log(nPassword);
                const verificationLink = `http://${url_host}/${nPassword}/${newTokenUser}`;
                let info = await email.transporter.sendMail({
                    from: '"Fred Foo 👻" <marlon.zelada@gmail.com>', // sender address
                    to: user, // list of receivers
                    subject: "Recuperar Password ✔", // Subject line
                    text: `Bienvenido a Todogar ${name}`, // plain text body
                    html: `<b>Bienvenido a Todogar </b>
                    ${name}
                    <b>, click en el siguiente enlace para actualizar tu password </b> </>
                    ${verificationLink}`, // html body
                });
                return res.json({
                    "result" : {
                        "msgtype": "U",
                        "dataCount": 0,
                        "message": "Token para recuperar password guardado",
                        "redirect": "",
                        "customRtn": null
                    }
                });
            }else{
                return res.json({
                    "result" : {
                        "msgtype": "E",
                        "dataCount": 0,
                        "message": "Algo salio mal al guardar el Token",
                        "redirect": "",
                        "customRtn": null
                    }
                });
            }
            
        }
    }
    restablecerCon();
}

export const changePassword = async (req, res) => {
    const token = req.params.token;

    console.log(token)
    
    
    const values = {};
    values.token = token;
    values.tipo_token = 2;

    if(!(token)){
        return res.json({
            "result": {
                "msgtype": "E",
                "dataCount": 0,
                "message": "Son necesarios todos los Campos",
                "redirect": "",
                "customRtn": null
            }
        });
    }
    async function nPassword(){
        const tokenExiste = await extras.verificationToken(values);
        if(!(tokenExiste)){
            return res.json({
                "result" : {
                    "msgtype" : "E",
                    "dataCount" : 0,
                    "message" : "Token expirado",
                    "redirect" : "",
                    "customRtn" : null
                }
            })
        }else{
            const user = tokenExiste.user;
            values.user = user;
            const mUser = tokenExiste.user;
            const url_host = process.env.URL_HOST;
            const url_password = process.env.PASSWORD_NUEVO;
            const redirect = `http://${url_host}/${url_password}`;
            console.log(redirect);
            const upToken = await usuario.updateToken(values);
            if(upToken){
                return res.json({
                    "data" : {
                        "user" : mUser
                    },
                    "result" : {
                        "msgtype": "U",
                        "dataCount": 3,
                        "message": "Token Correcto",
                        "redirect": redirect,
                        "customRtn": null
                    },
                });
            }else{
                return res.json({
                    "result" : ({
                        "msgtype": "E",
                        "dataCount": 0,
                        "message": "El token no es valido",
                        "redirect": "",
                        "customRtn": null
                    })
                })
            }
        }
    }
    nPassword();
}

export const newPassword = async (req, res) => {
    const {user, password, confirmarPassword} = req.body;
    const values = {};
    values.user = user;
    values.password = password;
    if(!user){
        return res.json({
            "result" : ({
                "msgtype": "E",
                "dataCount": 0,
                "message": "Se requiere ingresar Usuario",
                "redirect": "",
                "customRtn": null
            })
        })
    }
    if(!password){
        return res.json({
            "result" : ({
                "msgtype": "E",
                "dataCount": 0,
                "message": "Se requiere ingresar Password",
                "redirect": "",
                "customRtn": null
            })
        })
    }
    if(!confirmarPassword){
        return res.json({
            "result" : ({
                "msgtype": "E",
                "dataCount": 0,
                "message": "Se requiere ingresar Confirmar Password",
                "redirect": "",
                "customRtn": null
            })
        })
    }
    if(password !== confirmarPassword){
        return res.json({
                    "result" : ({
                        "msgtype": "E",
                        "dataCount": 0,
                        "message": "Los password no son iguales",
                        "redirect": "",
                        "customRtn": null
                    })
                })
    }

    async function nPassword(){
        const hash = await extras.createHash(values);
        values.hash = hash;
        const cambio = await usuario.newPassword(values);
        if(cambio){
            return res.json({
                "result" : ({
                    "msgtype": "U",
                    "dataCount": 1,
                    "message": "Password actualizado",
                    "redirect": "",
                    "customRtn": null
                })
            })
        //console.log("Password actualizado");
    }else{
        return res.json({
            "result": ({
                "msgtype": "E",
                "dataCount": 0,
                "message": "No se actualizo el Password",
                "redirect": "",
                "customRtn": null
            })
        })
        //console.log("No se actualizo");
    }

    }
nPassword();
    

}

export const hola = async (req, res) => {

    const id = req.params.id;
    console.log(id);

    console.log("hola");
    res.json({
        message: "hola"
    })

}