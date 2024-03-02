import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
    },
    email: {
        type: String,
        required: [true, "El correo del usuario es obligatorio"],
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
    },
    estado: {
        type: Boolean,
        default: true,
    }
})

export default mongoose.model('Users', UserSchema);