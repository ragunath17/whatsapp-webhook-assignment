const Message = require('../models/message');

exports.getConversations = async (req, res) => {
    try {
        const conversations = await Message.aggregate([
            { $sort: { timestamp: -1 } },
            {
                $group: {
                    _id: "$wa_id",
                    name: { $first: "$name" },
                    lastMessage: { $first: "$text" },
                    lastTimestamp: { $first: "$timestamp" }
                }
            },
            { $sort: { lastTimestamp: -1 } }
        ]);
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMessagesByWaId = async (req, res) => {
    try {
        const wa_id = req.params.wa_id;
        const messages = await Message.find({ wa_id }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { wa_id, name, from, text } = req.body;
        const timestamp = Date.now().toString();

        const newMessage = new Message({
            wa_id,
            name,
            message_id: `msg_${Date.now()}`,
            from,
            text,
            timestamp,
            status: "sent"
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
