import { Router} from 'express';
import adoptionsController from '../controllers/adoptions.controller.js';
import { validateMongoId } from '../middlewares/validators.js';

const router = Router();

router.get('/',adoptionsController.getAllAdoptions);
router.get('/:aid', validateMongoId('aid'), adoptionsController.getAdoption);
router.post('/:uid/:pid', validateMongoId('uid'), validateMongoId('pid'), adoptionsController.createAdoption);

export default router;