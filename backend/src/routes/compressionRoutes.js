import { Router } from 'express';
import { compress, decompress } from '../controllers/compressionController.js';

const router = Router();

router.post('/compress', compress);
router.post('/decompress', decompress);

export default router;
