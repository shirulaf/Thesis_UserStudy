var express = require('express')  
let app = express();
var router = express.Router()
let db = require ('./DButils.js');

router.use(function (req, res, next) {

	if(!req.exist)
	{
		res.sendStatus(401).end();
		return;
	}
	next('route');

	})

router.post('/getCartList',function(req, res)
{
		

		let userID = req.body.CookieID;
		let query = "Select ShoppingCart.CartID  as cartid from ShoppingCart where ClientID='" + userID + "'";
		//let query = "Select ProductID, Amount from ProductsInCart where "
		db.Select(query)
		.then(function(result){
			if(result.length == 1)
			{
				let cart = result[0].cartid;
				console.log("my cart number " + cart)
				query = "Select Products.ProductID,ProductName, Brand, Price, ProductsInCart.Amount from Products join ProductsInCart on Products.ProductID = ProductsInCart.ProductID where ProductsInCart.CartID ='" + cart + "'";
				db.Select(query)
				.then(function(result)
				{
					//console.log("here")
					res.send(result);
				})
				.catch(function (error) {
 	   				 console.log(error.message);
 	   			 	 res.send(400);
			 	});

			}
			else
			{
				res.send("Error: User didnt exist")
			}
			
			
		})

		.catch(function (error) {
 	   		 console.log(error.message);
 	   		 res.send(400);
 	});


})



//-------------------------------------------------------------------------------------------------------------------------------------------------------------

router.post('/getCartTotal',function(req, res)
	{
		let userID = req.body.CookieID;
		let query = "Select TotalCost from ShoppingCart where ClientID='" + userID + "'";
		//let query = "Select ProductID, Amount from ProductsInCart where "
		db.Select(query)
		.then(function(result){
			if(result.length == 1)
			{
				
				res.send(result);
			}
			else
			{
				res.sendStatus("Error")
			}
			
			
		})

		.catch(function (error) {
 	   		 console.log(error.message);
 	   		 res.send(400);
 	});


	})
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	router.post('/AddToCart', function (req, res) {

		console.log("im Cart");
		let pID = req.body.pID;
		let amount = req.body.amount;
		let uID = req.uID;
		let cID;

		if (!pID || !amount || (+amount<0) || !uID)
		{
			res.sendStatus("400");
			return;
		}

		let query = "SELECT * FROM ProductsInCart AS Pcart JOIN ShoppingCart as Cart ON Pcart.CartID=Cart.CartID WHERE Cart.ClientID='" +uID+ "' AND Pcart.ProductID='" +pID +"'";
				console.log(query);

		db.Select ( query)
		.then (function (result){
			console.log(result.length);

			console.log(result);
 			//new product in cart
 			if (result.length==0 && amount==0)
 				{
 					res.end();
 					return;
 				}
 			if (result.length==0) 
 			{
 				//get user cartID
 				query = "SELECT CartID FROM ShoppingCart WHERE ClientID = '" +uID+ "'" ;
 				console.log(query);

 				db.Select (query)
 				.then (function(result){
 					console.log(result);
					cID= result[0].CartID ;
					query= " INSERT INTO ProductsInCart (Amount, ProductID, CartID) VALUES ( '" + amount +"', '" +pID+ "','" +cID+"')";
 					console.log(query);
 					//insert products to cart
					db.Insert (query)
	 				.then (function(result){
	 					console.log(result);
	 					//update cart total cost
	 					updateToatal(cID);
	 				})
	 				.then (function(result){
	 					console.log("finish insert product");
	 					res.sendStatus(200).end();

	 				})
	 					.catch(function (error) {
            			console.log(error.message);
            			res.sendStatus(400)
       			 		});
	 				})				

 				.catch(function (error) {
            		console.log(error.message);
            		res.sendStatus(400);

       			 });
 				
 			}
 			else //update product amount in cart
 			{				
				cID= result[0].CartID ;

				if(amount!=0){
 				 query= " UPDATE ProductsInCart SET Amount='" +(+amount) +"' WHERE  CartID='" +cID+ "' AND ProductID='" +pID+ "'";
				
 				console.log(query);

					db.Update (query)
	 				.then (function(result){
	 					console.log(result);
	 					//update cart total cost
	 					updateToatal(cID);
	 				})
	 				.then (function(result){
	 					console.log("finish update amount");
	 					res.sendStatus(200).end();

	 				})
	 				.catch(function (error) {
            		console.log(error.message);
            	    res.sendStatus(400)

       			 	});
	 			}
			 	else
			 	{
			 		deleteProduct(cID,pID, res);
			 		//updateToatal(cID)
			 	}
	 	
 			}

		})
		.catch(function (error) {
            		console.log(error.message);
       	});
      


       

	});
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
/*router.post('/DeleteProductFromCart',function(req, res)
	{
		let userID = req.body.CookieID;
		let productID = req.body.productID;

		let query = "Select ShoppingCart.CartID  as cartid from ShoppingCart where ClientID='" + userID + "'";
		//let query = "Select ProductID, Amount from ProductsInCart where "
		db.Select(query)
		.then(function(result){
			if(result.length == 1)
			{
				let cart = result[0].cartid;
				deleteProduct(cart, productID,result);
			}
		})
	})

*/





//-------------------------------------------------------------------------------------------------------------------------------------------------------------

 //update cart total cost
 let updateToatal = function(cID) {
console.log("update total");

 	return new Promise(
 		function (resolve, reject) {
 			//calc current cart total
			getTotalCartPrice(cID)
			.then(function(result){
				//update cart total
		    	query= " UPDATE ShoppingCart SET TotalCost=CAST('" + (+result[0].total)+"' AS money)  WHERE  CartID='" +cID+ "'";
				return db.Update (query)
			
			  })

			.catch(function (error) {
		   	console.log(error.message);
		   	reject(error.message);
		   	});
		}
	);

};



//-----------------  help functions --------------------
//get product price
let getPrice = function (pID) {
	console.log("getPRice");
	query= " Select price FROM Products WHERE ProductID='" +pID+ "'";
	return db.Select (query)
};

//get current cart total cost
let getTotalCartPrice = function (cID) {
	console.log("getTotalCartPrice");
	query= " Select SUM(price*Amount) AS total FROM ProductsInCart AS sc JOIN Products as pr ON sc.ProductID=pr.ProductID WHERE CartID='" +cID+ "'";
	return db.Select (query)
};

let deleteProduct= function(cID,pID, res ) {
	query= " DELETE FROM ProductsInCart WHERE  CartID='" +cID+ "' AND ProductID='" +pID+ "'";
				
 				console.log(query);

					db.Delete (query)
	 				.then (function(result){
	 					console.log("delete product");
	 					//update cart total cost
	 					updateToatal(cID);
	 				})
	 				.then (function(result){
	 					console.log("finish delete");
	 					res.sendStatus(200).end();

	 				})
	 				.catch(function (error) {
            		console.log(error.message);
            		res.sendStatus(400)
       			 	});			 		

}



module.exports = router

