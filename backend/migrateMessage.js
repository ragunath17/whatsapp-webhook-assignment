// migrate_messages.js
// Copies data from "messages" collection to "processed_messages" collection
// with any needed transformations for the updated payload structure.

const mongoose = require('mongoose');

// 1. Replace with your MongoDB connection string
const MONGO_URI = 'mongodb://localhost:27017/your_database_name';

// 2. Define the original messages schema (adjust if you have extra fields)
const messageSchema = new mongoose.Schema({}, { strict: false });
const Message = mongoose.model('Message', messageSchema, 'messages');
const ProcessedMessage = mongoose.model('ProcessedMessage', messageSchema, 'processed_messages');

(async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        // Fetch all messages
        const messages = await Message.find({});
        console.log(`📦 Found ${messages.length} messages to migrate.`);

        if (messages.length === 0) {
            console.log('⚠️ No messages found. Migration skipped.');
            process.exit(0);
        }

        // Transform messages if needed
        const transformedMessages = messages.map(msg => {
            // Example tweak: ensure timestamp is number and add migratedAt field
            if (msg.timestamp && typeof msg.timestamp === 'string') {
                msg.timestamp = parseInt(msg.timestamp, 10);
            }
            msg.migratedAt = new Date();
            return msg;
        });

        // Insert into processed_messages
        await ProcessedMessage.insertMany(transformedMessages);
        console.log(`✅ Successfully migrated ${transformedMessages.length} messages to processed_messages.`);

        // Optional: Uncomment to delete old data
        // await Message.deleteMany({});
        // console.log('🗑 Old messages deleted.');

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
})();
