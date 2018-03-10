
let app = angular.module('myApp', ['ngRoute', 'LocalStorageModule','ngDialog']);
//-------------------------------------------------------------------------------------------------------------------
app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('node_angular_App');
});
//-------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------
app.controller('loginController', ['UserService', 'localStorageModel', 'HomeModel', '$location', '$window', '$scope',
       function(UserService,localStorageModel, HomeModel, $location, $window, $scope) {
        let self = this;




           self.login = function(valid) {
               let name=$scope.user.UserName

                    if (valid) {


                        UserService.login( $scope.user)
                            .then(function (success) {

                                $window.alert('You Successfully logged in!');

                                HomeModel.setVal("true")
                                $rootScope.total_amount = "0"
                                $rootScope.login="true"

                                $location.path('/')


                        }). catch (function  (error) {
                            console.log(error)
                            $window.alert('log-in has failed');
                        });
                    }
        };
}]);
//-------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------
app.factory('UserService', ['$rootScope','$http', '$window','localStorageModel' ,  function($rootScope,$http, $window, localStorageModel) {
    let service = {};
    service.isLoggedIn = false;

    service.login = function(user) {

        params = { UserName : user.UserName , password : user.password }


        return $http.post("http://localhost:8000/Users/Login", params)
            .then(function(response) {

                let token = response.data.cookieID;
                console.log(token)

                $rootScope.userName=user.UserName
                $rootScope.login="true"
                localStorageModel.addLocalStorage('userName', user.UserName)
                localStorageModel.addLocalCookie('cookieID', token)
                $http.defaults.headers.common = {
                    'cookieID': token,
                    'user' : user.UserName
                };
                service.isLoggedIn = true;
                console.log("return promise")
                return Promise.resolve(response);
            })
            .catch(function (e) {
                return Promise.reject(e);
            });
    };
    return service;
}]);
//-------------------------------------------------------------------------------------------------------------------
app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
}]);
//----------------------------------------------------------------
app.config( ['$routeProvider', function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "./components/Home/home.html",
            controller : "HomeController as homCtrl"
        })
         .when("/login", {
            templateUrl : "./components/Home/Login.html",
             controller: "loginController as logCtrl"
        })
         .when("/register", {
            templateUrl : "./components/Register/register.html",
             controller: "RegisterController as RegCtrl"
        })
        .when("/products", {
            templateUrl : "./components/Products/products.html",
            controller : "ProductsController as prodCtrl"
        })

        .when("/StorageExample", {
            templateUrl : "views/StorageExample.html",
            controller: 'StorageExampleController'
        })
        .when("/about", {
             templateUrl : "./components/about.html",
            // controller: 'StorageExampleController'
        })
        .when("/cart", {
            templateUrl:"./components/Cart/cart.html",
            controller: "CartController"
        })
        .otherwise({redirect: '/',
        });
}]);
//-------------------------------------------------------------------------------------------------------------------
