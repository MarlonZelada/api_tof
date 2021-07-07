
import bcrypts from 'bcryptjs';
import jwt from 'jsonwebtoken';

function createToken(data) {
    return new Promise((resolved, reject) => {
        const id = data.id;
        const user = data.user;
        const token = jwt.sign({ userId: id, username: user }, "todogar", { expiresIn: '10m' });
        console.log("Token", token);
        resolved(token);
    })
}
function verificationToken(data){
    return new Promise((resolved, reject) => {
        const token = data.token;
        let jwtPayload;
        
        let now = Date.now().valueOf() / 1000;
        jwtPayload = jwt.decode(token, "todogar");
        
        if(jwtPayload.exp < now){
            resolved(false);
        }else{
            let val = {};
            val.id = jwtPayload.userId;
            val.user = jwtPayload.username;
            resolved(val);
        }
    })
}

function createHash(data) {
    return new Promise((resolved, reject) => {
        const password = data.password;
        bcrypts.hash(password, 10, (err, res) => {
            if (err) {
                console.log("Err in hash", err);
            } else {
                let finalHash = res.replace('$2a$', '$2y$');
                resolved(finalHash);
            }
        });
    });
}
function verificationPassword(data){
    return new Promise((resolved, reject) => {
        const password = data.password;
        const hashsaved = data.hash;
        let compare = bcrypts.compareSync(password, hashsaved);
        if(compare){
            resolved(true);
        }else {
            resolved(false);
        }
    })
}
export const extras = {
    createToken,
    verificationToken,
    createHash,
    verificationPassword
}