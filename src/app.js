const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const path = require('path')
const cors = require('cors')
const userRouter = require('./routers/user')
require('./db/database')
const result = require("dotenv").config();

if (result.error) {
  console.log("your .env file could not be loaded");
}

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
    cors: {
      origin: ["http://localhost:3000", "https://react-chat-app-422e1.web.app/", "https://react-chat-app-422e1.web.app"],
      methods: ["GET", "POST"],
      credentials: true
    }
  })

const port =  process.env.PORT || 8080 
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
app.use(cors())
app.use(express.json({limit: "1mb"}))
app.use(userRouter)


io.on('connection', (socket) => {
    console.log("new connection established")

    socket.emit("welcomeMessage", "Welcome!")
    
    socket.on('messageRecieved', (msg) => {
        socket.broadcast.emit('messageSend', msg)
        //io.emit('messageSend', msg)
    })
})


server.listen(port, () => {
    console.log(`Listening at port ${port}.`)
})


