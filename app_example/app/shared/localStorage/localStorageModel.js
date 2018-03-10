angular.module("myApp")
    .service('localStorageModel', ['localStorageService', function(localStorageService) {

        let self=this;

        self.addLocalStorage = function (key, value) {
            let dataVal = localStorageService.get(key);
            console.log(dataVal)
            if (!dataVal)
            if (localStorageService.set(key, value)) {
                console.log("data added")

                $window.alert('data was added successfully');
            }
            else
                $window.alert('failed to add the data');
        }

        self.addLocalCookie = function (key, cookie) {
            console.log("cookie " + key + cookie)
            let cookieVal = localStorageService.cookie.get(key);
            console.log(cookieVal)

            if (!cookieVal)
            if (localStorageService.cookie.set(key, cookie)) {
                console.log("cookie added")

                // $window.alert('cookie was added successfully');
            }
            else
            {
                console.log("error")
                // $window.alert('failed to add the cookie');
            }
        }

        self.getLocalStorage= function (key)
        {
           return  localStorageService.get(key)
        }

        self.getCookie = function (CookieID) {
            return localStorageService.cookie.get(CookieID)

        }



    }]);