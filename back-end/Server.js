const express = require("express");
const app = express();
const path = require("path");
const port = 8081;
const port2 = 8080;

const mysql = require("mysql");
const moment = require("moment");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

//const http = require('http').Server(app);
// connect server
const server = app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

// const server = app.listen(port, '0.0.0.0', function() {
//     console.log(`Listening on port: ${port}`);
// });
const io = require("socket.io").listen(server);
// New ----------------------------------------
app.get("/allrooms", (req, res) => {
  let sql = "select DISTINCT roomid from room";
  db.query(sql, (err, result) => {
    if (err) {
      console.dir(err);
      console.log("error in server line 21");
    } else {
      output = [];
      for (i = 0; i < result.length; i++) {
        output.push(result[i].roomid);
      }
      console.log(output);
      res.status(200).json(output);
    }
  });
});
app.post("/allrooms", (req, res) => {
  const roomID = req.body.id;
  console.log(roomID);
  let sql = "select * from Room where roomID = ?;";
  db.query(sql, roomID, (err, result) => {
    if (result.length != 0) {
      console.log("The room ID is already existed");
      let responseString = roomID + " already exists";
      res.status(404).json(responseString);
    } else {
      sql = "INSERT INTO room values(?);";
      db.query(sql, roomID, (error, results) => {
        if (error) {
          console.log("error in line 52");
        } else {
          res.status(201).json(req.body);
        }
      });
    }
  });
});
app.put("/allrooms", (req, res) => {
  const roomID = req.body.id;
  console.log(roomID);
  let sql = "select * from Room where roomID = ?;";
  db.query(sql, roomID, (err, result) => {
    if (result.length != 0) {
      console.log("The room ID is already existed");
      res.status(200).json(req.body);
    } else {
      sql = "INSERT INTO room values(?);";
      db.query(sql, roomID, (error, results) => {
        if (error) {
          console.log("error in line 72");
        } else {
          res.status(201).json(req.body);
        }
      });
    }
  });
});
app.delete("/allrooms", (req, res) => {
  const roomID = req.body.id;
  console.log("Attempted to delete " + roomID);
  let sql = "select * from Room where roomID = ?;";
  db.query(sql, roomID, (err, result) => {
    if (result.length == 0) {
      console.log("Room id is not found");
      res.status(404).json("Room id is not found");
    } else {
      sql = "DELETE FROM room where roomID=?;";
      db.query(sql, roomID, (error, results) => {
        if (error) {
          throw error;
          console.log("error in line 92");
        } else {
          console.log("deleted " + roomID);
          let responseString = req.body.id + " is deleted";
          res.status(200).json(responseString);
        }
      });
    }
  });
});
// Old ----------------------------------------

//----endpoint room ----------------------------------------------------//

app.get("/room/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  let roomID = req.params.id;

  const checkIfExist = "SELECT roomID FROM room WHERE roomID = ?;";
  db.query(checkIfExist, roomID, (error, result) => {
    if (error) throw error;
    if (result.length == 0) {
      console.log("Room does not exist");
      res.status(404).json("Room does not exist");
      return;
    } else {
      console.log(roomID);
      let sql = "SELECT username FROM room_users WHERE roomID=?;";
      db.query(sql, roomID, (error, result) => {
        if (error) throw error;
        output = [];
        for (i = 0; i < result.length; i++) {
          output.push(result[i].username);
        }
        console.log(output);
        res.status(200).json(output);
      });
    }
  });
});

app.post("/room/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  // console.log("req.body = ", req.body);
  let username = req.body["user"];
  console.log(username + "joins the room");
  let roomID = req.params.id;

  const checkAlreadyJoined =
    "SELECT * FROM room_users where username=? AND roomID=?";
  db.query(checkAlreadyJoined, [username, roomID], (error, result) => {
    if (error) throw error;
    if (result.length != 0) {
      console.log("Already joined");
      res.status(200).json({});
    } else {
      let sql = "INSERT INTO room_users(username,roomID) values (?,?);";

      db.query(sql, [username, roomID], (error, result) => {
        if (error) throw error;
        res.status(201).json({});
      });
    }
  });
});

app.put("/room/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log("req.body = ", req.body);
  let username = req.body["user"];
  console.log(username);
  let roomID = req.params.id;

  const checkAlreadyJoined =
    "SELECT * FROM room_users where username=? AND roomID=?";
  db.query(checkAlreadyJoined, [username, roomID], (error, result) => {
    if (error) throw error;
    if (result.length != 0) {
      console.log("Already joined");
      res.status(200).json({});
    } else {
      let sql = "INSERT INTO room_users(username,roomID) values (?,?);";

      db.query(sql, [username, roomID], (error, result) => {
        if (error) throw error;
        res.status(201).json({});
      });
    }
  });
});

