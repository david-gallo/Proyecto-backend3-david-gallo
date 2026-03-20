import mongoose from 'mongoose';

const collection = 'Pets';

const schema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'El nombre de la mascota es requerido'],
        trim: true,
        minlength: [2, 'El nombre debe tener al menos 2 caracteres']
    },
    specie:{
        type: String,
        required: [true, 'La especie es requerida'],
        enum: {
            values: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Fish', 'Other'],
            message: '{VALUE} no es una especie válida'
        }
    },
    birthDate: {
        type: Date,
        validate: {
            validator: function(value) {
                return value <= new Date();
            },
            message: 'La fecha de nacimiento no puede ser futura'
        }
    },
    adopted:{
        type: Boolean,
        default: false
    },
    owner:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Users'
    },
    image: String
}, {
    timestamps: true
});

// Índice compuesto para búsquedas de mascotas disponibles
schema.index({ adopted: 1, specie: 1 });

// Índice para búsquedas por dueño
schema.index({ owner: 1 });

const petModel = mongoose.model(collection, schema);

export default petModel;