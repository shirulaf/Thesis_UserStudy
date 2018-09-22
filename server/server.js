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
// var directory = 'C:/userStudyLogs/'
var directory = ''
var groupsData = [];
var movies = {}




obj.from.path('../data.csv').to.array(function (data) {
    //console.log(data);
    for (var index = 0; index < 86; index++) {

        MyData.push(new MyCSV(data[index][0], data[index][1], data[index][2], data[index][3], data[index][4], data[index][5], data[index][6], data[index][7], data[index][8], data[index][9], data[index][10], data[index][11], data[index][12], data[index][13], data[index][14], data[index][15], data[index][16], data[index][17], data[index][18], data[index][19], data[index][20]));
        key = String(MyData[index]["questID"])
        movies[key] = (MyData[index])

    }
    // console.log(MyData)
});

obj = csv();
obj.from.path('../randomMovies.csv').to.array(function (data2) {
    //console.log(data);
    for (var index = 0; index < data2.length; index++) {

        groupsData.push(new MyCSV2(data2[index][0], data2[index][1], data2[index][2], data2[index][3], data2[index][4], data2[index][5], data2[index][6], data2[index][7], data2[index][8], data2[index][9], data2[index][10], data2[index][11], data2[index][12]));
    }

});

app.use(express.static('server_components'));


app.post('/submitUserDetails', function (req, res) {

    var fileName = req.body.userID;
    var writeData = JSON.stringify(req.body) + '\r\n';



    //creates user file and writes his details
    fs.appendFile(directory + fileName + '.txt', writeData, function (err) {
        try {

            if (err)
                throw (err)

            else {
                //  console.log('Updated!');

                let gr = Math.floor((Math.random() * 199));

                MyData = []
                let movID;
                for (let mov in groupsData[gr]) {
                    if (mov == "groupID") continue;
                    movID = groupsData[gr][mov];
                    MyData.push(movies[movID]);
                }


                //console.log("my data res:" + JSON.stringify(MyData));
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.write(JSON.stringify(MyData));
                //console.log("my data res:" + MyData);
                res.send();
            }
        }
        catch (error) {
            console.log("catch");
            res.sendStatus(401)
            console.log(error);
        };
    });


});




app.post('/saveData', function (req, res) {
    //console.log(req.body)
    var fileName = req.body.userID;

    var data = "";

    for (det in req.body)
        data += det + ":" + req.body[det] + ",";
    data += "\r\n";

    //console.log(data)

    fs.appendFile(directory + fileName + '.txt', data, function (err) {
        try {
            if (err) throw err;
            res.sendStatus(200);
            // console.log("saveData")

        }
        catch (error) {
            res.sendStatus(401)
            console.log(error);
        };
    })
});


function MyCSV(groupID, questID, watched, watched_tmdb, watched_poster, chose, chose_tmdb, chose_poster, rec_1, rec_1_tmdb, rec_1_poster, rec_2, rec_2_tmdb, rec_2_poster, rec_3, rec_3_tmdb, rec_3_poster, rec_4, rec_4_tmdb, rec_4_poster) {
    this.groupID = groupID;
    this.questID = questID;
    this.watched = watched;
    this.chose = chose;
    this.rec_1 = rec_1;
    this.rec_2 = rec_2;
    this.rec_3 = rec_3;
    this.rec_4 = rec_4;
    this.watched_tmdb = watched_tmdb;
    this.watched_poster = watched_poster;
    this.chose_tmdb = chose_tmdb;
    this.chose_poster = chose_poster;
    this.rec_1_tmdb = rec_1_tmdb;
    this.rec_1_poster = rec_1_poster;
    this.rec_2_tmdb = rec_2_tmdb;
    this.rec_2_poster = rec_2_poster;
    this.rec_3_tmdb = rec_3_tmdb;
    this.rec_3_poster = rec_3_poster;
    this.rec_4_tmdb = rec_4_tmdb;
    this.rec_4_poster = rec_4_poster;


};


function MyCSV2(groupID, questID1, questID2, questID3, questID4, questID5, questID6, questID7, questID8, questID9, questID10, questID11, questID12) {
    this.groupID = groupID;
    this.questID1 = questID1;
    this.questID2 = questID2;
    this.questID3 = questID3;
    this.questID4 = questID4;
    this.questID5 = questID5;
    this.questID6 = questID6;
    this.questID7 = questID7;
    this.questID8 = questID8;
    this.questID9 = questID9;
    this.questID10 = questID10;
    this.questID11 = questID11;
    this.questID12 = questID12;



};
//-------------------------------------------------------------------
//-------------------------------------------------------------------

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    app.use('/', router);




    console.log("The app listening at http://%s:%s", host, port);
});
