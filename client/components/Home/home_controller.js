app.controller('home_controller' ,['localStorageModel','$scope','$location','$rootScope', '$document','$http','$window', function (localStorageModel,$scope, $location,$rootScope,$document,$http,$window) {

    $window.localStorage.clear();

    $scope.detailsForm = {};
    console.log("Iinitiate movies status");
    localStorageModel.addLocalStorage('moviesExists', false);

    var host= "http://79.176.138.52:"

    $scope.DF = {};
    $scope.birthYear = [];
    for (var i = 1950; i < 2000; i++)
        $scope.birthYear.push(i);

    $scope.faculties = ['הפקולטה למדעי הבריאות',
        'הפקולטה למדעי ההנדסה',
        'הפקולטה למדעי הטבע',
        'הפקולטה למדעי הרוח והחברה',
        'הפקולטה לניהול ע"ש גילפורד גלייזר'];

    $scope.Genres= {
        'Adventure': 'הרפתקאות',
        'Action': 'פעולה',
        'Animation': 'אנימציה',
        'Children': 'ילדים',
        'Comedy': 'קומדיה',
        'Crime': 'פשע',
        'Documentary': 'דוקומנטרי',
        'Drama': 'דרמה',
        'Adventure': 'הרפתקאות',
        'Fantasy': 'פנטסיה',
        'Horror': 'אימה',
        'Musical': 'מחזמר',
        'Mystery': 'מיסתורין',
        'Romance': 'רומנטי',
        'Sci-Fi': 'מדע-בדיוני',
        'Thriller': 'מותחן',
        'War': 'מלחמה',
        'Western': 'מערבון',
    }



    $scope.DF.Gen=
        {
        'Adventure'  : false,
        'Action'     : false,
        'Animation'  : false,
        'Children'   : false,
        'Comedy'     : false,
        'Crime'      : false,
        'Documentary': false,
        'Drama'      : false,
        'Adventure'  : false,
        'Fantasy'    : false,
        'Horror'     : false,
        'Musical'    : false,
        'Mystery'    : false,
        'Romance'    : false,
        'Sci-Fi'     : false,
        'Thriller'   : false,
        'War'        : false,
        'Western'    : false}



    $scope.userID = {
        text: ''
    };
    $scope.error = false;


    $scope.hi = function (sd) {
        console.log(sd)
    }

    $scope.defeaultMail = function () {
        if ($scope.NotStudent) {
            random = new Date().getTime();
            $scope.DF.userID = random + ""
            console.log($scope.DF.userID)

        }
        else
            $scope.DF.userID = ""

    }

    $scope.setRequiresForOccup = function () {
        let req=true;
        if ($scope.DF.Occupation==='UG' || $scope.DF.Occupation==='Master')
            req=false

            $scope.detailsForm.Faculty.$setValidity('required', req);
        console.log( $scope.detailsForm.Faculty)

        console.log("set req " +req)
    }




    $scope.submitDetails= function(isValid, detailsForm){

        console.log(detailsForm);


        if (!isValid)
        {
        $scope.error=true;
        window.alert("אנא השלם את כל השדות החסרים")
        return;
        }

        //clean genres
        for (g in $scope.DF.Gen)
            if ($scope.DF.Gen[g]===false)
                delete($scope.DF.Gen[g])

        localStorageModel.addLocalStorage('userID',$scope.DF.userID);

        console.log("DF")
        console.log($scope.DF)

        $scope.detailsForm["creationTS"]=new Date().toUTCString();

        $http.post(host + "8000/submitUserDetails", $scope.DF)
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



