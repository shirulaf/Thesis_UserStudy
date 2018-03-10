/**
 * Created by user on 27/07/2017.
 */
angular.module("myApp")
    .service('ProductsModel',  function($http) {



      this.addToCart= function (index, quantity, pid) {

          return new Promise
          (
              function (resolve, reject) {
                  var ans = ""
                  var quant = quantity
                  quant = +quant
                  console.log(quant);
                  console.log(Number.isInteger(quant));


                  if (!Number.isInteger(quant) || quant <= 0) {
                        resolve("bad")
                  }
                  else {
                      $http.post('http://localhost:8000/Cart/AddToCart', {
                          CookieID: '67',
                          amount: quant,
                          pID: pid
                      })
                          .then(function (res) {
                              console.log(res)
                              resolve(res)
                          })
                  }


              }
          )
      }





    })