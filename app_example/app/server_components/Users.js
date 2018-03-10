var express = require('express')
var router = express.Router()
let db = require ('./DButils.js');
let app = express();
let counter = 0;

//------------------------------------------------------------------------------------------------------------------
router.use(function (req, res, next) {

	let valid = req.exist


    console.log("route to Users module")


	if (!valid ) //No  cookie
	{


        if (req.url!="/Login" && req.url!="/top5" && req.url!="/top51"  && req.url != "/SubmitUserDet" ) //if not try to login
			res.sendStatus(401);
		else
			next('route'); // if try to login, login

		return;
	}

    next('route');
});

//-------------------------------------------------
router.get( '/top51',function (req, res) {

		//console.log ( query ) ;
	console.log("get top 5");
	let query = " SELECT top 5 * FROM Products";
	
		db.Select ( query)
		.then (function (result){
			res.send(result);
 

		})
		.catch(function (error) {
            console.log("my messgae  " +  error.message);
             res.sendStatus(400)
        });
			
		
		
		
	});



//-------------------------------------------------





	router.post('/PasswordRestoreAnswer', function(req, res)
	{

		let ans1 = req.body.Ans1;
		if(ans1)
			ans1 = ans1.toLowerCase();

		let ans2 = req.body.Ans2;
		if(ans2)
			ans2 = ans2.toLowerCase();

		let UserID = req.body.CookieID;;

		if(!ans1 || !ans2)
			res.send("Error: You must send answer to the securtiy question");
		else{
		let query = "Select LogIn.password from Login Join Clients on Login.userID = Clients.ClientID  Where Login.userID ='" + UserID + "' AND Clients.securityAnswer1 ='" + ans1 +"' AND clients.securityAnswer2='" + ans2 +"'";
		//let query = "Select Login.password from Login Join Clients on Clients.ClientID = LogIn.userID";		
		db.Select(query)
		.then(function(result)
		{
			if( result.length == 1){
			
				res.send(result)
			}
			else{
				res.send(400);
			}
		})
		.catch(function (error) {
 		   console.log(error.message);
 		res.send(400);
        });
	}


	});


//-------------------------------------------------
	router.post('/Login',function (req, res) {
		
	
		console.log("try login")
		
		let user_name = req.body.UserName;
		let pass= req.body.password;
		if (!user_name || !pass )
			{
				res.send("Please enter user name and password").end();
				return;
			}


		let query = "select * From Login where UserName= '"  + user_name + "' and password= '" + pass + "'";
		console.log ( query ) ;
	
		db.Select ( query)
		.then (function (result){
			if (result.length==1)
				{
					// TODO: save cookie and uis

					let query = "UPDATE Login SET cookies='true' WHERE UserID='" +result[0].userID+ "'";
					console.log ( query ) ;
					req.uID= (+result[0].userID);
					db.Update ( query)
					.then (function (result){
						counter++;
					res.json({ cookieID: counter});
						return;

					})
					  .catch(function (error) {
 					   console.log(error.message);
 						res.send(400);
       					 });
				}

			else
			{
				console.log("login failed")
				res.sendStatus(401);
			}
		})
		.catch(function (error) {
 		   console.log(error.message);
 		res.send(400);
        });
		
	});

//------------------------------------------------
router.post('/logout' , function(req, res)
{

	if (req.exist==false)
		{
			res.sendStatus(400);
			return;
		}

	let query = "Update Login set cookies = 'false' where userID='" +(+req.uID)+ "'";
	console.log(query);
	db.Update(query)
	.then(function(result)
	{
		res.sendStatus(200);
	})
	.catch(function (error) {
       console.log(error.message);
       res.sendStatus(409);
    });

})



//-------------------------------------------------
router.get( '/top5',function (req, res) {; 

		//console.log ( query ) ;
	console.log("get top 5");
	let query = "SELECT * FROM Products join (  SELECT top 5 ProductsInOrder.ProductID , SUM(Amount) as ToatlSale  FROM [Order] join ProductsInOrder on [order].OrderID=ProductsInOrder.OrderID WHERE ((DATEDIFF(day ,[Order].OrderDate ,CONVERT (date, GETDATE()))) <=7) GROUP BY ProductsInOrder.ProductID ORDER BY SUM(Amount) DESC) as top5 on Products.ProductID=top5.ProductID";
	
		db.Select ( query)
		.then (function (result){
			res.send(result);
 

		})
		.catch(function (error) {
            console.log(error.message);
             res.sendStatus(400)
        });
			
		
		
		
	});



//-------------------------------------------------
router.post('/GetNewProducts', function(req, res)
{

	console.log ('GetNewProducts')
	let query = "Select ProductName,ProductID, Brand, Category, Price, Description, AddDate  from Products where AddDate  Between DATEADD(m, -1, GETDATE()) and GETDATE() Order By AddDate Desc";
	db.Select(query)
	.then(function(result)
	{
		res.send(result);
	})
	.catch(function (error) {
            console.log(error.message);
             res.sendStatus(400)
        });

});


//-------------------------------------------------


	router.post('/SubmitUserDet',function (req, res) {  

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

	if(!phone)
		phone = 0;
	let valid =Validiation(fname, lname, address, country, phone, cellular , mail, cat1, cat2, cat3, ans1, ans2, UserName, password,city);
	if(valid != "")
	{
		console.log(valid);
		//res.sendStatus(400)
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
		 query = "Insert into Clients (FirstName,LastName,Address,City,Country,Phone,Cellular,Mail, isAdmin, cat1,cat2,cat3, securityAnswer1, securityAnswer2 ) Output Inserted.ClientID VALUES ( '" + fname + "' , '" + lname +"', '" + address + "','"  + city +"' , '" +country +"' , '"+phone + "' , '"+ cellular +"','"+ mail +"'" +",0,'" + cat1 +"','"+cat2 +"','" +cat3+ "','" + ans1 +"','" +ans2+"')";
		
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

function Validiation(fname, lname, address, country, phone, cellular , mail, cat1, cat2, cat3, ans1, ans2, UserName, password,city)
{
	let check_defined = CheckDefined(fname, lname, address, country, phone, cellular , mail, cat1, cat2, cat3, ans1, ans2, UserName, password,city)
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
	

		return "";

}

//----------------------------------------------------------------------------------------------------------------------------------
module.exports = router;