app.delete("/room/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let username = req.body["user"];
  let roomID = req.params.id;
  console.log(username + " attempted to leave " + roomID);
  // console.log(username);
  const checkIfExist =
    "SELECT * FROM room_users WHERE username=? AND roomID = ? ;";
  db.query(checkIfExist, [username, roomID], (error, result) => {
    if (error) throw error;
    if (result.length == 0) {
      console.log(username);
      console.log(roomID);
      console.log("User not found in this room");
      res.status(404).json("User id is not found");
    } else {
      console.log(username + "will be deleted from" + roomID);

      let sql = "DELETE FROM room_users WHERE username=? AND roomID=?;";
      db.query(sql, [username, roomID], (error, result) => {
        if (error) throw error;
        let responseString = username + " leaves the room";
        res.status(200).json(responseString);
      });
    }
  });
});

//----endpoint room ----------------------------------------------------//

//------------endpoint users-----------------------------------------------//
app.get("/users", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let sql = "SELECT DISTINCT username from room_users";
  db.query(sql, (err, result) => {
    if (err) {
      console.dir(err);
    } else {
      output = [];
      for (i = 0; i < result.length; i++) {
        output.push(result[i].username);
      }
      console.log(output);
      res.send(output);

      // res.sendCode(200);
    }
  });
});
//-------------------------------------------------------------------------//

// call database and connect
const dbcalled = require("./src/dbcall");
const db = mysql.createConnection(dbcalled);
db.connect(err => {
  if (err) {
    console.log("Cannot connect to database");
  } else {
    console.log("Database connected");
  }
});
//get view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
//set public dir
app.use(express.static("public"));

// app router
app.get("/", (req, res) => {
  res.render("index");
});

