
angular.module("myApp")
    .service('RegisterModel',  function($http) {


        this.getCategories= function () {
           return $http.get('http://localhost:8000/Products/getCategories')
            .then(function (response) {
                console.log("Get categories")
               
                return Promise.resolve(response.data)

            })
               .catch( function (error) {
                   return Promise.reject(error)

            }


            )
      }

      this.getCountries = function()
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

         function myFunction(xml) {
               var xmlDoc = xml.responseXML;
                var x = xmlDoc.getElementsByTagName("Name");
                return Promise.resolve(x);

          
        }
      }

      

     
});

