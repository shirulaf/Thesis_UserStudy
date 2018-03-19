
let app = angular.module('myApp', ['ngRoute', 'LocalStorageModule']);

app.value('moviesExists',false);
//-------------------------------------------------------------------------------------------------------------------
app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('node_angular_App');
});
//-------------------------------------------------------------------------------------------------------------------



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
        .when("/goodBye", {
            templateUrl : "/End.html"
        })


        .otherwise({redirect: '/'
        });
}]);
//-------------------------------------------------------------------------------------------------------------------
