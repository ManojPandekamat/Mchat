const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const router = require("./route.js");
const cors = require("cors");
const mongoose = require("mongoose");
const server = http.createServer(app);
const chat = require("./models.js");
const multer = require("multer");
const fileModel = require("./fileModel.js");
const path = require("path");
const fs = require("fs");

const io = new Server(server, {
  cors: { origin: "*" },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "==" + file.originalname);
  },
});

const upload = multer({ storage: storage });

try {
  mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB...");
} catch (e) {
  console.error(e);
}

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Allow all origins
    methods: ["GET", "POST","PUT","DELETE"], // Allow specific HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  })
);


// ===========================Hashmap managing Unique code details==========================
let map = new Map();
let socketsToRoomMap = new Map();
function registerSocketInMap(roomId, socketId) {
  if (!socketId) {
    return false;
  }
  socketsToRoomMap.set(socketId, roomId);
  if (map.has(roomId)) {
    let sockets = map.get(roomId);
    sockets.add(socketId);
  } else {
    map.set(roomId, new Set([socketId]));
  }
  returnNumbersOfMembers(socketId);
  return true;
}

async function sendMessageToUsers(io, data) {
  const roomId = data.roomId;
  let sockets = map.get(roomId);

  try {
    const result = await chat.create(data);
    console.log("Inserted...." + roomId);
  } catch (e) {
    console.log(e);
  }
  if (sockets)
    Array.from(sockets).forEach((socketId) =>
      io.to(socketId).emit("message", data)
    );
}

async function sendFilesToUsers(io, roomId, by, filename, time) {
  let sockets = map.get(roomId);
  let data = {
    file: true,
    filename: filename,
    time: time,
    by: by,
    roomId: roomId,
  };

  try {
    const result = await chat.create(data);

    const result2 = await fileModel.create({
      filename: filename,
      roomId: roomId,
    });


    console.log("Inserted...." + roomId);
  } catch (e) {
    console.log(e);
  }
  if (sockets)
    Array.from(sockets).forEach((socketId) =>
      {io.to(socketId).emit("message", data)
  console.log('sent to '+socketId);}
  
    );
}

async function deleteChat(roomId) {
  try {
    await chat.deleteMany({ roomId: roomId });
    const result = await fileModel.find({ roomId: roomId });

    if (result && result.length > 0) {
      for (const f of result) {
        await fs.promises.unlink(path.join(__dirname, "uploads", f.filename));
      }
    }
   let sockets = map.get(roomId);
    map.delete(roomId);
    Array.from(sockets).forEach(async (s)=>{
      socketsToRoomMap.delete(s);

      await fileModel.deleteMany({ roomId: roomId });
    })
  } catch (e) {
    console.error(e);
  }

}

function handleDisconnection(socketId) {
  const roomId = socketsToRoomMap.get(socketId);

  let sockets = map.get(roomId);

  if (sockets) {
    sockets.delete(socketId);
    if (sockets.size === 0) {
      deleteChat(roomId);

      map.delete(roomId);
    }
    // map.set(roomId,sockets);
    socketsToRoomMap.delete(socketId);
  }
}

function returnNumbersOfMembers(socketId) {
  let roomId = socketsToRoomMap.get(socketId);
  console.log(roomId);

  let users = map.get(roomId);
  // console.log(users);
  if (users) {
    // Notify all clients in the room of the new member count
    Array.from(users).forEach((socketId) => {
      io.to(socketId).emit("roomMembers", users.size);
    });
  }
}

// ====================================================================

io.on("connection", (socket) => {
  console.log("socket connected:" + socket.id);

  socket.on("handShake", (data) => {
    let response = registerSocketInMap(data.roomId, socket.id, socket.id);
    if (response) {
      socket.emit("handShake", {
        status: true,
      });
    } else {
      socket.emit("handShake", {
        status: false,
      });
    }
  });

  socket.on("message", (data) => {
    sendMessageToUsers(io, data);
  });

  socket.on("roomMembers", (data) => {
    console.log("Recorded for members request");
    console.log(data);

    returnNumbersOfMembers(socket.id);
  });

  // socket.on("file",(data)=>{
  //   console.log('File send request');
  //   handleFileSending(io,data);

  // })

  socket.on("disconnect", (data) => {
    handleDisconnection(socket.id);
    console.log("socket is disconnected" + socket.id);
  });

  // socket.on("roomDetails")
});

function manageFileUploads(files, roomId, by,time) {
  Array.from(files).forEach((file) => {
    console.log( roomId, by, file.filename)
    sendFilesToUsers(io, roomId, by, file.filename,time);
  });
}

app.get("/data", async (req, res) => {
  const { roomId } = req.query;
  console.log("In data" + roomId);
  let response = await chat.find({ roomId: roomId });
  let response2 = [];
  response.forEach((data) => {
    let { __V, ...rest } = data.toObject();
    response2.push(rest);
  });
  res.json(response2);
});

app.post("/file", upload.array("Userfiles", 10), (req, res) => {
  console.log(req.files,req.body.roomId, req.params.by, req.params.time);
  manageFileUploads(req.files, req.body.roomId, req.body.by, req.body.time);
  res.status(201).json({
    status: true,
    message: "files recieved successfully!",
  });
});

app.get("/download/:filename",(req,res)=>{
  const filename=req.params.filename;
  console.log("request for download"+filename);
  if(fs.existsSync)
  {res.download(path.join(__dirname,'uploads',filename),(err)=>{
    if(err)
    console.error(err)
  });}else{
    console.log("file not therre");
    
  }
})


app.use("/", router);


server.listen(5000, () => {
  console.log("Port listening on 5000");
});

