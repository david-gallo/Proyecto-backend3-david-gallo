import { Router } from 'express';
import sessionsController from '../controllers/sessions.controller.js';
import { validateUserData } from '../middlewares/validators.js';

const router = Router();

router.post('/register', validateUserData, sessionsController.register);
router.post('/login', sessionsController.login);
router.get('/current', sessionsController.current);
router.post('/unprotectedLogin', sessionsController.unprotectedLogin);
router.get('/unprotectedCurrent', sessionsController.unprotectedCurrent);

export default router;