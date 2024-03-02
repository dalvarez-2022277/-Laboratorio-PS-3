import { response, request } from 'express';
import User from '../users/user.model.js'; // Asumiendo que 'user.model.js' contiene el modelo de usuario
import bcryptjs from 'bcryptjs';
import { generarJWT } from '../helpers/generar-jwt.js';

export const login = async (req = request, res = response) => {
    const { name, email, password } = req.body;

    try {
        let userData = null;

        // Verificar si se proporcionó un nombre de usuario o un correo electrónico
        if (name) {
            userData = await User.findOne({ name });
        } else if (email) {
            userData = await User.findOne({ email });
        } else {
            return res.status(400).json({
                msg: 'Debe proporcionar un nombre de usuario o correo electrónico.'
            });
        }

        // Verificar si se encontró un usuario
        if (!userData) {
            return res.status(400).json({
                msg: 'Usuario no encontrado.'
            });
        }

        const isPasswordValid = await bcryptjs.compare(password, userData.password);
        if (!isPasswordValid) { // Si la contraseña no es válida
            return res.status(400).json({
                msg: 'Contraseña incorrecta.'
            });
        }

        // Generar un token JWT para el usuario
        const token = await generarJWT(userData.id);

        // Devolver una respuesta exitosa con el token y los datos del usuario
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
