

angular.module("myApp")
    .service('CartModel',  function($http,localStorageModel) {

				this.getCartList = function()
				{
					return $http.post('http://localhost:8000/Cart/getCartList', {
                          CookieID: localStorageModel.getCookie("cookieID"),
                      })
                          .then(function (res) {
                              	console.log(res)
                             
                              var sum = 0;
                              for(var i=0; i < res.data.length;i++)
                              {
                              	//sum += res.data[i].Amount * res.data[i].Price;
                    			res.data[i].img = "assets/pics/" + res.data[i].ProductName + ".jpg";
                    			 res.data[i].showDetails = false;

                			  }
                			  return Promise.resolve(res.data);
                			})
                          .catch(function(error)
                          {
                          	return Promise.reject(error) 
                          })

                           //$scope.total = sum;
                           //$scope.ready = true;
                       
	}

	this.getTotalCart = function()
	{
		return $http.post('http://localhost:8000/Cart/getCartTotal' ,{CookieID: '67'})
                                      .then(function(res)
                                      {
                                      	return Promise.resolve(res.data["0"].TotalCost)
                                   
                                      })
                                     
	}
});


   