import jwt from 'jsonwebtoken';
import usera from '../users/user.model.js';


export const validarJWT = (req, res, next) => {

    const token = req.header('x-token');
    console.log(token);

    if (!token) {
        return res.status(401).json({ msg: 'No hay token' });
    }

    try {

        const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        req.userId = decoded.id;

        next();

    } catch (error) {
        return res.status(401).json({ msg: 'Token no válido' });
    }

} 