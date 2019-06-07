import express from 'express';
import MessageController from '../handlers/messages';

const router = express.Router();

router.get('/api/v1/messages', MessageController.getAllMessages);
router.get('/api/v1/messages/:id', MessageController.getMessage);
router.post('/api/v1/messages', MessageController.createMessage);

export default router;