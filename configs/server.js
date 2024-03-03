'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import usersRoutes from '../src/users/user.routes.js';
import loginRoutes from '../src/auth/auth.routes.js';
import publicationsRoutes from '../src/publicaciones/publicaciones.routes.js';


class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = '/GestorOpiniones/v1/users';
        this.loginPath = '/GestorOpiniones/v1/login';
        this.publicacionesPath = '/GestorOpiniones/v1/publicaciones';
        this.middlewares();
        this.conectarDB();
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares() {
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes(){
        this.app.use(this.usersPath, usersRoutes);
        this.app.use(this.loginPath, loginRoutes);
        this.app.use(this.publicacionesPath, publicationsRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server corriendo en', this.port);
        });
    }
}

export default Server;