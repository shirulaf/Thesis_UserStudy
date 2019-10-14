app.controller("questPOIV2_controller", [
  "localStorageModel",
  "userHistory",
  "$scope",
  "$location",
  "$http",
  "$window",
  "moviesExists",
  function(
    localStorageModel,
    userHistory,
    $scope,
    $location,
    $http,
    $window,
    UserService,
    moviesExists
  ) {
    var i = 0;
    var movies;
    var dataToSave = [];

    // var host = "http://132.72.64.204:"
    var host = "http://132.72.64.204:";

    var directory = "C:/def/";

    $scope.itemsLink = [];
    $scope.itemsName = [];
    $scope.expList = ["exp1", "exp2", "exp3", "אחר"];
    $scope.error = false;

    // $scope.posterSRC = "https://image.tmdb.org/t/p/w600_and_h900_bestv2/";
    // $scope.movieTMDsrc = "https://www.themoviedb.org/movie/";
    // console.log("localMovies : "+localStorageModel.getLocalStorage('moviesExists'))
    $scope.explain = [];

    var color = false;
    $scope.set_color = function(index) {
      if (index % 2) return { backgroundColor: "#e4e4e4", color: "black" };
      else return { backgroundColor: "#f8f8f8", color: "black" };
    };

    $scope.getPoster = function(index) {
      // console.log(index)
    };

    if (!localStorageModel.getLocalStorage("yelpData"))
      //
      $http.get(host + "8000/yelp").then(function(response) {
        //debugger
        localStorageModel.addLocalStorage("yelpData", response.data);
        movies = localStorageModel.getLocalStorage("yelpData");
        $scope.movies = movies[i];
        updateMoviesInfo(i);
      });
    else {
      movies = localStorageModel.getLocalStorage("yelpData");
      $scope.movies = movies[i];
      updateMoviesInfo(i);
    }

    $scope.nextEval = function() {
      let isValid;

      if ($scope.currentQuest > 2)
        for (index = 0; index < $scope.recItems.length; index++)
          $scope.questForm[
            "explainFieldForm_" + index
          ].explain_mov.$setValidity("required", true);

      // } else {
      //   for (index = 0; index < $scope.recItems.length; index++) {
      //     $scope.questForm["ratingFieldForm_" + index][
      //       "mov_guide_" + index + "_watched"
      //     ].$setValidity("required", true);
      //     $scope.questForm["ratingFieldForm_" + index][
      //       "mov_guide_" + index + "_chose"
      //     ].$setValidity("required", true);
      //     $scope.questForm["ratingFieldForm_" + index][
      //       "mov_guide_" + index + "_both"
      //     ].$setValidity("required", true);
      //   }
      // };

      isValid = $scope.questForm.$valid;

      if (!isValid) {
        $scope.error = true;
        console.log("not valid");

        return;
      } else $scope.error = false;

      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

      var d = userHistory.getDate();
      params = {
        TimeStamp: d,
        GroupID: movies[i].questID,
        event: "click",
        value: "next evaluation",
        currentQuest: $scope.currentQuest,
        data: dataToSave
      };

      userHistory.add(
        JSON.stringify(params, localStorageModel.getLocalStorage("userID"))
      );

      // console.log(params);
      $http.post(host + "8000/saveData", params).catch(function(error) {
        console.log(error);
      });

      dataToSave = [];

      i++;
      if (i < movies.length) {
        //setMoviesElements($scope,movies,i);
        updateMoviesInfo(i);
      } else {
        $location.path("/Final");
      }
    };

    $scope.checkedClick = function($event, elem, index, check) {
      var req = false;
      if (check) req = true;

      $scope.questForm["ratingFieldForm_" + index][
        "mov_rating_" + index + "_1"
      ].$setValidity("required", req);
      $scope.questForm["ratingFieldForm_" + index][
        "mov_rating_" + index + "_2"
      ].$setValidity("required", req);
      $scope.questForm["ratingFieldForm_" + index][
        "mov_rating_" + index + "_3"
      ].$setValidity("required", req);
      $scope.questForm["ratingFieldForm_" + index][
        "mov_rating_" + index + "_4"
      ].$setValidity("required", req);
      $scope.questForm["ratingFieldForm_" + index][
        "mov_rating_" + index + "_5"
      ].$setValidity("required", req);
      $scope.questForm["explainFieldForm_" + index]["explain_mov"].$setValidity(
        "required",
        req
      );
      // $scope.questForm["ratingFieldForm_" + index][
      //   "mov_guide_" + index + "_watched"
      // ].$setValidity("required", req);
      // $scope.questForm["ratingFieldForm_" + index][
      //   "mov_guide_" + index + "_chose"
      // ].$setValidity("required", req);
      // $scope.questForm["ratingFieldForm_" + index][
      //   "mov_guide_" + index + "_both"
      // ].$setValidity("required", req);

      $event.check = check;
      $scope.saveClick($event, $scope.recItems[index], $scope.itemsName[index]);
    };

    $scope.saveClick = function($event, movie_name, tmdb_id) {
      // console.log($event)
      var d = userHistory.getDate();
      params = {
        TimeStamp: d,
        tmdb_id: tmdb_id,
        GroupID: movies[i].questID,
        ElementName: `${$event.target.name} | ${movie_name}`,
        event: $event.type
      };

      if ($event.target.type === "checkbox") {
        params["value"] = $event.check;
      } else params["value"] = $event.target.value;

      console.log(params);
      if (params) dataToSave.push(JSON.stringify(params));
      $http.post(host + "8000/saveData", params).catch(function(error) {
        console.log(error);
      });
    };

    $scope.posters = {
      "vertical-align": "top",
      display: "inline-block",
      "*display": "inline",
      zoom: "1",
      "text-align": "center"
    };

    function updateMoviesInfo(i) {
      $scope.recItems = [];

      //Add randomness between recommended items
      let mix1, mix2, mix3;

      size = movies[i]["rec"].length;

      mix1 = Math.floor(Math.random() * size);
      mix2 = Math.floor(Math.random() * size);
      while (mix2 == mix1) mix2 = Math.floor(Math.random() * size);

      for (let i = 0; i < size; i++)
        if (mix1 == i || mix2 == i) continue;
        else {
          mix3 = i;
          break;
        }

      //debugger

      for (let index = 0; index < movies[i]["rec"].length; index++) {
        movies[i]["rec"][index]["poster"] = getSitesImages(
          movies[i]["rec"][index]["name"]
        );
      }

      $scope.recItems.push(movies[i]["rec"][mix1]);
      $scope.recItems.push(movies[i]["rec"][mix2]);

      if (size == 3) $scope.recItems.push(movies[i]["rec"][mix3]);

      this.setMoviesElements($scope, movies, i, mix1, mix2, mix3);
      $scope.QuestAmount = localStorageModel.getLocalStorage("itemsAmount");
      $scope.currentQuest = i + 1;
      $scope.previousQuest = localStorageModel.getLocalStorage(
        "lidlData"
      ).length;
      if (i == movies.length - 1) $scope.Last = true;
      else $scope.Last = false;

      // console.log($scope.Last)

      $scope.itemsLink = [];
      $scope.itemsName = [];

      $scope.itemsLink.push(movies[i]["rec"][mix1]["link"]);
      $scope.itemsLink.push(movies[i]["rec"][mix2]["link"]);

      $scope.itemsName.push(movies[i]["rec"][mix1]["name"]);
      $scope.itemsName.push(movies[i]["rec"][mix2]["name"]);

      if (size == 3) {
        $scope.itemsLink.push(movies[i]["rec"][mix3]["link"]);
        $scope.itemsName.push(movies[i]["rec"][mix3]["name"]);
      }
    }
  }
]);

function getSitesImages(name) {
  src = "components/QuestionnairePOI_v2/images/" + name + ".png";

  return src;
}

function setMoviesElements($scope, movies, i, mix1, mix2, mix3) {
  //debugger
  $scope.watched = movies[i].consumed.name;
  $scope.watched_tmdb = movies[i].consumed.link;
  $scope.watched_poster = getSitesImages(movies[i].consumed.name);
  $scope.chose = movies[i].chose.name;
  $scope.chose_tmdb = movies[i].chose.link;
  $scope.chose_poster = getSitesImages(movies[i].chose.name);

  $scope.rec_1 = movies[i]["rec"][mix1];
  $scope.rec_2 = movies[i]["rec"][mix2];
  // $scope.rec_1_tmdb = movies[i]["rec"][mix1]["]
  // $scope.rec_2_tmdb = movies[i]["rec"][mix2]["]
  // $scope.rec_3_tmdb = movies[i]["rec"][mix3]["]

  if (movies[i]["rec"].length == 3) {
    $scope.rec_3 = movies[i]["rec"][mix3];
  }

  for (expl in $scope.explain) $scope.explain[expl] = "";
}

angular.module("myApp");
