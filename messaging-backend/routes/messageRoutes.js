import { Router } from 'express';
import { sendMessage, getMessages } from '../controllers/messageController.js';

const router = Router();

router.post('/send', sendMessage);
router.get('/:userId', getMessages);

export default router;
