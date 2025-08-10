const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.get('/', messageController.getConversations);
router.get('/:wa_id/messages', messageController.getMessagesByWaId);
router.post('/send', messageController.sendMessage);

module.exports = router;
