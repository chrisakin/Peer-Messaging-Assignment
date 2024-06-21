import { Router } from 'express';
import { getAllUsers } from '../controllers/usersController.js';

const router = Router();

router.get('/all-users', getAllUsers);

export default router;
