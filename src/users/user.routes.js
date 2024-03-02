import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos.js";
import { userPost } from "./user.controller.js";
import { existeuserbyemail } from "../middlewares/user-validar.js";
const routers = Router();

routers.post(
    "/",
    [
        check("name", "El nonmbre es obligatorio ").not().isEmpty(),
        check("email", "El correo no es valido").isEmail(),
        check("password", "La contraseña es demasiado corta").isLength({min: 6,}),
        check("email").custom(existeuserbyemail),
        validarCampos
    ],
    userPost
);

export default routers;