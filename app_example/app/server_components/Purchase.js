var express = require('express')
var router = express.Router()
let db = require ('./DButils.js');
let app = express();
var Connection = require('tedious').Connection;
var TYPES = require('tedious').TYPES;


router.use(function (req, res, next) {

	if(!req.exist )//check if admin and exist user
				{
					res.sendStatus(401).end();
					return;
				}
				
	next('route');
	
	})







router.post('/checkPurchaseInventory', function (req, res) {

	let cID= req.body.cID;

	
		let query = "SELECT ProductName, Brand,  Amount FROM  Products AS pc JOIN Inventory AS inv ON pc.ProductID=inv.ProductID WHERE pc.ProductID IN (SELECT pc.ProductID FROM ProductsInCart AS pc JOIN Inventory AS inv ON pc.ProductID=inv.ProductID WHERE pc.Amount >= inv.Amount AND pc.CartID='"+cID+"'  )";

		console.log(query);

		db.Select ( query)
		.then (function (result){
			if (result.length==0)
				res.sendStatus(200);
			else
				res.send(result);
		})
	 	.catch(function (error) {
        	res.sendStatus(400)
       	});
	});

router.post('/getPreviousOrderList', function (req, res) {

	let uID= req.uID;

	let query = "SELECT * FROM [Order] WHERE ClientID='" +uID +"'" ;
		console.log(query);

		db.Select ( query)
		.then (function (result){
			res.send(result);
		})
	 	.catch(function (error) {
        	res.sendStatus(400)
       	});
	});



router.post('/getOrderDetail', function (req, res) {

	let uID= req.uID;
	let oID= req.body.oID;

	let query = "SELECT * FROM [Order] WHERE OrderID='" +oID +"' AND ClientID='" +uID +"'" ;
		console.log(query);

		db.Select ( query)
		.then (function (result){
			res.send(result);
		})
	 	.catch(function (error) {
        	res.sendStatus(400)
       	});
	});




router.post('/ConfirmPurchase', function (req, res) {

	let uID= req.uID;
	let cc= req.body.Credit;
	let curn= req.body.currency;
	let ODate= " GETDATE()";
	let SDate= req.body.ShipmentDate;
	let cID = req.body.cID;
	let total;
	let pID_Amount;

		getTotalCartPrice(cID)
		.then (function (result){
			total=result[0].total;
			if (total==0)
			{
				res.send("No products in cart");
				return;
			}
			query = "Select ProductID, Amount from ProductsInCart where CartID ='" + cID + "'";
			console.log(query);
			db.Select(query)

			.then(function(result)
			{
				console.log(result);

				pID_Amount=result;
				console.log(pID_Amount);

				let query = "Insert into [Order] (ClientID,OrderDate,ShipmentDate,Currency,TotalAmount) VALUES ( '"  + uID + "',CONVERT (datetime, GETDATE()) , '" +SDate+ "' ,'"  + curn+ "','"  + total+ "')";
				console.log(query);
				db.Insert ( query)
				.then(function(result)
				{
					
					query = "Select top 1 OrderID FROM [Order] WHERE ClientID='" +req.uID+ "' ORDER BY OrderDate DESC ";
					console.log(query);
					db.Select ( query)
				
					.then(function(result)
					{
						console.log(result);
						let oID=result[0].OrderID;

						let query = "Insert into ProductsInOrder (OrderID, ProductID, Amount) SELECT '"+(+oID)+"', ProductID, Amount from ProductsInCart where CartID ='" + cID + "'";
						console.log(query);
						db.Insert ( query)
		
						.then(function(result)
						{
							let query = "Delete FROM ProductsInCart WHERE CartID= '"+cID+ "'";
							console.log(query);
							db.Delete ( query)
							 .then(function(result)
							{
								let query = "Update ShoppingCart SET [TotalCost]='0' WHERE CartID= '"+cID+ "'";
								console.log(query);
								db.Update ( query)
					   		})   
				   		})
			   		})
			   	})
			})
		})
			.catch(function (error) {
		 	console.log(error);
	        res.sendStatus(400)
	       	});

			res.end();
	       	return;
	});


//get current cart total cost
let getTotalCartPrice = function (cID) {
	console.log("getTotalCartPrice");
	query= " Select SUM(price*Amount) AS total FROM ProductsInCart AS sc JOIN Products as pr ON sc.ProductID=pr.ProductID WHERE CartID='" +cID+ "'";
	console.log(query);
	return db.Select (query);
};



module.exports = router

