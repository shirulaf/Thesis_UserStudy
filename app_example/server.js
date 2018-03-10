var express = require('express');  
var app = express();
var bodyParser = require('body-parser');
var Connection = require ('tedious').Connection;
app.use(bodyParser.urlencoded({ extend: false } ));
app.use(bodyParser.json());
var cors = require('cors');
app.use(cors());
 var Request = require ('tedious').Request;
var TYPES = require ('tedious').TYPES;
var router = express.Router();
var db = require ('./app/server_components/DButils.js');
var Cart = require('./app/server_components/Cart');
var Mang = require('./app/server_components/Management');
var User = require('./app/server_components/Users');
var Products = require('./app/server_components/Products');
var Pur = require('./app/server_components/Purchase');
var Search = require('./app/server_components/Search');


//check if the user exists ans go to the relevant route
app.use(express.static(__dirname + '/app'));
app.use(function (req, res, next) {
	




//-----------------------------------------------------

	console.log (req.body); 
	
	
		var CookieID = req.body.CookieID;
		if (!CookieID)
			{
				console.log("no cookie");
				req.exist=false;
				next('route');
				return;
			}
			

		var query = "select * From Login where UserID= '"  + (+CookieID) + "' and cookies ='true'";
		console.log ( query ) ;
				db.Select ( query)
		.then (function (result){
			if (result.length==1)
				{
					console.log(result);
					req.uID= result[0].userID;
					req.exist=true;

				}
			else
				req.exist=false;
		next('route');
		})
		.catch(function (error) {
		         console.log(error.message);
		         res.sendStatus(400);
		   });

		
});



		


//-------------------------------------------------------------------
//-------------------------------------------------------------------

  var server = app.listen(8000, function () {  
  var host = server.address().address  
  var port = server.address().port  
  app.use('/', router);
  app.use('/Cart', Cart);
  app.use('/Management', Mang);
  app.use('/Users', User);
  app.use('/Purchase', Pur);
  app.use('/Products',Products);
  app.use('/Search' ,Search);



  console.log("Example app listening at http://%s:%s", host, port) ;
}) ;