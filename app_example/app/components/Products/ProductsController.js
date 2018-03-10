angular.module("myApp")
    .controller('ProductsController', ['LoginModel', '$rootScope','$document', '$window', 'ProductsModel', '$scope', '$http', function (LoginModel, $rootScope,  $document, $window, ProductsModel, $scope, $http ) {



    LoginModel.checkLogin();
    console.log($rootScope.login)
    $scope.login = $rootScope.login;




    $http.get('http://localhost:8000/Products/GetAllProducts')
        .then(
            function(result) {

                for (i = 0; i < result.data.length; i++) {
                    result.data[i].img = "assets/pics/" + result.data[i].ProductName + ".jpg";
                    result.data[i].quantity="";

                }

                $scope.products = ( result.data);


                $http.get('http://localhost:8000/Products/getCategories')
                    .then(
                        function (result) {
                            for (i = 0; i < result.data.length; i++) {
                                result.data[i].CategoryName= result.data[i].CategoryName.trim();
                            }
                            result.data[i]=""
                            $scope.categories = ( result.data);
                        })
                    .catch(
                        function (error) {
                            console.log(error)
                        })
            })
        .catch(
            function (error) {
                console.log(error)
            });


    $scope.addToCart= function (index) {
        ProductsModel.addToCart(index, $scope.products[index].quantity, $scope.products[index].ProductID)
            .then ( function (res) {
                console.log("resolve" + res)
                if (res.status === 200) {
                    $window.alert("The product wad added successfully to your cart")
                    $scope.products[index].quantity = ""
                }
                else if (res="bad") {
                    $window.alert("In order to add to your cart, product quantity must be an integer greater than 0")

                }
                else {

                    $window.alert("Problem with adding the product to cart, please contact out costumer service")
                }


            })
    }


    $scope.orderByMe = function(orderBy)
    {
        console.log(orderBy)

        $scope.myOrderBy= orderBy;
    }

}]);

