const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    from: String,
    to: String,
    direction: String, // inbound or outbound
    timestamp: String,
    type: String,
    text: String,
    status: String,
    conversation_id: String,
    meta_msg_id: String,
    gs_id: String,
    pricing: {
        billable: Boolean,
        category: String,
        pricing_model: String,
        type: String
    },
    rawPayload: Object // store full original for debugging if needed
}, { timestamps: true });

// Third param 'processed_messages' ensures it uses that collection
module.exports = mongoose.model('Message', MessageSchema, 'processed_messages');
