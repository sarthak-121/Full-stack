const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const path = require('path')
const userRouter = require('./routers/user')
require('./db/database')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
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
    console.log(`Listining at port ${port}.`)
})


