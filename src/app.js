const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");
const cors = require("cors");
const userRouter = require("./routers/user");
require("dotenv").config();
require("./db/database");
const app = express();

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: [
      "http://localhost:3000/",
      "https://react-chat-app-422e1.web.app/",
      "https://react-chat-app-422e1.web.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const port = process.env.PORT || 8080;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(userRouter);

io.on("connection", (socket) => {
  console.log("new connection established");

  socket.emit("welcomeMessage", "Welcome!");

  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });

  socket.on("messageRecieved", (msg) => {
    socket.broadcast.emit("messageSend", msg);
    //io.emit('messageSend', msg)
  });
});

server.listen(port, () => {
  console.log(`Listining at port ${port}.`);
});
