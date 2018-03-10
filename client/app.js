
let app = angular.module('myApp', ['ngRoute', 'LocalStorageModule']);

app.value('moviesExists',false);
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
    service.Movies = false;

    service.setTrue = function(movies) {



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
            controller : "home_controller as homCtrl"
        })
        .when("/quest", {
            templateUrl : "./components/Questionnaire/quest.html",
            controller : "quest_controller as questCtrl"
        })


        .otherwise({redirect: '/',
        });
}]);
//-------------------------------------------------------------------------------------------------------------------
