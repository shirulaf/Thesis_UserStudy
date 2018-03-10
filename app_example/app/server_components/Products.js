var express = require('express')
var router = express.Router()
let db = require ('./DButils.js');
let app = express();

router.use(function (req, res, next) {

	console.log("products module")


	next('route');

	})






//--------------------------------------------------------------------------------------------------------------------------------
router.get('/GetCategories',function (req, res) {
		
		let query = "Select CategoryName From Categories";
		
		db.Select ( query)
		.then (function (result){
			res.send(result)
 

		})
		.catch(function (error) {
            console.log(error.message);
        });
				
		
	});

//-------------------------------------------------------------------------------------------------------------------------------------

router.post('/getSpecialProducts',function(req, res)
	{
		let userID = req.body.CookieID;;
			
			query1 = "(Select cat1 From Clients Where ClientID='" + userID +"')";
			query2 = "(Select cat2 From Clients Where ClientID='" + userID +"')";
			query3 = "(Select cat3 From Clients Where ClientID='" + userID +"')";
			query = "Select Top 5 ProductID, ProductName,Category, Brand,Price, Description From Products where Category IN" + query1+ " OR Category IN" + query2 +" OR Category IN" +query3 +"";
			db.Select(query)
			.then(function(result)
			{
				res.send(result);
			})
			.catch(function (error) {
 		   	console.log(error.message);
 			res.sendStatus(400);
        	});

	});

//-------------------------------------------------------------------------------------------------------------------------------------

router.get('/GetAllProducts', function (req, res) {

	console.log("get all products")

		let query = "Select ProductName,ProductID, Brand, Category, Price, Description From Products Order By Category";
		
		db.Select ( query)
		.then (function (result){
			res.send(result)
 

		})
		.catch(function (error) {
            console.log(error.message);
        });
				
		
	});


//-------------------------------------------------------------------------------------------------------------------------------------
router.get('/GetProductsByCategory',function (req, res) {
		
		let category = req.param('category');
		if(!Category)
			res.send("You Must Send Category");
		let query = "Select * From Products where Category ='" + category +"'";
		
		db.Select ( query)
		.then (function (result){
			if(result.length == 0)
				res.send("Category does not exist");
			else
			res.send(result)
 

		})
		.catch(function (error) {
            console.log(error.message);
        });
				
		
	});
	module.exports = router
