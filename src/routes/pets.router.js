import { Router } from 'express';
import petsController from '../controllers/pets.controller.js';
import uploader from '../utils/uploader.js';
import { validatePetData, validateMongoId } from '../middlewares/validators.js';

const router = Router();

router.get('/',petsController.getAllPets);
router.post('/', validatePetData, petsController.createPet);
router.post('/withimage', uploader.single('image'), validatePetData, petsController.createPetWithImage);
router.put('/:pid', validateMongoId('pid'), validatePetData, petsController.updatePet);
router.delete('/:pid', validateMongoId('pid'), petsController.deletePet);

export default router;