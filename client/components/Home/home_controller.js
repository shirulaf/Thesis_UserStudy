app.controller('home_controller' ,['localStorageModel','$scope','$location','$rootScope', '$document','$http','$window', function (localStorageModel,$scope, $location,$rootScope,$document,$http,$window) {

    $scope.detailsForm={};
    console.log("Iinitiate movies status");
    localStorageModel.addLocalStorage('moviesExists',false);


    $scope.DF={};
    $scope.birthYear=[];
    for (var i=1950; i<2000 ; i++)
    $scope.birthYear.push(i);


    $scope.defeaultMail= function(){
        if ($scope.isStudent)
        {
            random=new Date().getTime();
            $scope.DF.email=random+"@bgu.ac.il"
            console.log($scope.DF.email)

        }
        else
            $scope.DF.email=""

    }

    $scope.email = {
        text: ''
    };
    $scope.error=false;
    $scope.submitDetails= function(isValid){
        if (!isValid)
        {


        $scope.error=true;
        window.alert("אנא השלם את כל השדות החסרים")
        return;
        }


        localStorageModel.addLocalStorage('userEmail',$scope.DF.email);

        $scope.detailsForm["creationTS"]=new Date().toUTCString();

        $http.post("http://localhost:8010/submitUserDetails", $scope.DF)
            .then(function (response) {
                console.log("got POST")
                console.log(response.data)
movies=response.data;
                localStorageModel.updateLocalStorage('moviesExists', true);
                localStorageModel.addLocalStorage('moviesData',movies);
            }).then(function () {

            $location.path('/quest')

            })
            .catch(function (error) {
            console.log(error)
            $window.alert("We encountered in some errors, please try again ")
        });

    }



}]);
angular.module("myApp")



