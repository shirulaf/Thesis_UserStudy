
angular.module("myApp")
    .service('HomeModel',  function($http) {

        var login="false";

         this.setVal= function (log) {
            console.log(log);
            this.login=log;

        }

        this.getVal = function() {
            return this.login;
        };

        this.getTotalCart = function()
       {
            return $http.post('http://localhost:8000/Cart/getCartTotal' ,{CookieID: '67'})
                                      .then(function(res)
                                      {
                                        return Promise.resolve(res.data["0"].TotalCost)
                                   
                                      })
                                     
  }

        this.getNewProducts= function () {
           return $http.post('http://localhost:8000/Users/GetNewProducts', {CookieID: '67'})
            .then(function (response) {
                console.log("GetNewProducts")
                for (i = 0; i < response.data.length; i++) {
                    response.data[i].img = "assets/ass_home/img/" + response.data[i].ProductName + ".jpg";


                }

                return Promise.resolve( response.data)
            })
               .catch( function (error) {
                   return Promise.reject(error)

                   }


               )
      }
});

