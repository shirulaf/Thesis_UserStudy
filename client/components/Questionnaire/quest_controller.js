app.controller("quest_controller", [
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

    // var host = "http://127.0.0.1:"
    var host = "http://127.0.0.1:";

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

    if (!localStorageModel.getLocalStorage("lidlData"))
      //
      $http.get(host + "8000/itemsData").then(function(response) {
        //debugger
        localStorageModel.addLocalStorage("lidlData", response.data.lidlData);
        localStorageModel.addLocalStorage("yelpData", response.data.yelpData);
        localStorageModel.addLocalStorage(
          "itemsAmount",
          response.data.itemsAmount
        );
        movies = localStorageModel.getLocalStorage("lidlData");
        $scope.movies = movies[i];
        updateMoviesInfo(i);
      });
    else {
      movies = localStorageModel.getLocalStorage("lidlData");
      $scope.movies = movies[i];
      updateMoviesInfo(i);
    }

    function getMovies() {
      // console.log("getMovies")

      params = {};
      params.userName = localStorageModel.getLocalStorage("userID");
      params.birthYear = localStorageModel.getLocalStorage("birthYear");
      $http
        .post(host + "8000/getMovies", params)
        .then(function(response) {
          // console.log("got POST")

          // console.log(response.data)

          movies = response.data;
          setMoviesElements($scope, movies, i);
        })
        .then(function() {
          localStorageModel.updateLocalStorage("moviesExists", true);
          localStorageModel.addLocalStorage("moviesData", movies);
          // console.log("Movies: " +  localStorageModel.getLocalStorage(moviesExists))
        })
        .catch(function(error) {
          // console.log(error)
          $window.alert("We encountered in some errors, please try again ");
        });
    }

    $scope.nextEval = function() {
      let isValid;

      if ($scope.currentQuest > 2) {
        for (index = 0; index < $scope.recItems.length; index++)
          $scope.questForm[
            "explainFieldForm_" + index
          ].explain_mov.$setValidity("required", true);
      } else {
        for (index = 0; index < $scope.recItems.length; index++) {
          $scope.questForm["ratingFieldForm_" + index][
            "mov_guide_" + index + "_watched"
          ].$setValidity("required", true);
          $scope.questForm["ratingFieldForm_" + index][
            "mov_guide_" + index + "_chose"
          ].$setValidity("required", true);
          $scope.questForm["ratingFieldForm_" + index][
            "mov_guide_" + index + "_both"
          ].$setValidity("required", true);
        }
      }

      isValid = $scope.questForm.$valid;

      if (!isValid) {
        $scope.error = true;
        console.log("not valid");

        return;
      } else $scope.error = false;

      var elmnt = document.getElementById("questLeft");
      elmnt.scrollTop = 0; // For Safari
      elmnt.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      elmnt = document.getElementById("questRight");
      elmnt.scrollTop = 0; // For Safari
      elmnt.scrollTop = 0; // For Chrome, Firefox, IE and Opera

      debugger;
      var d = userHistory.getDate();
      params = {
        userID: localStorageModel.getLocalStorage("userID"),
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
        $location.path("/questPOIV2");
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
      $scope.questForm["ratingFieldForm_" + index][
        "mov_guide_" + index + "_watched"
      ].$setValidity("required", req);
      $scope.questForm["ratingFieldForm_" + index][
        "mov_guide_" + index + "_chose"
      ].$setValidity("required", req);
      $scope.questForm["ratingFieldForm_" + index][
        "mov_guide_" + index + "_both"
      ].$setValidity("required", req);

      $event.check = check;
      $scope.saveClick($event, $scope.recItems[index], $scope.itemsName[index]);
    };

    $scope.saveClick = function($event, movie_name, tmdb_id) {
      // console.log($event)
      var d = userHistory.getDate();
      params = {
        userID: localStorageModel.getLocalStorage("userID"),
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
      //    $http.post(host + "8000/saveData",params)
      //         .catch(function (error) {
      //             console.log(error);
      //         });
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

      mix1 = Math.floor(Math.random() * 3);
      mix2 = Math.floor(Math.random() * 3);
      while (mix2 == mix1) mix2 = Math.floor(Math.random() * 3);

      for (let i = 0; i < 3; i++)
        if (mix1 == i || mix2 == i) continue;
        else {
          mix3 = i;
          break;
        }

      movies[i]["rec"][mix1]["name"] =
        movies[i]["rec"][mix1]["name"].charAt(0).toUpperCase() +
        movies[i]["rec"][mix1]["name"].substr(1).toLowerCase();
      movies[i]["rec"][mix2]["name"] =
        movies[i]["rec"][mix2]["name"].charAt(0).toUpperCase() +
        movies[i]["rec"][mix2]["name"].substr(1).toLowerCase();
      movies[i]["rec"][mix3]["name"] =
        movies[i]["rec"][mix3]["name"].charAt(0).toUpperCase() +
        movies[i]["rec"][mix3]["name"].substr(1).toLowerCase();
      //debugger
      $scope.recItems.push(movies[i]["rec"][mix1]);
      $scope.recItems.push(movies[i]["rec"][mix2]);
      $scope.recItems.push(movies[i]["rec"][mix3]);

      setMoviesElements($scope, movies, i, mix1, mix2, mix3);
      $scope.QuestAmount = localStorageModel.getLocalStorage("itemsAmount");
      $scope.currentQuest = i + 1;
      if (i == movies.length - 1) $scope.Last = true;
      else $scope.Last = false;

      // console.log($scope.Last)

      $scope.itemsLink = [];
      $scope.itemsName = [];

      $scope.itemsLink.push(movies[i]["rec"][mix1]["link"]);
      $scope.itemsLink.push(movies[i]["rec"][mix2]["link"]);
      $scope.itemsLink.push(movies[i]["rec"][mix3]["link"]);

      $scope.itemsName.push(movies[i]["rec"][mix1]["name"]);
      $scope.itemsName.push(movies[i]["rec"][mix2]["name"]);
      $scope.itemsName.push(movies[i]["rec"][mix3]["name"]);
    }
    function saveTextAsFile(params) {
      fileName = localStorageModel.getLocalStorage("userID") + "quest";
      var textToSave = params;
      var textToSaveAsBlob = new Blob([textToSave], { type: "text/plain" });
      var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
      var fileNameToSaveAs = fileName;

      var downloadLink = document.createElement("a");
      downloadLink.download = fileNameToSaveAs;
      downloadLink.innerHTML = "Download File";
      downloadLink.href = textToSaveAsURL;
      downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);

      downloadLink.click();
    }
    function destroyClickedElement(event) {
      document.body.removeChild(event.target);
    }

    function setMoviesElements($scope, movies, i, mix1, mix2, mix3) {
      // debugger;
      $scope.watched =
        movies[i].consumed.name.charAt(0).toUpperCase() +
        movies[i].consumed.name.substr(1).toLowerCase();
      // $scope.watched_tmdb = movies[i].watched_tmdb;
      $scope.watched_poster = movies[i].consumed.link;
      $scope.chose =
        movies[i].chose.name.charAt(0).toUpperCase() +
        movies[i].chose.name.substr(1).toLowerCase();
      // $scope.chose_tmdb = movies[i].chose_tmdb;
      $scope.chose_poster = movies[i].chose.link;

      $scope.rec_1 = movies[i]["rec"][mix1];
      $scope.rec_2 = movies[i]["rec"][mix2];
      $scope.rec_3 = movies[i]["rec"][mix3];
      // $scope.rec_1_tmdb = movies[i]["rec"][mix1]["]
      // $scope.rec_2_tmdb = movies[i]["rec"][mix2]["]
      // $scope.rec_3_tmdb = movies[i]["rec"][mix3]["]
      $scope.rec_1_poster = movies[i]["rec"][mix1]["link"];
      $scope.rec_2_poster = movies[i]["rec"][mix2]["link"];
      $scope.rec_3_poster = movies[i]["rec"][mix3]["link"];

      for (expl in $scope.explain) $scope.explain[expl] = "";
    }
  }
]);

angular.module("myApp");
