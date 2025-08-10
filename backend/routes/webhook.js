const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// WhatsApp webhook handler
router.post('/webhook', async (req, res) => {
    try {
        const data = req.body;
        // Handle both payload formats: metaData or direct entry
        const entry = data.metaData?.entry || data.entry;
        if (!entry || !Array.isArray(entry) || !entry[0]?.changes) {
            return res.sendStatus(400);
        }

        const change = entry[0].changes[0];
        const value = change.value;

        // Handle incoming messages
        if (value.messages && Array.isArray(value.messages)) {
            for (const msg of value.messages) {
                await Message.create({
                    from: msg.from,
                    to: value.metadata?.display_phone_number || null,
                    direction: msg.from === value.metadata?.display_phone_number ? 'outbound' : 'inbound',
                    timestamp: msg.timestamp,
                    type: msg.type,
                    text: msg.text?.body || null,
                    rawPayload: data
                });
            }
        }

        // Handle status updates
        if (value.statuses && Array.isArray(value.statuses)) {
            for (const status of value.statuses) {
                await Message.create({
                    from: value.metadata?.display_phone_number || null,
                    to: status.recipient_id,
                    direction: 'status',
                    timestamp: status.timestamp,
                    status: status.status,
                    conversation_id: status.conversation?.id || null,
                    meta_msg_id: status.meta_msg_id || null,
                    gs_id: status.gs_id || null,
                    pricing: status.pricing || null,
                    rawPayload: data
                });
            }
        }

        res.sendStatus(200);
    } catch (err) {
        console.error('Webhook error:', err);
        res.sendStatus(500);
    }
});

module.exports = router;
