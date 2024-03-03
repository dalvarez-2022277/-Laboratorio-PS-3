import { Router } from 'express';
const router = Router();
import { check } from 'express-validator';
import { getPublicacionById, publicacionDelete, publicacionPut, publicacionesGet, publicacionesPost } from './publicaciones.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { existePublicacionById, existePublicacionByName } from '../middlewares/publicacion-validar.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

router.get(
    "/",
    publicacionesGet
);

router.get(
    '/:id',
    [
        check('id', 'El id no es un formato válido de MongoDB').isMongoId(),
        check('id').custom(existePublicacionById),
    ],
    getPublicacionById
);

router.post(
    "/",
    [
        check("Titulo", "El título es obligatorio").not().isEmpty(),
        check("Categoria", "La categoría es obligatoria").not().isEmpty(),
        check("Texto", "El texto principal es obligatorio").not().isEmpty(),
        check("Comentario", "El usuario de comentario es obligatorio").not().isEmpty(),
        check("iduser").custom(existePublicacionByName),
        validarCampos
    ],
    publicacionesPost
);

router.put(
    "/:id",
    [
        check("id", "El ID ingresado no es válido").isMongoId(),
        check("id").custom(existePublicacionById),
        validarJWT,
        validarCampos,
    ],
    publicacionPut
);

router.delete(
    "/:id",
    [
        check("id", "El id no es un formato válido de MongoDB").isMongoId(),
        validarJWT,
        validarCampos
    ],
    publicacionDelete
);

export default router;
