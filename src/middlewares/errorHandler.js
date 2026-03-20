// Middleware global para manejo de errores

/**
 * Middleware para manejar errores de forma centralizada
 */
export const errorHandler = (err, req, res, next) => {
    // Log del error para debugging
    console.error('Error capturado:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Errores de validación de Mongoose
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).send({
            status: 'error',
            error: 'Validation failed',
            details: errors
        });
    }

    // Errores de cast (MongoDB ID inválido)
    if (err.name === 'CastError') {
        return res.status(400).send({
            status: 'error',
            error: 'ID inválido',
            details: [`El valor "${err.value}" no es un ID válido de MongoDB`]
        });
    }

    // Error de duplicado (índice único)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).send({
            status: 'error',
            error: 'Duplicate value',
            details: [`El ${field} ya existe en la base de datos`]
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).send({
            status: 'error',
            error: 'Token inválido'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).send({
            status: 'error',
            error: 'Token expirado'
        });
    }

    // Error genérico
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).send({
        status: 'error',
        error: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

/**
 * Wrapper para controladores async que captura errores automáticamente
 */
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
