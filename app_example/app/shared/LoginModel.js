
angular.module("myApp")
    .service('LoginModel' ,['$http', 'localStorageModel', 'HomeModel', '$rootScope', function ($http, localStorageModel, HomeModel, $rootScope) {


        let self=this;

        //checks if coolie exists in local storage - if so teh user is logged in
        self.checkLogin = function () {

            if (localStorageModel.getCookie("cookieID") != null) {
                console.log("cookie=true")
                HomeModel.setVal(true)//this model allows accsses from differnet controllers to see if teh user is connectes
                $rootScope.userName = localStorageModel.getLocalStorage("userName")
                $rootScope.total_amount = localStorageModel.getLocalStorage("total_amount")
                $rootScope.login = "true" // change the bar display for login users - for the $rootScope binding

                $http.defaults.headers.common = {
                    'cookieID': localStorageModel.getCookie("cookieID"),
                    'user': $rootScope.userName
                };


            }
            else
            {
                HomeModel.setVal(false)
                $rootScope.userName="Guest"
            }
        }
    }])

