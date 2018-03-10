angular.module("myApp")
    .controller('RegisterController' , ['$http','$scope', 'RegisterModel','$location', function($http,$scope, RegisterModel,$location )

	{
		 $scope.categories = [];
		 $scope.cat1="";
		 $scope.cat2="";
		 $scope.cat3="";
         $scope.countries =[];

        
      
        // $log.info(xmlDoc);		
		$scope.register = function()
		{

			var Indata = {'first_name': $scope.firstName, 'last_name': $scope.lastName,'address':$scope.address, 'city':$scope.city,'country':$scope.country.CountryName, 'phone':$scope.phone,'cellular':$scope.cellular, 'mail':$scope.Mail,'cat1':$scope.cat1.CategoryName,'cat2':$scope.cat2.CategoryName,'cat3':$scope.cat3.CategoryName,'securityAnswer1':$scope.SecAns1,'securityAnswer2':$scope.SecAns2,'UserName':$scope.UserName,'password':$scope.password };
			$http.post('http://localhost:8000/Users/SubmitUserDet', Indata)
                    .then(
                        function (result) {
                           let userName = result.data.UserName;
                           let password = result.data.password;
                           if(password  && userName){
                                window.alert("Your User Name is:" + userName + " And Your Password is:" + password);
                           }
                            else{
                                console.log(result.data);
                                window.alert(result.data);
                                $location.path('/login')
                            }

                        })
                    .catch(
                        function (error) {
                            console.log(error)
                        })
		}

       function country()
       {
        var xhttp ;
         if(window.XMLHttpRequest)
          {
             xhttp = new XMLHttpRequest();
          }
         else
         {
             xhttp = new ActiveXObject("Microsoft.XMLHTTP");
         }
          xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
         myFunction(this);
         }
        };
         xhttp.open("GET", "countries.xml", true);
        xhttp.send();

    
       }
        function myFunction(xml) {
         var xmlDoc = xml.responseXML;
         var x = xmlDoc.getElementsByTagName("Name");
         var list = document.getElementById("country");
          for(var i = 0 ; i < x.length ; i++)
           {
               $scope.countries[i] = new Object();
              $scope.countries[i].CountryName = x[i].innerHTML;
                                           // var option = document.createElement("option");
                                           // option.text = $scope.countries[i].CountryName;
                                            //list.add(option);
          }
            $scope.ready = true;
                                     
                                            //console.log($scope.countries[0].CountryName)
         }
		RegisterModel.getCategories()
                                    .then(function (result) {
                                    	//for(var i = 0 ; i< result.length; i++)
                                    	//	this.categories.push(result[i].CategoryName)
                                      $scope.categories=result;
                                    
                                  
                                })
                                    .catch(function (error) {
                                        console.log(error)
                                    })

    country();
 	}
    
 	]);