const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const webhookRoutes = require('./routes/webhook')

const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const conversationRoutes = require('./routes/conversations')
app.use('/conversations', conversationRoutes)



app.get('/', (req, res) => {
    res.send('Backend is working')
})

app.use('/', webhookRoutes)

app.get('/test-insert', async (req, res) => {
    try {
        const Message = require('./models/message');
        const newMessage = new Message({
            wa_id: "1234567890",
            name: "Test User",
            message_id: "msg_001",
            from: "1234567890",
            text: "Hello from test insert",
            timestamp: Date.now().toString(),
            status: "sent"
        });
        await newMessage.save();
        res.json({ success: true, message: "Test message inserted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});



const uri = "mongodb+srv://ragunath06127:Ragunath2001@cluster0.xash062.mongodb.net/whatsapp?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(uri)
    .then(() => {
        console.log("MongoDB Connected")
        app.listen(5000, () => {
            console.log('Server is running on port 5000')
        })
    })
    .catch(err => {
        console.error("MongoDB connection error: ", err)
    })

