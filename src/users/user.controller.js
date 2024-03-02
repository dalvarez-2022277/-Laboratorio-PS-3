import { response, request } from 'express';
import bcryptjs from 'bcryptjs';
import Users from './user.model.js';

export const userPost = async (req = request, res = response) => {
    const { name, email, password } = req.body;
    const usuario = new Users({name, email, password});

    const encript = bcryptjs.genSaltSync();
    usuario.PasswordUser = bcryptjs.hashSync(password, encript);

    await usuario.save();
    res.status(200).json({
        usuario
    })

}

