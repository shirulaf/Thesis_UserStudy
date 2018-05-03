
let app = angular.module('myApp', ['ngRoute', 'LocalStorageModule','ui.bootstrap' ]);

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
        .when("/quest2", {
            templateUrl : "./components/Questionnaire2/quest2.html",
            controller : "quest_controller2 as questCtrl2"
        })
        .when("/quest.en", {
            templateUrl : "./components/Questionnaire/quest.en.html",
            controller : "quest_controller as questCtrl"
        })
        .when("/Final", {
            templateUrl : "./components/FinalQuest/Final.html",
            controller : "final_controller as finCtrl"
        })
        .when("/Bye", {
            templateUrl : "./components/Bye.html",
       

        })



        .otherwise({redirect: '/'
        });
}]);
//-------------------------------------------------------------------------------------------------------------------
