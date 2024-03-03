import { response, request } from 'express';
import Publicacion from './publicaciones.model.js';
import Usuario from '../users/user.model.js';
import jwt from 'jsonwebtoken';

export const publicacionesGet = async (req, res = response) => {
    const { limite, desde } = req.query;
    const query = { EstadoPublicacion: true };

    try {
        const [total, publicaciones] = await Promise.all([
            Publicacion.countDocuments(query),
            Publicacion.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            total,
            publicaciones,
        });

    } catch (error) {
        console.error('Error al obtener las publicaciones: ', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
}

export const publicacionesPost = async (req = request, res = response) => {
    const { Titulo, Categoria, Texto, Comentario, iduser } = req.body;
    const publicacion = new Publicacion({ Titulo, Categoria, Texto, Comentario, iduser });

    await publicacion.save();

    res.status(200).json({
        publicacion
    });
}

export const getPublicacionById = async (req, res) => {
    const { id } = req.params;

    try {
        const publicacion = await Publicacion.findById(id);

        if (!publicacion) {
            return res.status(404).json({ msg: 'Publicación no encontrada' });
        }

        res.status(200).json({ publicacion });
    } catch (error) {
        console.error('Error al obtener la publicación:', error);
        res.status(500).json({ error: 'Error al obtener la publicación' });
    }
}


export const publicacionPut = async (req, res) => {
    const { id } = req.params;
    const { _id, ...resto } = req.body;

    try {
        const token = req.header('x-token');
        if (!token) {
            console.log('No hay token en la petición');
            return res.status(401).json({ msg: 'No hay token en la petición' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        } catch (error) {
            console.error('Error al decodificar el token JWT:', error);
            return res.status(401).json({ msg: 'Token JWT no válido' });
        }

        const userId = decoded.uid;

        const usuario = await Usuario.findById(userId);
        if (!usuario) {
            console.log('Usuario no encontrado en la base de datos');
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const publicacion = await Publicacion.findById(id);
        if (!publicacion) {
            console.log('Publicación no encontrada en la base de datos');
            return res.status(404).json({ msg: 'Publicación no encontrada' });
        }

        if (publicacion.iduser !== userId) {
            console.log('El usuario no tiene permiso para actualizar esta publicación');
            return res.status(403).json({ msg: 'No tienes permiso para actualizar esta publicación' });
        }

        const publicacionActualizada = await Publicacion.findByIdAndUpdate(id, resto, { new: true });

        res.status(200).json({
            msg: 'Publicación actualizada',
            publicacion: publicacionActualizada,
        });
    } catch (error) {
        console.error('Error al actualizar la publicación:', error);
        res.status(500).json({ error: 'Error al actualizar la publicación' });
    }
};

export const publicacionDelete = async (req, res) => {
    const { id } = req.params;

    try {
        const token = req.header('x-token');
        if (!token) {
            console.log('No hay token en la petición');
            return res.status(401).json({ msg: 'No hay token en la petición' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        } catch (error) {
            console.error('Error al decodificar el token JWT:', error);
            return res.status(401).json({ msg: 'Token JWT no válido' });
        }

        const userId = decoded.uid;

        const usuario = await Usuario.findById(userId);
        if (!usuario) {
            console.log('Usuario no encontrado en la base de datos');
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const publicacion = await Publicacion.findById(id);
        if (!publicacion) {
            console.log('Publicación no encontrada en la base de datos');
            return res.status(404).json({ msg: 'Publicación no encontrada' });
        }

        if (publicacion.iduser !== userId) {
            console.log('El usuario no tiene permiso para eliminar esta publicación');
            return res.status(403).json({ msg: 'No tienes permiso para eliminar esta publicación' });
        }

        await Publicacion.findByIdAndUpdate(id, { EstadoPublicacion: false });

        const publicacionEliminada = await Publicacion.findOne({ _id: id });

        res.status(200).json({
            msg: 'Publicación Eliminada correctamente',
            publicacion: publicacionEliminada
        });
    } catch (error) {
        console.error('Error al eliminar la publicación:', error);
        res.status(500).json({ error: 'Error al eliminar la publicación' });
    }
};
