var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var cors = require("cors");
app.use(cors());
var csv = require("csv");
var obj = csv();
var router = express.Router();

var fs = require("fs");
var MyData = [];
var directory = "./userStudyLogs/";

getRandomArray = function(arrayToRandom) {
  outputArray = [];
  index_array = [];
  // console.log(arrayToRandom);
  while (arrayToRandom.length > 0) {
    index = Math.floor(Math.random() * arrayToRandom.length);
    index_array.push(index);
    outputArray.push(arrayToRandom.splice(index, 1)[0]);
  }
  // console.log(outputArray);
  return outputArray;
};

let rawdata = fs.readFileSync("Yelp_items_final_data.json");
parseData = JSON.parse(rawdata);
let yelp_items = [];
for (let item in parseData) yelp_items.push(parseData[item]);

console.log("yelp data uploded");

rawdata = fs.readFileSync("Lidl_items_final_data.json");
parseData = JSON.parse(rawdata);
let lidl_items = [];
for (let item in parseData) {
  lidl_items.push(parseData[item]);
}

console.log("lidl data uploded");
app.use(express.static("server_components"));

/*app.use(function (req, res, next) {
 console.log("use")
 next();
 })*/

//-----------------------------------------------------

//	console.log (req.body);

app.get("/lidl", function(req, res) {
  randomize_lidl = getRandomArray([...lidl_items]);
  res.send(randomize_lidl);
});
app.get("/yelp", function(req, res) {
  randomize_yelp = getRandomArray([...yelp_items]);
  res.send(randomize_yelp);
});

app.get("/itemsData", function(req, res) {
  randomize_lidl = getRandomArray([...lidl_items]);
  randomize_yelp = getRandomArray([...yelp_items]);
  totalItems = randomize_lidl.length + randomize_yelp.length;
  res.send({
    lidlData: randomize_lidl,
    yelpData: randomize_yelp,
    itemsAmount: totalItems
  });
});

app.post("/submitUserDetails", function(req, res) {
  //  console.log("submitUserDetails")

  var fileName = req.body.userID;

  var writeData = JSON.stringify(req.body) + "\r\n";

  //creates user file and writes his details
  fs.appendFile(directory + fileName + ".txt", writeData, function(err) {
    try {
      if (err) throw err;
      else {
        res.sendStatus(200);
        console.log("data sended");
      }
    } catch (error) {
      console.log("catch");
      res.sendStatus(401);
      console.log(error);
    }
  });
});

app.post("/saveData", function(req, res) {
  //console.log(req.body)
  var fileName = req.body.userID;

  var data = "";

  for (det in req.body) data += det + ":" + req.body[det] + ",";
  data += "\r\n";

  //console.log(data)

  fs.appendFile(directory + fileName + ".txt", data, function(err) {
    try {
      if (err) throw err;
      res.sendStatus(200);
      // console.log("saveData")
    } catch (error) {
      res.sendStatus(401);
      console.log(error);
    }
  });
});

//-------------------------------------------------------------------
//-------------------------------------------------------------------

var server = app.listen(8000, function() {
  var host = server.address().address;
  var port = server.address().port;
  app.use("/", router);

  console.log("The app listening at http://%s:%s", host, port);
});
