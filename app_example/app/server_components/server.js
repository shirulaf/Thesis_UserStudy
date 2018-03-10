let express = require('express');  
let app = express();
let bodyParser = require('body-parser');
let Connection = require ('tedious').Connection;
app.use(bodyParser.urlencoded({ extend: false } ));
app.use(bodyParser.json());
let cors = require('cors');
app.use(cors());
let Request = require ('tedious').Request;
let TYPES = require ('tedious').TYPES;
let router = express.Router();
let db = require ('./DButils.js');
let Cart = require('server_components/Cart');
let Mang = require('server_components/Management');
let User = require('server_components/Users');
let Products = require('server_components/Products');
let Pur = require('server_components/Purchase');
let Search = require('server_components/Search');

//check if the user exists ans go to the relevant route

app.use(function (req, res, next) {
	




//-----------------------------------------------------

	console.log (req.body); 
	
	
		//noinspection JSAnnotator
    let CookieID = req.body.CookieID;
		if (!CookieID)
			{
				console.log("no cookie");
				req.exist=false;
				next('route');
				return;
			}
			

				let query = "select * From Login where UserID= '"  + (+CookieID) + "' and cookies ='true'";
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
			
			
		
		
})
	.catch(error)
console.log(error)



		


//-------------------------------------------------------------------
//-------------------------------------------------------------------

  let server = app.listen(8000, function () {  
  let host = server.address().address  
  let port = server.address().port  
  app.use('/', router);
  app.use('/Cart', Cart);
  app.use('/Management', Mang);
  app.use('/Users', User);
  app.use('/Purchase', Pur);
  app.use('/Products',Products);
  app.use('/Search' ,Search);
 

  console.log("Example app listening at http://%s:%s", host, port) ;
}) ;