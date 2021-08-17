import conexion from '../database';

function buscarInmuebleId(data){
    const id_inmueble = data.id_inmueble;
    return new Promise((resolved, reject) => {
        conexion.query('select *from inmueble where Id_Inmueble = ?', [id_inmueble], function(err, res) {
            if(err){
                return err;
            }else{
                if(res.length > 0){
                    let dat = {};
                    dat.id_inmueble_padre = res[0].Id_Inmueble_Padre;
                    resolved(dat);
                }else{
                    resolved(false);
                }
                
            }
        })
    })
}

export const inmueble = {
    buscarInmuebleId
}