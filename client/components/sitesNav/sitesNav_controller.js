app.controller("sitesNav_controller", [
  "$sce",
  "$http",
  "localStorageModel",
  "$scope",
  "$routeParams",
  "$location",
  "$window",

  function(
    $sce,
    $http,
    localStorageModel,
    $scope,
    $routeParams,
    $location,
    $window
  ) {
    try {
      $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
      };

      $scope.activeClass = {
        leftView: { consumed: true, chose: false, link: true, photos: false },
        rightView: {
          rec1: true,
          rec2: false,
          rec3: false,
          link: true,
          photos: false
        }
      };

      $scope.route = function(page) {
        $location.path("sitesNav/" + page + "/0/1/2");
      };

      $scope.openSiteNewPage = function(url) {
        $window.open(url, "_blank");
      };

      console.log(
        localStorageModel.getLocalStorage("yelpData")[$routeParams.id].chose
          .link
      );
      $scope.allItems = localStorageModel.getLocalStorage("yelpData");
      $scope.currentItemId = $routeParams.id;
      $scope.items = localStorageModel.getLocalStorage("yelpData")[
        $routeParams.id
      ];

      recItems = $scope.items["rec"];
      reverse_recItems = [];

      if (recItems[$routeParams.rec3])
        reverse_recItems.push(recItems[$routeParams.rec3]);
      reverse_recItems.push(recItems[$routeParams.rec2]);
      reverse_recItems.push(recItems[$routeParams.rec1]);
      $scope.items["rec"] = reverse_recItems;

      console.log($scope.items);

      //---------------------------------------------------------
      //---------- LEFT SIDE LOGIC    ---------------------------

      $scope.leftView = {};
      $scope.leftView.current = $scope.items.consumed;
      $scope.leftView.displayLink = true;

      $scope.changeLeftViewLink = function(item) {
        if (item == $scope.leftView.current) return;

        $scope.leftView.current = item;

        $scope.activeClass.leftView.chose = !$scope.activeClass.leftView.chose;
        $scope.activeClass.leftView.consumed = !$scope.activeClass.leftView
          .consumed;
        $scope.activeClass.leftView.link = true;
        $scope.activeClass.leftView.photos = false;
        $scope.leftView.displayLink = true;
      };

      $scope.changeLeftViewDisplay = function(mode) {
        if (
          (mode == "link" && $scope.leftView.displayLink) ||
          (mode != "link" && !$scope.leftView.displayLink)
        )
          return;

        $scope.leftView.displayLink = !$scope.leftView.displayLink;
        $scope.activeClass.leftView.link = !$scope.activeClass.leftView.link;
        $scope.activeClass.leftView.photos = !$scope.activeClass.leftView
          .photos;
      };

      //---------------------------------------------------------
      //---------------------------------------------------------

      //---------------------------------------------------------
      //---------- RIGHT SIDE LOGIC    ---------------------------

      //   debugger;
      $scope.rightView = {};
      $scope.recNum = $scope.items.rec.length;
      $scope.rightView.current = $scope.items.rec[$scope.recNum - 1];
      $scope.rightView.displayLink = true;

      $scope.changeRightViewLink = function(item, index) {
        if (item == $scope.rightView.current) return;

        $scope.rightView.current = item;
        index = $scope.recNum - index;

        $scope.activeClass.rightView["rec1"] = index == 1 ? true : false;
        $scope.activeClass.rightView["rec2"] = index == 2 ? true : false;
        if ($scope.recNum == 3)
          $scope.activeClass.rightView["rec3"] = index == 3 ? true : false;

        $scope.activeClass.rightView.link = true;
        $scope.activeClass.rightView.photos = false;
        $scope.rightView.displayLink = true;
      };

      $scope.changeRightViewDisplay = function(mode) {
        if (
          (mode == "link" && $scope.rightView.displayLink) ||
          (mode != "link" && !$scope.rightView.displayLink)
        )
          return;

        $scope.rightView.displayLink = !$scope.rightView.displayLink;
        $scope.activeClass.rightView.link = !$scope.activeClass.rightView.link;
        $scope.activeClass.rightView.photos = !$scope.activeClass.rightView
          .photos;
      };

      //---------------------------------------------------------
      //---------------------------------------------------------
    } catch (error) {
      console.error(error);
    }
  }
]);
