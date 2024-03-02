import { response, request } from 'express';
import bcryptjs from 'bcryptjs';
import Users from './user.model.js';

export const userPost = async (req = request, res = response) => {
    const { name, email, password } = req.body;
    const usuario = new Users({ name, email });

    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();
    res.status(200).json({
        usuario
    });
};