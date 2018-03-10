angular.module("myapp")
    .controller('storageController', ['localStorageService', 'localStorageModel' '$window', function (localStorageService,localStorageModel, $window)
    {


        //noinspection JSAnnotator
        let self= this;

        // this.cartTotal='empty'
        // this.userNameKey='Guest'
        //
        // localStorageService.set('userNameKey', this.userNameKey)
        // localStorageService.set('cartTotal',  this.cartTotal)


        self.addLocalUser= function (userName) {

            localStorageService.addLocalStorage(userNameKey,userName);
            this.userNameKey=userName

        }

        self.addLocalCookie = function ( cookie ){

            localStorageService.addLocalStorage('CookieID',cookie);

        }

        self.addLocalTotal= function (total) {

            localStorageService.addLocalStorage(cartTotal,total);
            this.cartTotal=total

        }

        self.getLocalStorage= function (key) {

            return localStorageService.getLocalStorage(key);

        }

        self.getCookie = function (CookieID)
        {
            return localStorageService.getCookie(CookieID)
        }






    }])