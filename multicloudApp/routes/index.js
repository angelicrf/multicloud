var express = require('express');
var router = express.Router();

// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const mongoose = require("mongoose");

const ToDos = require("../ToDos");

// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection is in (TaskDB)
const dbURI =
  //change to team mongo
  "mongodb+srv://someone:somepw@somecluster.mongodb.net/ToDosDB?retryWrites=true&w=majority";

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

const options = {
  reconnectTries: Number.MAX_VALUE,
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



/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile('index.html');
 
});

/* GET all Todos . */
router.get('/ToDos', function(req, res) {
  // find {  takes values, but leaving it blank gets all}
  ToDos.find({}, (err, AllToDos) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(AllToDos);
  });
});




/* post a new ToDo and push to Mongo */
router.post('/NewToDo', function(req, res) {

    let oneNewToDo = new ToDos(req.body);  
    console.log(req.body);
    oneNewToDo.save((err, todo) => {
      if (err) {
        res.status(500).send(err);
      }
      else {
      console.log(todo);
      res.status(201).json(todo);
      }
    });
});

// delete one ToDo
router.delete('/DeleteToDo/:id', function (req, res) {
  ToDos.deleteOne({ _id: req.params.id }, (err, note) => { 
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).json({ message: "ToDo successfully deleted" });
  });
});

// update one ToDo
router.put('/CompleteToDo', function (req, res) {
  var which = (req.body)._id;   // get the -id from the object passed up, ignore rest of it
  ToDos.findOneAndUpdate(
    { _id: which },  
    { completed: true },   // ignore the value of the object's completed prop, just force it to true
    { new: false }, // if it does not find one, do not just make up a new one.
    (err, todo) => {
      if (err) {
        res.status(500).send(err);
    }
    res.status(200).json(todo);
    })
  });

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
