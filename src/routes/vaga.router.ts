import { Router } from 'express';
import VagaController from '@controllers/VagaController';

const router = Router();

router.get('/', VagaController.index);
router.post('/', VagaController.store);
router.get('/:id', VagaController.show);
router.delete('/:id', VagaController.delete);
router.put('/:id', VagaController.update);
router.put('/:id', VagaController.update);
export default router;
