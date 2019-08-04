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
var directory = "C:/userStudyLogs/";

let rawdata = fs.readFileSync("Yelp_items_final_data.json");
parseData = JSON.parse(rawdata);
let yelp_items = [];
for (let item in parseData) yelp_items.push(parseData[item]);

console.log(yelp_items);


rawdata = fs.readFileSync("Lidl_items_final_data.json");
parseData = JSON.parse(rawdata);
let lidl_items = [];
for (let item in parseData) lidl_items.push(parseData[item]);

console.log(lidl_items);
app.use(express.static("server_components"));

/*app.use(function (req, res, next) {
 console.log("use")
 next();
 })*/

//-----------------------------------------------------

//	console.log (req.body);

app.get("/lidl", function(req, res) {
  res.send(lidl_items);
});
app.get("/yelp", function(req, res) {
  res.send(yelp_items);
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
        //  console.log('Updated!');

        let gr = Math.floor(Math.random() * 199);

        MyData = [];
        let movID;
        for (let mov in groupsData[gr]) {
          if (mov == "groupID") continue;
          movID = groupsData[gr][mov];
          MyData.push(movies[movID]);
        }

        //console.log("my data res:" + JSON.stringify(MyData));
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.write(JSON.stringify(lidl_items));
        //console.log("my data res:" + MyData);
        res.send();
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
