// Middleware de validación de datos

export const validateUserData = (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;
    const errors = [];

    // Validar campos requeridos
    if (first_name && typeof first_name !== 'string') {
        errors.push('first_name debe ser un string');
    }
    if (first_name && first_name.trim().length < 2) {
        errors.push('first_name debe tener al menos 2 caracteres');
    }

    if (last_name && typeof last_name !== 'string') {
        errors.push('last_name debe ser un string');
    }
    if (last_name && last_name.trim().length < 2) {
        errors.push('last_name debe tener al menos 2 caracteres');
    }

    if (email && typeof email !== 'string') {
        errors.push('email debe ser un string');
    }
    if (email && !isValidEmail(email)) {
        errors.push('email no tiene un formato válido');
    }

    if (password && typeof password !== 'string') {
        errors.push('password debe ser un string');
    }
    if (password && password.length < 6) {
        errors.push('password debe tener al menos 6 caracteres');
    }

    if (errors.length > 0) {
        return res.status(400).send({
            status: 'error',
            error: 'Validación fallida',
            details: errors
        });
    }

    next();
};

export const validatePetData = (req, res, next) => {
    const { name, specie } = req.body;
    const errors = [];

    if (name && typeof name !== 'string') {
        errors.push('name debe ser un string');
    }
    if (name && name.trim().length < 2) {
        errors.push('name debe tener al menos 2 caracteres');
    }

    if (specie && typeof specie !== 'string') {
        errors.push('specie debe ser un string');
    }
    if (specie && !['Dog', 'Cat', 'Bird', 'Rabbit', 'Fish', 'Other'].includes(specie)) {
        errors.push('specie debe ser uno de: Dog, Cat, Bird, Rabbit, Fish, Other');
    }

    if (errors.length > 0) {
        return res.status(400).send({
            status: 'error',
            error: 'Validación fallida',
            details: errors
        });
    }

    next();
};

export const validateMongoId = (paramName = 'id') => {
    return (req, res, next) => {
        const id = req.params[paramName] || req.params.uid || req.params.pid || req.params.aid;
        const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

        if (!mongoIdPattern.test(id)) {
            return res.status(400).send({
                status: 'error',
                error: 'ID inválido',
                details: ['El ID proporcionado no tiene un formato válido de MongoDB']
            });
        }

        next();
    };
};

// Función auxiliar para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
