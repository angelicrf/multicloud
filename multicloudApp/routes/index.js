var express = require('express');
var router = express.Router();

 
// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const mongoose = require("mongoose");

const MCUsers = require("../McUsers");

// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection is in (TaskDB)
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
  res.sendFile('index.html');
});

/* GET all Users. */
router.get('/AllMCUsers', function(req, res) {
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
});

/* GET one User by ID */
router.get('/MCUserByID/:id', function (req, res) {
  MCUsers.findById({ _id: req.params.id }, (err, result) => {
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

/* GET one User by UserName and Password */
router.get('/MCUserByUsrNmPwd', function (req, res) {
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
    }
  });
});
//UserMongoCR SignIn
router.get('/UserMongoCR', function (req, res) {
  console.log('userMongoCR called')
  MCUsers.find({}, (err, AllClients) => {
    console.log('userMongoCR called2' + AllClients)
    if (err) {
      console.log("Error from userMongoCR" + err);
      res.status(500).send(err);
    }
    res.status(200).json(AllClients);
  })
})
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
router.patch('/UpdateMCUser/:id', function (req, res) {
  MCUsers.findById({ _id: req.params.id }, async (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else {
      if (req.body.password) {
        result.password = req.body.password
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
        res.status(404);
        res.send({ errot: "Update save failed!" });
      }
    }
  });
});

/* delete one User */
/* router.delete('/DeleteMCUser/:id', function (req, res) {
  MCUsers.deleteOne({ _id: req.params.id }, (err, result) => { 
    if (err) {
      console.log(err);
      res.status(404).send(err);
    }
    else {
      console.log("MCUser successfully deleted");
      console.log(result);
      res.status(200).json({ message: "MCUser successfully deleted" });
    }
  });
}); */

  // for this version, we will keep data on server in an array
heroArray = [];

//constructor
function Hero(pId, pName, pPower) {
  this.id= pId;
  this.name = pName;
  this.power = pPower;
  }

  // pre-populate with some data
heroArray.push( new Hero (11, 'Dr Nice', "Fire") );
heroArray.push( new Hero (12, 'Narco', "Invisible") );
heroArray.push( new Hero (13, 'Bombasto', "Fire") );
heroArray.push( new Hero (14, 'Celeritas',"X-Ray Vision") );
heroArray.push( new Hero (15, 'Magneta', "Invisible") );
heroArray.push( new Hero (16, 'RubberMan',"X-Ray Vision") );
heroArray.push( new Hero (17, 'Dynama', "Invisible") );
heroArray.push( new Hero (18, 'Dr IQ', "X-Ray Vision") );
heroArray.push( new Hero (19, 'Magma', "Fire") );
heroArray.push( new Hero (20, 'Tornado', "Invisible") );

let usersArray = [];

usersArray.push(new User('jack', 'Broadly','jkbrdl','52413'));
usersArray.push(new User('tom', 'Thumb','lilTom','qwerty'));

router.get('/users', (req,res) => {
  console.log(usersArray)
  res.status(200).json(usersArray)
});

router.get('/heroes', function(req, res) {
  res.status(200).json(heroArray);
    console.log(heroArray);
});

router.get('/heroes/:id', function(req, res) {
  let found = false;
    for(var i=0; i < heroArray.length; i++)
    {
      if( heroArray[i].id == req.params.id)
      {
        console.log(heroArray[i]);
        found = true
        res.status(200).json(heroArray[i]);
      }
    }
    if(found === false){
      res.status(500).send("no such hero");
      }

  });
  router.put('/heroes/:id', function(req, res) {
    var changedHero = req.body; 
   for(var i=0; i < heroArray.length; i++)
   {
     if( heroArray[i].id == req.params.id)
     {
       heroArray[i].name = changedHero.name;
       heroArray[i].power = changedHero.power;
       console.log(heroArray[i]);
       found = true
       res.status(200).json(heroArray[i]);
     }
   }
   if(found === false){
     res.status(500).send(err);
   }
 });
// delete is used to delete existing object
router.delete('/heroes/:id', function(req, res) {
  for(var i=0; i < heroArray.length; i++)
  {
    if( heroArray[i].id == req.params.id)
    {
      heroArray.splice(i,1);
      found = true
      res.status(200).json('deleted hero');
    }
  }
  if(found === false){
    res.status(500).send(err);
  }
});
router.post("/heroes", function(req, res) {

   // sort by id (need to create a new, unique id)
   heroArray.sort(function(a, b) {
    return (a.id) - (b.id);
   });
   var newID = (heroArray[heroArray.length-1].id) +1;
   var newHero = new Hero(newID, req.body.name, req.body.power);  // need to fix !!!!!
   heroArray.push(newHero);
   res.status(200).json(newHero);  // returns the new hero which the observable 
  // uses to update the client side array so the display looks correct.
});
// router.post("/heroes", function(req, res) {

//   // sort by id (need to create a new, unique id)
//   heroArray.sort(function(a, b) {
//    return (a.id) - (b.id);
//   });
//  var newID = (heroArray[heroArray.length-1].id) +1;

//  var newHero = req.body;
//  newHero.id = newID;
//  heroArray.push(newHero);
//  res.status(200).json(newHero);  // returns the new hero which the observable 
//  // uses to update the client side array so the display looks correct.
// });

module.exports = router;
