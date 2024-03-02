import users from '../users/user.model.js';

export const existeuserbyemail = async (email = '') => {
   const correoreq = email.toLowerCase();

    const existeCorreo = await users.findOne({
        email: {
            $regex: new RegExp(`^${correoreq}$`, 'i')
        }
    });

    if(existeCorreo){
        throw new Error(`el email = ${email} ya pertenece a otro usuario pruebe con otro`)
    }
}