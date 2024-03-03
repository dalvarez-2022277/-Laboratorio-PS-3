import { response, request } from 'express';
import User from '../users/user.model.js'; 
import bcryptjs from 'bcryptjs';
import { generarJWT } from '../helpers/generar-jwt.js';

export const login = async (req = request, res = response) => {
    const { name, email, password } = req.body;

    try {
        let userData = null;

        if (name) {
            userData = await User.findOne({ name });
        } else if (email) {
            userData = await User.findOne({ email });
        } else {
            return res.status(400).json({
                msg: 'Debe proporcionar un nombre de usuario o correo electrónico.'
            });
        }

        if (!userData) {
            return res.status(400).json({
                msg: 'Usuario no encontrado.'
            });
        }

        const isPasswordValid = await bcryptjs.compare(password, userData.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                msg: 'Contraseña incorrecta.'
            });
        }

        const token = await generarJWT(userData.id);

        return res.status(200).json({
            msg: '¡Bienvenido al login!',
            userData,
            token
        });

    } catch (error) {
        console.error('Error en la autenticación:', error);
        return res.status(500).json({ msg: 'Error interno del servidor.' });
    }
};
