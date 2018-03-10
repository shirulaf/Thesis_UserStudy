var express = require('express')
var router = express.Router()
let db = require ('./DButils.js');

let app = express();


//--------------------------------------------------------------------------------------------------------------------
/*
router.get('/getCountries', function(req,res) { 
        fs.readFile('./countries.xml', function(err, data) {
            parser.parseString(data, function (err, result) {
                res.send(JSON.stringify(result));
            });
        });
    });

*/



//------------------------------------------------------------------------------------------------------------------------------

router.get('/searchBy',function(req, res)
	{
		let productName = req.param('param');;
		
		if(!productName)
			res.send("Error:You Must Insert Product name");
		else{
		let query = "Select ProductID,ProductName, Brand, Category, Price, Description From Products Where ProductName ='" + productName +"'";
		//let query = "Select Login.password from Login Join Clients on Clients.ClientID = LogIn.userID";		
		db.Select(query)
		.then(function(result)
		{
			if( result.length >= 1){
			
				res.send(result)
			}
			else{/// product not exist
				res.send("Product name:" + productName +" didnt exist");
			}
		})
		.catch(function (error) {
 		   console.log(error.message);
 		res.sendStatus(400);
        });


	}}
	);


//------------------------------------------------------------------------------------------------------------------------------------------------------
router.get('/GetProductDetails', function (req, res) {
		
		let productId = req.param('ProductID')

		if(!productId)
			res.send("Error: You must insert Product id");
		else{
			//productId =  parseInt(productId,10)
		let query = "Select ProductName, Brand, Category, Price, Description From Products Where ProductID ='" + productId +"'";
		
		db.Select ( query)
		.then (function (result){
			if(result.length == 0)
				res.send("The product does not exist")
			else
				res.send(result)
 

		})
		.catch(function (error) {
            console.log(error.message);
        });
				
		
	}
});	



	

	module.exports = router
