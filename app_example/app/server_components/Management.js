var express = require('express')
var router = express.Router()
let db = require ('./DButils.js');
let app = express();


//------------------------------------------------------------------------------------------------------------------
router.use(function (req, res, next) {

	let CookieID = req.body.CookieID;
	
	if (!CookieID ) //No admin cookie
	{
		if (req.url!="/login") //if not try to login
			res.sendStatus(401);
		else
			next('route'); // if try to login, login

		return;
	}

	//check cookie
	let query = "select * From Login where UserID= '"  + CookieID + "' and cookies_Admin = 'true' ";
	console.log ( query ) ;
	
	db.Select ( query)
	.then (function (result){	
	
		if (result.length==1)
		{
			req.uID= result[0].userID;
			next('route');
		}
		else
			res.sendStatus(401);
	})
	.catch(function (error) {
		res.sendStatus(400);
	});	


});

//------------------------------------------------------------------------------------------------------------------
router.post('/login', function(req, res){

if (!req.body.UserName || !req.body.password )
	{	
		res.send("Please enter user name and password");
		return;
	}	

//check if admin
	let query = "SELECT isAdmin, userID FROM Clients JOIN Login ON Clients.ClientID=Login.UserID  WHERE UserName='" +req.body.UserName+ "' AND password='" +req.body.password+ "' AND isAdmin='1'";
	console.log(query);

		db.Select ( query)
		.then (function (result){
			
			if (result.length==1){
			console.log(result);
				let query = "UPDATE Login SET cookies_Admin='true' WHERE userID='" +(+result[0].userID)+ "'";
					console.log(query);
					req.uID= (+result[0].userID);
				db.Update ( query)
				.then (function (result){
					console.log(result);
					res.json({ cookieID: req.uID});
					return;
				})
				.catch(function (error) {
	     			
	     			res.sendStatus(400);
				});
			}
			else
				res.sendStatus(401);
				
		})
		.catch(function (error) {
			console.log(error);
        	res.sendStatus(400);
       	});


});
//------------------------------------------------------------------------------------------------------------------
router.post('/logout' , function(req, res)
{
	let query = "Update Login set cookies_Admin = false where userID='" +req.ID+ "'";
	db.Update(querty)
	.then(function(result)
	{
		res.sendStatus(200);
	})
	.catch(function (error) {
       console.log(error.message);
       res.sendStatus(409);
    });

})
//------------------------------------------------------------------------------------------------------------------
router.post('/getOrderReports', function(req, res)
{
	let query = "Select * from [Order] order by OrderDate";
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

//------------------------------------------------------------------------------------------------------------------
router.post('/getInventory', function (req, res) {

	
		let query = "SELECT inv.ProductID, Products.ProductName, Products.brand, inv.Amount, inv.minAmount FROM Inventory AS inv JOIN Products ON inv.ProductID=Products.ProductID";
				console.log(query);

		db.Select ( query)
		.then (function (result){
			res.send(result);
		})
	 	.catch(function (error) {
        	res.sendStatus(400)
       	});
	});

//------------------------------------------------------------------------------------------------------------------
router.post('/getCatalog', function (req, res) {

	
		let query = "SELECT * FROM Products";
				console.log(query);

		db.Select ( query)
		.then (function (result){
			res.send(result);
		})
	 	.catch(function (error) {
        	res.sendStatus(400)
       	});
	});

//------------------------------------------------------------------------------------------------------------------
router.delete('/deleteUser', function (req, res) {

	let cID= req.body.cID;
	if (!cID)
	{
		res.send("enter client id");
		return;
	}
		let query = "DELETE FROM Clients WHERE  ClientID='" +cID+ "'";
				console.log(query);
		//delete client from clients table
		db.Delete ( query)
		.then (function (result){
			res.send(result);
		})
	 	.catch(function (error) {
        	res.sendStatus(400)
       	});
	});

//------------------------------------------------------------------------------------------------------------------
router.delete('/deleteProduct', function (req, res) {

	let pID= req.body.pID;
	if (!pID)
	{
		res.send("enter product id");
		return;
	}
	
		let query = "DELETE FROM Products WHERE  ProductID='" +pID+ "'";
				console.log(query);
		//delete client from clients table
		db.Delete ( query)
		.then (function (result){
			res.send(result);
		})
	 	.catch(function (error) {
        	res.sendStatus(400)
       	});
	});

//------------------------------------------------------------------------------------------------------------------
router.post('/addNewProduct', function (req, res) {

	if(!req.body.pName || !req.body.brand || !req.body.cat || !req.body.price)
	{
		res.send("Please fill all the required fiilds!");
		return;
	}
	let query;
	if (!req.body.desc)
		 query = "Insert into Products (ProductName,Brand,Category,price,AddDate) VALUES ( '" + req.body.pName + "' , '" + req.body.brand +"', '" + req.body.cat + "','"  + req.body.price + "' , CONVERT (date, GETDATE()))";
	else
		 query = "Insert into Products (ProductName,Brand,Category,price,Description,AddDate) VALUES ( '" + req.body.pName + "' , '" + req.body.brand +"', '" + req.body.cat + "','"  + req.body.price + "','" +req.body.desc+ "' , CONVERT (date, GETDATE()))";		
		
		console.log(query);

		db.Insert ( query)
		.then (function (result){
			res.send(result);
		})
	 	.catch(function (error) {
        	res.sendStatus(400)
       	});
	});


//------------------------------------------------------------------------------------------------------------------
router.post('/AddProductToInventory', function (req, res) {


	let query = "Insert into Inventory (ProductID,Amount,MinAmount) VALUES ( '" + req.body.pID  + "','"  + req.body.amount + "','"  + req.body.minAmount + "')";
		console.log(query);

		db.Insert ( query)
		.then (function (result){
			res.send(result);
		})
	 	.catch(function (error) {
        	res.sendStatus(400)
       	});
	});
//------------------------------------------------------------------------------------------------------------------
router.post('/UpdateProductAmount', function (req, res) {
let query;

	if (!req.body.amount)
	{
		res.send("Please enter new amount!");
		return;
	}

	if (!req.body.minAmount)
		 query = "UPDATE Inventory SET Amount='" + req.body.amount +"' WHERE  ProductID='" +req.body.pID+ "' ";
	else
		 query = "UPDATE Inventory SET Amount='" + req.body.amount +"' , minAmount='" +req.body.minAmount+ "' WHERE  ProductID='" +req.body.pID+ "' ";

		console.log(query);

		db.Insert ( query)
		.then (function (result){
			res.send(result);
		})
	 	.catch(function (error) {
        	res.sendStatus(400)
       	});
	});


//------------------------------------------------------------------------------------------------------------------


	router.post('/GetAllUsers',function(req, res)
	{
			
				 	query = "Select * from clients";
					db.Select(query)
					.then(function(result)
					{
						
						res.send(result);
					})
 
					.catch(function (error) {
 			           console.log(error.message);
        		});

				
	});
//--------------------------------------------------
		//-----ADD USER
//------------------------------------------------



//-------------------------------------------------


	router.post('/AddUSer',function (req, res) {  

	let fname = req.body.first_name;
	let lname = req.body.last_name;
	let address = req.body.address;
	let city = req.body.city;
	let country = req.body.country;
	let phone = req.body.phone;
	let cellular = req.body.cellular;
	let mail = req.body.mail;
	let cat1 = req.body.cat1;
	let cat2 = req.body.cat2;
	let cat3 = req.body.cat3;
	let ans1 = req.body.securityAnswer1.toLowerCase();
	let ans2 = req.body.securityAnswer2.toLowerCase();
	let UserName = req.body.UserName;
	let password = req.body.password;
	let isAdmin = req.body.isAdmin;



	if(!phone)
		phone = 0;
	let valid =Validiation(fname, lname, address, country, phone, cellular , mail, cat1, cat2, cat3, ans1, ans2, UserName, password,city,isAdmin);
	if(valid != "")
	{
		console.log(valid);
		res.send(valid);
		return;
	}
	else{
	let c ;
	let query = "Select * from Login where UserName ='" +	UserName +"'";
	db.Select(query)
	.then(function(result)
	{

		if(result.length == 0){
		 query = "Insert into Clients (FirstName,LastName,Address,City,Country,Phone,Cellular,Mail, isAdmin, cat1,cat2,cat3, securityAnswer1, securityAnswer2 ) Output Inserted.ClientID VALUES ( '" + fname + "' , '" + lname +"', '" + address + "','"  + city +"' , '" +country +"' , '"+phone + "' , '"+ cellular +"','"+ mail +"','" +isAdmin +"','"+ cat1 +"','"+cat2 +"','" +cat3+ "','" + ans1 +"','" +ans2+"')";
		
		db.Insert (query)
		.then (function (result){
				query = "Select Max(ClientID) as ma from clients";
				db.Select(query)
				.then(function(result)
				{
		
				c = result[0].ma;
				query = "Insert into ShoppingCart(ClientID,TotalCost) VALUES('"+ c +"',0)";
				 
				db.Insert(query)
				.then(function(result)
				{
					
					query = "Insert into Login(UserName, password, userID, cookies) VALUES('" + UserName +"','" +password +"','"+ c +"','false')"; 
					db.Insert(query)
					.then(function(result)
					{
						
						let objJson = new Object();
						objJson.UserName = UserName;
						objJson.password = password;
						res.send(objJson);
						res.end();
						return;
					
					}) 
				.catch(function (error) {
 			           console.log(error.message);
        		});

				}) 
				.catch(function (error) {
 			           console.log(error.message);
        		});
				})
				.catch(function (error) {
					console.log(error);
            		//res.sendStatus(400);
        });	
				

			})
			
				
		.catch(function (error) {
			console.log(error);
            	res.sendStatus(400);
        });
	}
	else
		res.send("The userName is already Exist");

	})

		.catch(function (error) {
			console.log(error);
            	res.sendStatus(400);
        });	
		
		
	}
});

//--------------Help Function -------------------------------------------------------------------------------------

function Validiation(fname, lname, address, country, phone, cellular , mail, cat1, cat2, cat3, ans1, ans2, UserName, password,city, isAdmin)
{
	let check_defined = CheckDefined(fname, lname, address, country, phone, cellular , mail, cat1, cat2, cat3, ans1, ans2, UserName, password,city,isAdmin)
	if( check_defined != ""){
		
		return check_defined;
	}

   if( cat1 == cat2 || cat2 == cat3 || cat1 == cat3 )
	{
		//console.log("category")
		return "Error: identical categories";
	
	}

	let check_password = checkPassword(password)
	if(check_password != "")
	{
		//console.log(check_password)
		return check_password;
		
	}

	let user_check = checkUserName(UserName);
	if(user_check != ""){
		
		return user_check;
		
	}
	let check_fname = OnlyLetters(fname,"first name");
	if( check_fname != "")
	{
		return check_fname;
	}

	let check_lname = OnlyLetters(lname,"last name");
	if( check_lname != "")
	{

		return check_lname;
	}
	let check_city = OnlyLetters(city , "city");
	if(check_city != "")
	{
		return check_city;
	} 

	let check_phone = checkDigits(phone, "phone")
	if(check_phone != "")
	{
		return check_phone;
	}
	let check_cellular = checkDigits(cellular, "cellular")
	if(check_cellular != "")
	{
		return check_cellular;
	}

	let check_address = lettersAndDigits(address, "address");
	if( check_address != "")
	{
		return check_address;
	}

	let check_ans1 = lettersAndDigits(ans1 , "Securtiy answer 1");
	if(check_ans1 != "")
	{	//console.log("h")
		return check_ans1;
	}
	let check_ans2 = lettersAndDigits(ans2 , "Securtiy answer 2");
	if(check_ans2 != "")
	{
		return check_ans2;
	}
	let check_email = validateEmail(mail);
	if(!check_email)
	{
		return "Error: Invalid Email";
	}
	return "";
}

function validateEmail(email) {
    // First check if any value was actually set
    if (email.length == 0) {return false;}
    // Now validate the email format using Regex
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    return re.test(email);
}


function checkDigits(field, nameField)
{
	if( !(/^\d+$/.test(field)))
	{
		return "Error: Field "+ nameField + " must contains digit";
	}
	else return "";

}

function lettersAndDigits(field, fieldName)
{
	if(!/^\w+$/i.test(field)){
		return "Error: " + fieldName +" must contains letters and digits";
	}
	else return "";
}

function checkPassword(password)
{
	if(password.length > 10 || password.length <= 4){
		return "Error: The Password must contains 5-10 characters";
	}
	if(!/[a-z].*[0-9]|[0-9].*[a-z]/i.test(password)){
		return "Error:Password must contains letters and digits";
	}
	if(!/^\w+$/i.test(password)){
		return "Error: Password must contains letters and digits";
	}
    return ""; 	
}

function OnlyLetters(name, fieldName)
{
	if (name != name.match(/^[a-zA-Z\s]+$/)){

      return "Error: " + fieldName +" must contains only letters" ;

	}
  return "";
}

function checkUserName(userName)
{
	if (userName != userName.match(/^[a-zA-Z\s]+$/)){
      return "Error: User Name must contains only letters" ;
	}
   if( userName.length <= 2 && userName.length >8 ){
   	return "Error: User Name lenght must contains at least 3 letters and maximun 8 letters";}
  return "";
}

function CheckDefined(fname, lname, address, country, phone, cellular , mail, cat1, cat2, cat3, ans1, ans2, UserName, password,city,isAdmin)
{
	if(!fname){
		return "Error:First Name undefined";
	}
	if(!city){
		return "Error:City undefined";
	}
	if(!lname){
		return "Error:Last Name undefined";
	}
	if(!address){
		return "Error:Address undefined";
	}
	if(!country){
		return "Error:Country  undefined";
	}
	if(!cellular){
		return "Error:Cellular undefined";
	}
	if(!mail){
		return "Error:Mail undefined";
	}
	if(!cat1){
		return "Error:Category 1  undefined";
	}
	if(!cat2){
		return "Error:Category 2 undefined";
	}
	if(!cat3){
		return "Error:Category 3 undefined";
	}
	if(!ans1){
		return "Error:Security Answer 1 undefined";
	}
	if(!ans2){
		return "Error:Security Answer 2 undefined";
	}
	if(!UserName){
		return "Error:UserName undefined";
	}
	if(!password){
		return "Error:password undefined";
	}
	if(!isAdmin){
		return "Error:isAdmin undefined";
	}
	

		return "";

}
//----------------------------------------------------------------------------------------------------------------------------------






module.exports = router

