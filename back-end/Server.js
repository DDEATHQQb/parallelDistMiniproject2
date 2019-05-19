const express = require("express");
const app = express();
const path = require("path");
const port = 8081;
const port2 = 8080;

const mysql = require("mysql");
const moment = require("moment");

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
app.get("/allrooms", res => {
  let sql =
    "select DISTINCT groupName from JoinGroup ,GroupChat where \
  JGgroupID = groupID ";
  db.query(sql, (err, result) => {
    if (err) {
      console.dir(err);
      console.log("error in server line 21");
    } else {
      res.send(JSON.stringify(result));
      res.sendCode(200);
    }
  });
});
app.post("allrooms", (req, res) => {
  let sql = "select * from GroupChat where groupID = ?;";
  db.query(sql, [req.body.groupID], result => {
    if (result.length !== 0) {
      console.log("The room ID is already existed");
      res.sendcode(404).send("ROOM_ID already exists");
    } else {
      sql = "INSERT INTO GroupChat valuess(?);";
      db.query(sql, [req.body.groupID], (error, results) => {
        if (error) {
          console.log("error in line 41");
        } else {
          res.sendCode(201);
          res.send(results);
        }
      });
    }
  });
});
app.put("/allrooms", (req, res) => {
  let sql = "select distinct * from GroupChat where groupID = ?;";
  db.query(sql, [req.body.groupID], result => {
    if (result.length !== 0) {
      res.sendStatus(200).send(result.groupName);
    } else {
      sql = "INSERT INTO GroupChat valuess(?,?);";
      db.query(sql, [req.body.groupID, ""], result => {
        res.send(result);
      });
    }
  });
});
app.delete("/allrooms", (req, res) => {
  let sql = "SELECT * FROM GroupChat WHERE groupID = ?";
  db.query(sql, [req.body.groupID], (result, error) => {
    if (error) console.log("error in line 76");
    else if (result.length == 0) {
      res.sendStatus(404);
      console.log("Room id is not found");
    } else if (result.length == 0) {
      sql = "DELETE FROM JoinGroup WHERE JGuserID=? and JGgroupID=?";
      db.query(sql, [req.body.groupID], error => {
        if (error) console.log("error in line 84");
        else res.sendStatus(200).send("ROOM_ID is deleted");
      });
    }
  });
});
// Old ----------------------------------------

//----endpoint room ----------------------------------------------------//
app.get("/room/test", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let data = [
    {
      name: "john",
      age: "5"
    },
    {
      name: "jim",
      age: 10
    }
  ];

  result = JSON.stringify(data);
  res.send(result);
});

app.get("/room/test/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let roomID = req.params.id;
  let data = [
    {
      name: "john",
      age: roomID
    },
    {
      name: "jim",
      age: roomID * 2
    }
  ];

  result = JSON.stringify(data);
  res.send(result);
});

// get = enter
// app.get("/room/:id", (req, res) => {
//   res.setHeader("Content-Type", "application/json");

//   let groupID = req.params.id;
//   const checkIfExist = "SELECT groupID FROM GroupChat WHERE groupname = ?;";
//   db.query(checkIfExist, groupID, (error, result) => {
//     if (error) throw error;
//     if (result.length == 0) {
//       console.log("Room does not exist");
//       res.sendStatus(404).send("sorry");
//       return;
//     } else {
//       console.log(groupID);
//       let sql =
//         "SELECT su.username from groupchat gc,joinGroup jg, systemuser su WHERE gc.groupname=? AND JGgroupID=gc.groupID AND isExit='0' AND jg.jgUserID=su.userid;";
//       db.query(sql, groupID, (error, result) => {
//         if (error) throw error;
//         // result = JSON.stringify(result);
//         // console.log(result);
//         // console.log(result.length);
//         output = [];
//         for (i = 0; i < result.length; i++) {
//           output.push(result[i].username);
//         }
//         res.send(output);
//       });
//     }
//   });
// });

//get =  join
app.get("/room/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  let groupID = req.params.id;

  const checkIfExist = "SELECT groupID FROM GroupChat WHERE groupname = ?;";
  db.query(checkIfExist, groupID, (error, result) => {
    if (error) throw error;
    if (result.length == 0) {
      console.log("Room does not exist");
      // res.status = 404;
      res.send("Room doest not exist");
      // res.sendStatus(404).send("sorry");
      return;
    } else {
      console.log(groupID);
      let sql =
        "SELECT su.username from groupchat gc,joinGroup jg, systemuser su WHERE gc.groupname=? AND JGgroupID=gc.groupID  AND jg.jgUserID=su.userid;";
      db.query(sql, groupID, (error, result) => {
        if (error) throw error;
        output = [];
        for (i = 0; i < result.length; i++) {
          output.push(result[i].username);
        }
        console.log(output);
        res.send(output);
      });
    }
  });
});

app.post("/room/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let username = req.body.USER_NAME
  let groupID = req.params.id;

  const checkAlreadyJoined = ""
  db.query(checkAlreadyJoined, groupID, (error, result) => {
    if (error) throw error;
    if (result.length != 0) {
      console.log("Already joined");
      res.sendStatus(200)
    } else {
      console.log(groupID);
      let sql ="INSERT INTO JoinGroup(JGuserID, JGgroupID, isExit, latestTimeRead) VALUES(?,?,'1',now());";
      db.query(sql, ,groupID, (error, result) => {
        if (error) throw error;
        output = [];
        for (i = 0; i < result.length; i++) {
          output.push(result[i].username);
        }
        console.log(output);
        res.send(output);
      });
    }
  });
});
//----endpoint room ----------------------------------------------------//

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
