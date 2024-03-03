import Publicacion from '../publicaciones/publicaciones.model.js';
import Usuario from '../users/user.model.js';
import { publicacionPut } from '../publicaciones/publicaciones.controller.js';

export const existePublicacionByName = async (Titulo = '') => {
    const tituloPrin = Titulo.toLowerCase();

    const existeTitulo = await Publicacion.findOne({
        Titulo: {
            $regex: new RegExp(`^${tituloPrin}$`, 'i')
        }
    });

    if (existeTitulo) {
        throw new Error(`El título "${Titulo}" ya existe`);
    }
};

export const existePublicacionById = async (id = '') => {
    const existeById = await Publicacion.findById(id);

    if (!existeById) {
        throw new Error(`La Publicación con el ID "${id}" no existe`);
    }
};

