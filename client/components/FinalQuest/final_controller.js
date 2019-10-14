app.controller("final_controller", [
  "localStorageModel",
  "userHistory",
  "$scope",
  "$location",
  "$rootScope",
  "$document",
  "$http",
  "$window",
  "$uibModal",
  function(
    localStorageModel,
    userHistory,
    $scope,
    $location,
    $rootScope,
    $document,
    $http,
    $window,
    $uibModal
  ) {
    $scope.answers = {};
    //TODO: add required condition for input "other" - line 85
    //TODO: add links for Recsys Examples
    var modalInstance;
    var dataToSave = [];

    var host = "http://132.72.23.161:";

    var $ctrl = this;
    $scope.open = function(domainIndex) {
      $ctrl.domainIndex = domainIndex;
      modalInstance = $uibModal.open({
        templateUrl: "./components/FinalQuest/popup.html",
        controller: "ModalInstanceCtrl",
        controllerAs: "$ctrl",
        windowClass: "app-modal-window",
        size: "lg",
        resolve: {
          items: function() {
            return $ctrl.domainIndex;
          }
        }
      });
    };

    $scope.domains_label = {
      domain_movies: "סרטים",
      domain_shopping: "קניות ברשת",
      domain_news: "חדשות",
      domain_music: "מוסיקה",
      domain_travel: "תיירות"
    };

    $scope.userID = localStorageModel.getLocalStorage("userID");
    $scope.DF = {};
    $scope.DF.domain = "";
    $scope.print = function() {
      console.log("print");

      console.log($scope.DF.domain);
    };

    $scope.submitDetails = function(valid, detailsForm) {
      var d = userHistory.getDate();
      var params = {
        userID: $scope.userID,
        TimeStamp: d,
        QustionID: "FINAL"
      };

      params["guide"] = $scope.item_guide;
      params["finalQuestAnswers"] = $scope.answers;
      params["recDomain"] = $scope.DF.domain;
      params["data"] = dataToSave;

      userHistory.add(JSON.stringify(params));
      $http.post(host + "8000/saveData", params).catch(function(error) {
        console.log(error);
      });

      $location.path("/Bye");
    };

    $scope.saveClick = function($event, val) {
      var d = userHistory.getDate();
      var params = {
        userID: localStorageModel.getLocalStorage("userID"),
        TimeStamp: d,
        ElementName: $event.target.name,
        event: $event.type
      };

      if (val) params["val"] = val;

      dataToSave.push(JSON.stringify(params));
    };

    $scope.download = function() {
      userHistory.downloadHist();
    };

    $scope.present = function() {
      // $window.alert(userHistory.getHistory());
      document.getElementById("hist_area").value = userHistory.getHistory();
    };

    $scope.copy = function() {
      /* Get the text field */
      var copyText = document.getElementById("hist_area");

      /* Select the text field */
      copyText.select();
      copyText.setSelectionRange(0, 99999); /*For mobile devices*/

      /* Copy the text inside the text field */
      document.execCommand("copy");

      /* Alert the copied text */
      alert("Copied the text: " + copyText.value);
    };
  }
]);

app.controller("ModalInstanceCtrl", function($uibModalInstance, items) {
  var $ctrl = this;
  $ctrl.domainIndex = items;

  switch ($ctrl.domainIndex) {
    case 0:
      $ctrl.img = "domain_movies.png";
      break;
    case 1:
      $ctrl.img = "domain_shopping.png";
      break;
    case 2:
      $ctrl.img = "domain_news.png";
      break;
    case 3:
      $ctrl.img = "domain_music.png";
      break;
    case 4:
      $ctrl.img = "domain_travel.png";
      break;
  }

  $ctrl.ok = function() {
    $uibModalInstance.close();
  };
});