// io
io.on("connection", socket => {
  console.log("Using This Server");
  socket.emit("getCurrentStatus");
  // socket.on('',(name,word,fn)=>{
  //     fn(`${name} says ${word}`)
  // });
  setTimeout(() => {
    socket.send("Sent a message 5 seconds after connection!");
  }, 5000);

  socket.on("returnStatus", data => {
    console.log("\nstatus :--------------------------------");
    console.log("User ID : " + data.userID);
    console.log("Group ID : " + data.groupID);
    console.log("Current Message : " + data.messageContent);
    console.log("status :--------------------------------\n");
  });

  //const checkIfExist = 'SELECT username,pass_word FROM SystemUser WHERE username = ?;';
  // socket.on('register',(req,res)=>{
  //     db.query(checkIfExist,[req.username],(error,result)=>{
  //         if(error)throw error;
  //         if(result.length!==0) {
  //             socket.emit('registerFail');
  //         }else {
  //             const sql = 'INSERT INTO SystemUser(Username , pass_word) VALUES(?,?);'
  //             db.query(sql,[req.body.username , req.body.pass_word],(error)=>{
  //                 if(error) throw error ;
  //                 socket.emit('registerSuccess');
  //             })
  //         }
  //     });
  // });
  socket.on("login", data => {
    //console.log("enter back-end login");
    //console.log(data.username);
    //console.log(data.password);
    const checkIfExist =
      "SELECT userID FROM SystemUser WHERE username = ? and pass = ?;";
    db.query(checkIfExist, [data.username, data.password], (error, result) => {
      if (error) throw error;
      // cannot find username in database
      if (result.length == 0) {
        let addUser = "INSERT INTO SystemUser(username,pass) VALUE(?,?);";
        db.query(addUser, [data.username, data.password], (error, result) => {
          if (error) throw error;

          let getUserID =
            "SELECT userID FROM systemUser WHERE username=? AND pass=?";
          db.query(
            getUserID,
            [data.username, data.password],
            (error, result) => {
              if (error) throw error;
              console.log(result[0]);

              socket.emit("loginSuccess", result[0]);
            }
          );
        });
      } else {
        //console.log(result[0].userID);
        console.log(result[0]);
        socket.emit("loginSuccess", result[0]);
      }
    });
  });
  socket.on("createGroup", data => {
    const checkIfExist = "SELECT groupName FROM GroupChat WHERE groupName = ?;";
    db.query(checkIfExist, data.groupName, (error, result) => {
      if (error) throw error;
      if (result.length != 0) {
        socket.emit("createGroupFail");
      } else {
        let sql = "INSERT INTO GroupChat(groupName) VALUES(?);";
        db.query(sql, data.groupName, error => {
          if (error) throw error;
          socket.emit("createGroupSuccess");
        });
      }
    });
  });

  socket.on("refreshGroup", data => {
    //console.log("server emit refreshGroupSuccess");
    io.emit("refreshGroupSuccess");
  });
  //already in group just enter group
  //isExit = 0 >> Enter GroupChat page
  socket.on("enterGroup", data => {
    let output = [];
    //console.log("enter group");
    const sql =
      "UPDATE JoinGroup SET isExit='0' WHERE JGuserID=? AND JGgroupID=?;";
    const loadMsg =
      "SELECT ChatuserID,message,timeSend FROM  Chat INNER JOIN ChatLog \
    ON ChatmessageID = messageID WHERE ChatgroupID = ? ORDER BY timeSend;";
    db.query(sql, [data.userID, data.groupID], error => {
      if (error) throw error;
      db.query(loadMsg, data.groupID, (error, result) => {
        if (error) throw error;
        // console.log("here");

        for (i = 0; i < result.length; i++) {
          result[i].timeSend = result[i].timeSend.toLocaleString();
        }

        //console.log(result);
        socket.emit("enterGroupSuccess", result);
      });
    });
  });

  //just exit a group
  socket.on("exitGroup", data => {
    console.log("exitGroup");
    const sql =
      "UPDATE JoinGroup SET isExit='1'WHERE JGuserID=? and JGgroupID=?;";
    db.query(sql, [data.userID, data.groupID], error => {
      if (error) throw error;
      socket.emit("exitGroupSuccess");
    });
  });
  // never join group
  socket.on("joinGroup", data => {
    const sql =
      "INSERT INTO JoinGroup(JGuserID, JGgroupID, isExit, latestTimeRead) VALUES(?,?,'1',now());";
    const loadMsg =
      "SELECT ChatuserID,message,timeSend FROM  Chat INNER JOIN ChatLog \
    ON ChatmessageID = messageID WHERE ChatgroupID = ?;";

    db.query(sql, [data.userID, data.groupID], error => {
      if (error) {
        //console.log("error here");
        throw error;
      }
      db.query(loadMsg, data.groupID, (error, result) => {
        if (error) throw error;
        // console.log("here");
        // console.log(result);
        socket.emit("joinGroupSuccess", result);
      });
    });
  });

  socket.on("leaveGroup", data => {
    const sql = "DELETE FROM JoinGroup WHERE JGuserID=? and JGgroupID=?";
    db.query(sql, [data.userID, data.groupID], error => {
      if (error) throw error;
    });
  });

  socket.on("sendMsg", data => {
    //console.log("time");
    //let timeStamp = moment().format("YYYY-MM-DD HH:mm:ss");
    let timeStamp = new Date().toLocaleString();
    //console.log(timeStamp);

    const savemsg = `INSERT INTO ChatLog(message,timeSend) VALUES(?,?);`;
    let sql =
      "INSERT INTO Chat(ChatuserID,ChatgroupID,ChatmessageID) \
      VALUES(?,?,LAST_INSERT_ID());";
    // save message into chatlog table
    let msg = {
      userID: data.userID,
      groupID: data.groupID,
      timeSend: timeStamp,
      message: data.content
    };

    //console.log(data.content);
    db.query(savemsg, [data.content, timeStamp], error => {
      if (error) throw error;
      // insert chatmessage into chat table
      db.query(sql, [data.userID, data.groupID], error => {
        if (error) throw error;
        io.emit("sendMsgToEveryone", msg); //send to group
      });
    });
  });

  socket.on("getUnreadMsg", data => {
    const loadMsg =
      "SELECT message,timeSend \
        FROM ChatLog INNER JOIN Chat INNER JOIN JoinGroup \
        ON ChatmessageID = messageID  AND ChatuserID = JGuserID AND ChatgroupID = JGgroupID \
        AND ChatgroupID = ? AND ChatuserID = ? \
        WHERE latestTimeRead <= timeSend;";
    //console.log(data);
    db.query(loadMsg, [data.ChatuserID, data.ChatgroupID], (error, result) => {
      if (error) throw error;
      //console.log(result);
      socket.emit(result);
    });
  });

  socket.on("getGroup", data => {
    const sql =
      "SELECT groupID,groupName FROM GroupChat \
        WHERE groupID IN (SELECT JGgroupID FROM JoinGroup WHERE JGuserID = ?);";
    //console.log(data);
    db.query(sql, data.userID, (error, result) => {
      if (error) throw error;
      //console.log(result);
      socket.emit("getGroupSuccess", result);
    });
  });
  socket.on("getOtherGroup", data => {
    const sql =
      "SELECT groupID,groupName FROM GroupChat \
        WHERE groupID NOT IN (SELECT JGgroupID FROM JoinGroup WHERE JGuserID = ?);";
    db.query(sql, data.userID, (error, result) => {
      if (error) throw error;
      //console.log(result);
      socket.emit("getOtherGroupSuccess", result);
    });
  });
});

//export default App;
