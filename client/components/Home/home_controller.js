app.controller("home_controller", [
  "localStorageModel",
  "userHistory",
  "$scope",
  "$location",
  "$rootScope",
  "$document",
  "$http",
  "$window",
  function(
    localStorageModel,
    userHistory,
    $scope,
    $location,
    $rootScope,
    $document,
    $http,
    $window
  ) {
    $window.localStorage.clear();

    $scope.detailsForm = {};
    console.log("Iinitiate movies status");
    localStorageModel.addLocalStorage("moviesExists", false);

    // var host= "http://132.72.64.204:"
    var host = "http://132.72.23.161:";

    $scope.DF = {};
    $scope.birthYear = [];
    for (var i = 1950; i < 2002; i++) $scope.birthYear.push(i);

    $scope.faculties = [
      "הפקולטה למדעי הבריאות",
      "הפקולטה למדעי ההנדסה",
      "הפקולטה למדעי הטבע",
      "הפקולטה למדעי הרוח והחברה",
      'הפקולטה לניהול ע"ש גילפורד גלייזר'
    ];

    $scope.userID = {
      text: ""
    };
    $scope.error = false;

    $scope.hi = function(sd) {
      console.log(sd);
    };

    $scope.defeaultMail = function() {
      if ($scope.NotStudent) {
        random = new Date().getTime();
        $scope.DF.userID = random + "";
        console.log($scope.DF.userID);
      } else $scope.DF.userID = "";
    };

    $scope.setRequiresForOccup = function() {
      let req = true;
      if ($scope.DF.Occupation === "UG" || $scope.DF.Occupation === "Master")
        req = false;

      $scope.detailsForm.Faculty.$setValidity("required", req);
      console.log($scope.detailsForm.Faculty);

      console.log("set req " + req);
    };

    $scope.submitDetails = function(isValid, detailsForm) {
      console.log(detailsForm);

      if (!isValid) {
        $scope.error = true;
        window.alert("אנא השלם את כל השדות החסרים");
        return;
      }

      //clean genres
      for (g in $scope.DF.Gen)
        if ($scope.DF.Gen[g] === false) delete $scope.DF.Gen[g];

      var d = new Date().getTime();
      $scope.DF.userID += "_" + d;

      localStorageModel.addLocalStorage("userID", $scope.DF.userID);

      console.log("DF");
      console.log($scope.DF);

      $scope.detailsForm["creationTS"] = userHistory.getDate();

      $http
        .post(host + "8000/submitUserDetails", $scope.DF)
        .then(function(response) {
          console.log("got POST");
          console.log(response.data);
          movies = response.data;
          localStorageModel.updateLocalStorage("moviesExists", true);
          localStorageModel.addLocalStorage("moviesData", movies);
        })
        .then(function() {
          $location.path("/quest");
        })
        .catch(function(error) {
          console.log(error);
          $window.alert("We encountered in some errors, please try again ");
        });
    };
  }
]);
angular.module("myApp");
