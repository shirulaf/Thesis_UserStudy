var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var cors = require('cors');
app.use(cors());
var csv = require('csv');
var obj = csv();
var router = express.Router();



var fs = require('fs');
var MyData = [];
var directory= 'C:/app/US_res/'


obj.from.path('../data.csv').to.array(function (data) {
    //console.log(data);
    for (var index = 0; index < data.length; index++) {

        MyData.push(new MyCSV(data[index][0], data[index][1], data[index][2], data[index][3], data[index][4], data[index][5], data[index][6], data[index][7], data[index][8], data[index][9], data[index][10], data[index][11], data[index][12], data[index][13], data[index][14], data[index][15], data[index][16], data[index][17], data[index][18]));
    }

    // console.log(MyData)
});



app.use(express.static('server_components'));

/*app.use(function (req, res, next) {
 console.log("use")
 next();
 })*/

//-----------------------------------------------------

//	console.log (req.body);


app.post('/submitUserDetails', function (req, res) {
    console.log("submitUserDetails")

    console.log(req.body)

    var fileName= req.body.userID;

    var writeData=  JSON.stringify(req.body) + '\r\n';

    //creates user file and writes his details
    fs.appendFile(directory+fileName+'.txt',writeData , function (err) {
        if (err) throw err;
        console.log('Updated!');
    });


    //console.log("my data res:" + JSON.stringify(MyData));
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write(JSON.stringify(MyData));
    //console.log("my data res:" + MyData);
    res.send();

});







app.post('/saveData', function (req, res) {
    console.log("saveData")
    //console.log(req.body)
    var fileName=req.body.userID;

    var data = "";

    for (det in req.body)
        data += det +":" +req.body[det] +"," ;
    data+="\r\n";

    //console.log(data)

    try {
        fs.appendFile(directory+fileName + '.txt',data, function (err) {
            if (err) throw err;
            res.sendStatus(200);
            //console.log('Updated!');
        })
    }
    catch(error) {
        res.sendStatus(401)
        console.log(error);
    };
});


function MyCSV(watched, watched_tmdb, watched_poster, chose, chose_tmdb, chose_poster, rec_1, rec_1_tmdb, rec_1_poster , rec_2, rec_2_tmdb, rec_2_poster , rec_3, rec_3_tmdb, rec_3_poster , rec_4, rec_4_tmdb, rec_4_poster  ) {
    this.watched = watched;
    this.chose = chose;
    this.rec_1 = rec_1;
    this.rec_2 = rec_2;
    this.rec_3 = rec_3;
    this.rec_4 = rec_4;
    this.watched_tmdb=watched_tmdb;
    this.watched_poster= watched_poster;
    this.chose_tmdb= chose_tmdb;
    this.chose_poster = chose_poster;
    this.rec_1_tmdb= rec_1_tmdb;
    this.rec_1_poster = rec_1_poster;
    this.rec_2_tmdb= rec_2_tmdb;
    this.rec_2_poster = rec_2_poster;
    this.rec_3_tmdb= rec_3_tmdb;
    this.rec_3_poster = rec_3_poster;
    this.rec_4_tmdb= rec_4_tmdb;
    this.rec_4_poster = rec_4_poster;





};



//-------------------------------------------------------------------
//-------------------------------------------------------------------

var server = app.listen(8000, function () {
    var host = server.address().address
    var port = server.address().port
    app.use('/', router);




    console.log("The app listening at http://%s:%s", host, port) ;
});
