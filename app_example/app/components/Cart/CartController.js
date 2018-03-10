angular.module("myApp")
    .controller('CartController' , ['$http','$scope','CartModel','ngDialog','localStorageModel' ,function($http,$scope,CartModel,ngDialog,localStorageModel)
    {


    	$scope.cartList = [];

    	$scope.ready = false;

    	$scope.OrderList = [];
    
    	$scope.getOrderDetails =function(OrderIndex)
    	{
    		
    		OrderID = $scope.OrderList[OrderIndex].OrderID;
    		$scope.OrderList[OrderIndex].showDetails = true;
    		ngDialog.open({
   			template: 'components/Cart/orderTemplate.html',
   			data:$scope.OrderList[OrderIndex]
   		
		});
    		/*
    		$http.post('http://localhost:8000/Purchase/getOrderDetails' , {CookieID: '69' , oID:OrderID})
    		.then(function(res)
    		{
    			$scoppe.OrderList[OrderIndex].
    		})
    		*/
    	}
  		
    	$scope.HideOrderDetails = function(OrderIndex)
    	{
    		$scope.OrderList[OrderIndex].showDetails = false;
    	}


		$scope.MyOrders = function()
		{
			$http.post('http://localhost:8000/Purchase/getPreviousOrderList', {
                          CookieID: localStorageModel.getCookie("cookieID"),
                      })
                          .then(function (res) {
                              $scope.OrderList = res.data;
                              for(var i =0 ; i < res.data.length ; i++)
                              {
                              	$scope.OrderList[i].showDetails = false;
                              }
                              //console.log($scope.OrderList);
                        });
                              
        }         
                
        CartModel.getCartList()
                                    .then(function (result) {
                                    	//for(var i = 0 ; i< result.length; i++)
                                    	//	this.categories.push(result[i].CategoryName)
                                      $scope.cartList=result;
                                       CartModel.getTotalCart().then(function(res)
                                      {
                                      	$scope.total = res;
                                      	 $scope.ready = true;
                                      })
                                     
                                  })
                                    .catch(function (error) {
                                        console.log(error)
                                    })




       $scope.getDetails = function(productIndex)
    	{
    		var productId = $scope.cartList[productIndex].ProductID;
    		//productId = parseInt(productId,10)
    		
    		$http.get('http://localhost:8000/Search/GetProductDetails',{params: {ProductID: productId}})
    		.then(function(res)
    		{
    			//console.log(res.data.Object.Category)
    			//console.log(res.data.Object.Description)
    			$scope.cartList[productIndex].Category = res.data["0"].Category;
    			$scope.cartList[productIndex].Description = res.data["0"].Description;
    			//$scope.cartList[product] = res.data;
    			$scope.cartList[productIndex].showDetails = true;
    			ngDialog.open({
   				template: 'components/Cart/ProductTemplate.html',
   				data:$scope.cartList[productIndex]
   		
		});
    		})
    	}

    	$scope.Hide =function(productIndex)
    	{
    		$scope.cartList[productIndex].showDetails = false;
    	}

    	$scope.Remove = function(productIndex)
    	{
    		let productId = $scope.cartList[productIndex].ProductID;
    		$http.post('http://localhost:8000/Cart/AddToCart', {
                          CookieID: localStorageModel.getCookie("cookieID"),
                          amount: '0',
                          pID: productId
                      })
                          .then(function(result)
                          {
                          	 CartModel.getCartList()
                                    .then(function (result) {
                                    	//for(var i = 0 ; i< result.length; i++)
                                    	//	this.categories.push(result[i].CategoryName)
                                      $scope.cartList=result;
                                       CartModel.getTotalCart().then(function(res)
                                      {
                                      	$scope.total = res;
                                      	 $scope.ready = true;
                                      })
                                     
                                  })
                                    .catch(function (error) {
                                        console.log(error)
                            })
        
                           	  
    	})
    }
   
    





 }]);