import mongoose from 'mongoose';
const { Schema } = mongoose;

const PublicacionSchema = mongoose.Schema({
    Titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio'],
    },
    Categoria: {
        type: String,
        required: [true, 'La categoria es obligatoria'],
    },
    Texto: {
        type: String,
        required: [true, 'el texto es obligatorio'],
    },
    Comentario: {
        type: String,
        required: [true, 'El comentario es obligatorio'],
    },
    iduser: {
        type: String,
        ref: "Users",
        required: [true, 'el id del usuario es obligatorio'],
    },
    EstadoPublicacion: {
        type: Boolean,
        default: true
    },
});

export default mongoose.model('Publicacion', PublicacionSchema);