// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const morgan = require("morgan");

// Enable All Cors Requests
const cors = require("cors");
app.use(cors());

//SocketIo config
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let users = [];

let stallUsers = {};

let getStallUsers = () => {
  const stallUserNum = {};
  for (const fairId in stallUsers) {
    stallUserNum[fairId] = {};
    const stalls = stallUsers[fairId];
    for (const stallId in stalls) {
      const stallSocket = stalls[stallId];
      stallUserNum[fairId][stallId] = stallSocket.length;
    }
  }
  return stallUserNum;
};

const addUser = (userId, socketId) => {
  users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUsers = (receiverId, senderId, socketId) => {
  return users.filter((user) => {
    const receiverFound = user.userId === receiverId;
    const senderFound = user.userId === senderId;
    const notTheSenderSocket = user.socketId !== socketId;
    return notTheSenderSocket && (receiverFound || senderFound);
  });
};

io.on("connection", (socket) => {
  // console.log('a new user connected');
  // console.log("Connected socketId:", socket.id);

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    // console.log("currentUserId", userId);
    addUser(userId, socket.id);
    console.log("users", users);
    io.to(socket.id).emit("updateUsers", getStallUsers());
    // io.emit("getUsers", users);
  });

  socket.on("sendMessage", (data) => {
    const { receiver_id, sender_id } = data.message;
    const users = getUsers(receiver_id, sender_id, socket.id);
    users.forEach((user) => {
      io.to(user.socketId).emit("getMessage", data);
    });
  });

  socket.on("join", ({ fairId, stallId }) => {
    if (!(fairId in stallUsers)) stallUsers[fairId] = {};
    if (!(stallId in stallUsers[fairId])) stallUsers[fairId][stallId] = [];
    stallUsers[fairId][stallId].push(socket.id);
    console.log(getStallUsers());
    users.forEach((user) => {
      io.to(user.socketId).emit("updateUsers", getStallUsers());
    });
  });

  socket.on("leave", ({ fairId, stallId }) => {
    stallUsers[fairId][stallId] = stallUsers[fairId][stallId].filter(
      (id) => id !== socket.id
    );
    users.forEach((user) => {
      io.to(user.socketId).emit("updateUsers", getStallUsers());
    });
  });

  socket.on("editMessage", (data) => {
    const { sender_id, receiver_id } = data.message;
    const users = getUsers(receiver_id, sender_id, socket.id);
    users.forEach((user) => {
      io.to(user.socketId).emit("editMessage", data);
    });
  });

  socket.on("logout", () => {
    removeUser(socket.id);
  });

  //client disconnect
  socket.on("disconnect", () => {
    removeUser(socket.id);
    for (const fairId in stallUsers) {
      const stalls = stallUsers[fairId];
      for (const stallId in stalls) {
        let stallArr = stalls[stallId];
        stallUsers[fairId][stallId] = stallArr.filter((id) => id !== socket.id);
      }
    }
    console.log(stallUsers);
    console.log(getStallUsers());
    users.forEach((user) => {
      io.to(user.socketId).emit("updateUsers", getStallUsers());
    });
  });
});

// Set up cookie-session
const cookieSession = require("cookie-session");
app.use(cookieSession({ secret: process.env.SECRET }));

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(__dirname + "/public"));

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own

const usersRoutes = require("./routes/users");
const jobRoutes = require("./routes/jobs");
const fairsRoutes = require("./routes/fairs");
const organizationRoutes = require("./routes/organizations");
const messagesRoutes = require("./routes/messages");
const applicationRoutes = require("./routes/applications");
const tokenRoutes = require("./routes/token");
const scheduleRoutes = require("./routes/schedule");
const interviewRoutes = require("./routes/interviews");

app.use("/api/users", usersRoutes(db));
app.use("/api/jobs", jobRoutes(db));
app.use("/api/applications", applicationRoutes(db));
app.use("/api/fairs", fairsRoutes(db));
app.use("/api/organizations", organizationRoutes(db));
app.use("/api/messages", messagesRoutes(db));
app.use("/api/token", tokenRoutes());
app.use("/api/interviews", interviewRoutes(db));
app.use("/api/schedule", scheduleRoutes(db));

httpServer.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
