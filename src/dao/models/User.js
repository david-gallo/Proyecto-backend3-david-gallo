import mongoose from 'mongoose';

const collection = 'Users';

const schema = new mongoose.Schema({
    first_name:{
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
        minlength: [2, 'El nombre debe tener al menos 2 caracteres']
    },
    last_name:{
        type: String,
        required: [true, 'El apellido es requerido'],
        trim: true,
        minlength: [2, 'El apellido debe tener al menos 2 caracteres']
    },
    email:{
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email no válido']
    },
    password:{
        type: String,
        required: [true, 'El password es requerido'],
        minlength: [6, 'El password debe tener al menos 6 caracteres']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    pets:{
        type:[
            {
                _id:{
                    type: mongoose.SchemaTypes.ObjectId,
                    ref: 'Pets'
                }
            }
        ],
        default: []
    }
}, {
    timestamps: true // Añade createdAt y updatedAt automáticamente
});

// Índice para búsquedas por email (ya está implícito por unique, pero lo hacemos explícito)
schema.index({ email: 1 });

// Índice para búsquedas por role
schema.index({ role: 1 });

const userModel = mongoose.model(collection, schema);

export default userModel;