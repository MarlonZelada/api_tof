//import { express } from "express";
import { extras } from "../middlewares/extras";
import { usuario } from "../models/user";
import { email } from "../middlewares/email";
const jwt = require('jsonwebtoken');
        

export const newUser = async (req, res) => {
    const { name, user, password } = req.body;
 
    //console.log(name, user, password);

    const values = {};
    values.name = name;
    values.user = user;
    values.password = password;

    async function newU() {
        const fyndUser = await usuario.fyndByUser(values);

        if(!fyndUser){
            const hash = await extras.createHash(values);
            values.passwordH = hash;

            const insert = await usuario.newUser(values);
            const id = insert.id;
            values.id = insert.id;

            const token = await extras.createToken(values);
            values.token = token;

            const savedToken = await usuario.saveToken(values);

            const verificationLink = `http://localhost:3000/activate_account/${token}`;
            /*let info = await email.transporter.sendMail({
                from: '"Fred Foo 👻" <marlon.zelada@gmail.com>', // sender address
                to: user, // list of receivers
                subject: "Confirmar Correo ✔", // Subject line
                text: `Bienvenido a Todogar ${name}`, // plain text body
                html: `<b>Bienvenido a Todogar </b>
                        ${name}
                        <b>, click en el siguiente enlace para activar tu cuenta </b> </>
                        ${verificationLink}`, // html body
            });*/
            if(savedToken){
                res.status(200).json({
                    message: "New User OK",
                    name,
                    user,
                })

            }
        }else{
            res.status(200).json({
                message: "User already exists"
            })
        }
    }
    newU();
}

export const activate_account = async (req, res) => {
    const token = req.headers.activate;
   const values = {};
    values.token = token;
 
    if(!(token)){
        res.status(400).json({
            message: 'All the fields are required'
        });
    }

    async function verificar(){
        const tokenExiste = await extras.verificationToken(values);
        if(!(tokenExiste)){
            res.status(400).json({
                message: 'Expired token'
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
                        if(activate){
                            res.status(200).json({
                                message: 'Account activated'
                            });
                        }else{
                            
                            console.log("No se pudo");
                        }
                }
            }
        }
    }
    verificar();
}

export const login = async (req, res) => {
    res.status(200).json({
        message: "Login OK"
    })
}

export const recoveryPassword = async (req, res) => {
    res.status(200).json({
        message: "Recovery Password OK"
    })
}