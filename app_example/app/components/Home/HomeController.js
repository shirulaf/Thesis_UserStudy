
angular.module("myApp")
	.controller('HomeController' ,['LoginModel', 'localStorageModel', '$document','$window','UserService','$scope','$http','HomeModel', '$rootScope','$location', function (LoginModel, localStorageModel,$document,$window, UserService,$scope, $http, HomeModel, $rootScope,$location) {

	    //noinspection JSAnnotator
        let self=this;
        //inititate object user


        LoginModel.checkLogin();


        $scope.logged = HomeModel.getVal();


        if (!HomeModel.getVal()) {
            console.log("cookie=false")

            $scope.user = {UserName: '', password: ''};
            $rootScope.userName = "Guest"
        }

         function total()
         {
            /*
            HomeModel.getTotalCart().then(function(res)
                                      {
                                        $scope.total_amount = res;
                                         $scope.ready = true;
                                      })
                                      */
        }
     $http.get('http://localhost:8000/Users/top51')
                .then(
                        function(result) {


                            for (i = 0; i < result.data.length; i++) {
                                result.data[i].img = "assets/pics/" + result.data[i].ProductName + ".jpg";}

                                $scope.products= ( result.data);

                                if ($scope.logged==="true")
                            {

                                HomeModel.getNewProducts()
                                    .then(function (result) {
                                        $scope.newProducts=result;
                                    })
                                    .catch(function (error) {
                                        console.log(error)
                                    })
                            }

                        })

                .catch(
                        function (error) {
                            console.log(error)
                        });


        self.MyCart = function()
        {
             $location.path('/cart')
        }


        self.login = function(valid) {
            console.log("login")
            if (valid) {

               //noinspection JSAnnotator
                let name=$scope.user.UserName
                UserService.login( $scope.user).then(function (success) {
                    $window.alert('You are logged in' );

                    HomeModel.getNewProducts()
                        .then(function (result) {
                            console.log(result)
                            for (i = 0; i < result.length; i++) {
                                result[i].img = "assets/pics/" + result[i].ProductName + ".jpg";}

                            $scope.newProducts=result;
                        })
                        .catch(function (error) {
                            console.log(error)
                        })

                    $scope.logged="true";
                }, function (error) {
                    self.errorMessage = error.data;
                    $window.alert('log-in has failed');
                    console.log(error)
                })
            }
        };
     


    }]);
                         


