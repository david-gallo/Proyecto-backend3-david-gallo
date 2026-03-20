import { Router } from 'express';
import usersController from '../controllers/users.controller.js';
import { validateUserData, validateMongoId } from '../middlewares/validators.js';

const router = Router();

// GET /api/users - Obtener todos los usuarios
router.get('/', usersController.getAllUsers);

// GET /api/users/:uid - Obtener un usuario por ID
router.get('/:uid', validateMongoId('uid'), usersController.getUser);

// PUT /api/users/:uid - Actualizar un usuario
router.put('/:uid', validateMongoId('uid'), validateUserData, usersController.updateUser);

// DELETE /api/users/:uid - Eliminar un usuario
router.delete('/:uid', validateMongoId('uid'), usersController.deleteUser);

export default router;