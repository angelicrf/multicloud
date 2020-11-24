var express = require('express');
var router = express.Router();

let HoldUserData = [];
let LoggedInUserID = "";
 
// mongoose is a API wrapper overtop of mongodb
const mongoose = require("mongoose");

const MCUsers = require("../McUsers");
const MCClient = require("../McCloud");

// mongodb connection string
const dbURI =
  "mongodb+srv://yelloteam:bcuser123456@cluster0.08j1d.mongodb.net/MultiCloudDB?retryWrites=true&w=majority";

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 10
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);

function User(name,lastname,username,email,password){
  this.name = name,
  this.lastname = lastname,
  this.username = username,
  this.email = email,
  this.password = password
};

/* GET home page. */
router.get('/', function(req, res) {
  console.log('Home Page route called');

  res.sendFile('index.html');
});

/* GET all Users. */
router.get('/AllMCUsers', function(req, res) {
  if (LoggedInUserID === req.body.id) {
    console.log('AllMCUsers called');

    MCUsers.find({}, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      else {
        console.log(result);
        res.status(201).json(result);
      }
    });
  }
  else {
    console.log('REQ.body.id does not match logged in user ID');
    res.status(500).send('REQ.body.id does not match logged in user ID');
  }
});

/* GET one User by ID */
router.get('/MCUserByID', function (req, res) {
  if (LoggedInUserID === req.body.id) {
    console.log('MCUserByID called');

    MCUsers.findById({ _id: req.body.id }, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      else {
        console.log(result);
        res.status(201).json(result);
      }
    });
  }
  else {
    console.log('REQ.body.id does not match logged in user ID');
    res.status(500).send('REQ.body.id does not match logged in user ID');
  }
});

/* MCUserInfo SignIn */
router.post('/MCUserInfo', function (req, res) {
  console.log('MCUserInfo called');

  HoldUserData.splice(0, HoldUserData.length);
  let holdUserName = req.body.username;
  let holdPassword = req.body.password;
  HoldUserData.push(holdUserName,holdPassword);
  res.json({username: holdUserName, password:holdPassword});
  return HoldUserData;
});

/* GET one User by UserName and Password */
router.get('/MCUserByUsrNmPwd', function (req, res) {
  console.log("username from node " + HoldUserData[0]);
  console.log("password from node " + HoldUserData[1]);
  req.body.username = HoldUserData[0];
  req.body.password = HoldUserData[1];
  
  MCUsers.findOne({
    username: req.body.username,
    password: req.body.password
  }, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else {
      console.log(result);
      res.status(201).json(result);
      LoggedInUserID = result.id;
    }
  });
  return LoggedInUserID;
});

/* post a new User and push to Mongo */
router.post('/MCUser', function(req, res) {
  console.log("MCUser called " + req.body.name);

  let oneNewMCUser = new MCUsers({
    name: req.body.name,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });  
  
  oneNewMCUser.save((err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else {
      console.log(result);
      res.status(201).json(result);
    }
  });
});

/* update one User */
router.patch('/UpdateMCUser', function (req, res) {
  if (LoggedInUserID === req.body.id) {
    console.log('UpdateMCUser called');

    MCUsers.findById({ _id: req.body.id }, async (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      else {
        if (req.body.password) {
          result.password = req.body.password
        }
        if (req.body.email) {
          result.email = req.body.email
        }
        if (req.body.lastname) {
          result.lastname = req.body.lastname
        }
        if (req.body.name) {
          result.name = req.body.name
        }
        const newResult = await result.save();
        if (newResult === result) {
          console.log(newResult);
          res.status(200).json(newResult);
        }
        else {
          res.status(404).json({ error: "Update save failed!" });
        }
      }
    });
  }
  else {
    console.log('REQ.body.id does not match logged in user ID');
    res.status(500).send('REQ.body.id does not match logged in user ID');
  }
});

/* delete one User */
router.delete('/DeleteMCUser', function (req, res) {
  if (LoggedInUserID !== '' || LoggedInUserID !== null) {
    console.log('DeleteMCUser called');

    MCUsers.findById({ _id: LoggedInUserID }, async (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      else {
        const newResult = await MCUsers.deleteOne({ username: result.username, password: result.password });
        if (newResult.n == 1 && newResult.ok == 1 && newResult.deletedCount == 1) {
          console.log(newResult);
          console.log("MCUser successfully deleted");
          res.status(200).json(newResult);
        }
        else {
          res.status(404).json({ error: "Delete failed!" });
        }
      }
    });
  }
  else {
    console.log('REQ.body.id does not match logged in user ID');
    res.status(500).send('REQ.body.id does not match logged in user ID');
  }
});

/* log out the user */
router.get('/LogOutMCUser', function (req, res) {
  console.log('LogOutMCUser called ' + JSON.stringify(req.body) + 
  ' LoggedInUserID ' + LoggedInUserID + ' HoldUserData ' + HoldUserData);

  if (LoggedInUserID !== '' || LoggedInUserID !== null) {
    LoggedInUserID = "";
    HoldUserData.splice(0, HoldUserData.length);

    console.log('HoldUserData ' + HoldUserData);
    res.status(200).send('user logged out successfully');
  }
  else {
    console.log('REQ.body.id does not match logged in user ID');
    res.status(500).send('REQ.body.id does not match logged in user ID');
  }
  return LoggedInUserID;
});

/* post Google drive client data to McCloud */
router.post('/MCGdClient', function(req, res) {
  console.log("MCGdClient called " + req.body.gdname);

  let oneNewMCClient = new MCClient({
    gdname: req.body.gdname,
    gdemail: req.body.gdemail,
    usermongoid: req.body.usermongoid
  });

  oneNewMCClient.save((err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else {
      console.log(result);
      res.status(201).json(result);
    }
  });
});

/* GET all cloud service credentials for user */
router.get('/MCClientData', function(req, res) {
  console.log('MCClientData called');

  MCClient.findOne({ usermongoid: req.body.usermongoid }, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else {
      console.log(result);
      res.status(201).json(result);
    }
  });
});

/* DELETE *ALL* of user's cloud service credentials */
router.delete('/MCClientDeleteData', function(req, res) {
  console.log('MCClientDeleteData called ' + JSON.stringify(req.body));

  MCClient.findOne({ usermongoid: req.body.usermongoid }, async (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else {
      const newResult = await MCClient.deleteOne({ usermongoid: result.usermongoid, _id: result.id });
      if (newResult.n == 1 && newResult.ok == 1 && newResult.deleteCount == 1) {
        console.log(newResult);
        console.log('MCClient successfully deleted ALL credentials');
        res,status(200).json(newResult);
      }
      else {
        console.log('MCClient delete FAILED!');
        res.status(404).json({ error: 'Delete failed!'});
      }
    }
  });
});

/* UPDATE user's cloud service credentials */
router.patch('/MCClientUpdateData', function (req, res) {
  console.log('MCClientUpdateData called ' + JSON.stringify(req.body));

  MCClient.findOne({ usermongoid: req.body.usermongoid }, async (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else {
      if (req.body.gdname) {
        result.gdname = req.body.gdname
      }
      if (req.body.gdemail) {
        result.gdemail = req.body.gdemail
      }
      const newResult = await result.save();
      if (newResult === result) {
        console.log(newResult);
        res.status(200).json(newResult);
      }
      else {
        console.log('MCClient update save FAILED!');
        res.status(404).json({ error: 'MCClient update save FAILED!' });
      }
    }
  });
});

module.exports = router;
