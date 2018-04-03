app.controller('quest_controller' ,['localStorageModel','$scope','$location','$http','$window','moviesExists', function (localStorageModel,$scope,$location,$http,$window, UserService,moviesExists) {
    var i=0;
    var movies;

    var host= "http://79.176.138.52:"




    $scope.moviesPosters= [];
    $scope.moviesLinks= [];
    $scope.expList = ['exp1', 'exp2', 'exp3', 'אחר'];
    $scope.error=false;

    $scope.posterSRC= "https://image.tmdb.org/t/p/w600_and_h900_bestv2/";
    $scope.movieTMDsrc= "https://www.themoviedb.org/movie/";
    console.log("localMovies : "+localStorageModel.getLocalStorage('moviesExists'))
    $scope.explain=[];

    var color=false;
    $scope.set_color = function (index) {


        if (index%2)
            return {  backgroundColor: "#272c40", color: "#e2ddb3" }
        else
            return { backgroundColor : "#5b0937" , color : "#e2ddb3"}
    }

    $scope.getPoster = function (index) {
        console.log(index)
    }




    if (!localStorageModel.getLocalStorage('moviesExists'))
        getMovies();
    else {
        movies = localStorageModel.getLocalStorage('moviesData')
        $scope.movies =movies[i];
        updateMoviesInfo(i);


    }

    function getMovies () {
        console.log("getMovies")

        params = {};
        params.userName = localStorageModel.getLocalStorage('userID');
        params.birthYear = localStorageModel.getLocalStorage('birthYear');
        $http.post(host + "8000/getMovies", params)
            .then(function (response) {
                console.log("got POST")

                console.log(response.data)

                movies = response.data;
                setMoviesElements($scope, movies, i);


            }).then(function () {

            localStorageModel.updateLocalStorage('moviesExists', true);
            localStorageModel.addLocalStorage('moviesData',movies);
            console.log("Movies: " +  localStorageModel.getLocalStorage(moviesExists))
        }).catch(function (error) {
            console.log(error)
            $window.alert("We encountered in some errors, please try again ")
          });

    };



    $scope.nextEval = function (isValid) {

      



        if ($scope.currentQuest>2)
        {
            for (index=0 ; index< $scope.moviesNames.length ; index++)
                $scope.questForm['explainFieldForm_' + index].explain_mov.$setValidity('required', true);

        }

        if (!isValid)
        {

                        $scope.error=true;
            console.log($scope.questForm )

            return;
        }
        else
            $scope.error=false;


        var elmnt = document.getElementById("questLeft");
        elmnt.scrollTop = 0; // For Safari
        elmnt.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        elmnt= document.getElementById("questRight");
        elmnt.scrollTop = 0; // For Safari
        elmnt.scrollTop = 0; // For Chrome, Firefox, IE and Opera


        var d = new Date().toUTCString();
        params = {'userID': localStorageModel.getLocalStorage('userID'), 'TimeStamp':d, 'QustionID': "TODO!!!", event: 'click',
            value: 'next evaluation', "currentQuest" :$scope.currentQuest 
        }

        // for(expl in  $scope.explain)
        //  //   console.log('user_explanation_' +$scope.moviesNames[expl] +":"+$scope.explain[expl])
        //    params['user_explanation_' +$scope.moviesNames[expl]]=$scope.explain[expl];



        console.log(params);
        $http.post(host + "8000/saveData",params)
            .catch(function (error) {
                console.log(error);
            });


        i++;
        if (i < movies.length)
        {
          setMoviesElements($scope,movies,i);
            updateMoviesInfo(i);

        }
        else
            $location.path('/Final')

    }

    $scope.checkedClick= function ($event, elem, index, check)
    {
        var req=false
        if (check)
            req=true;

            $scope.questForm['ratingFieldForm_' + index].mov_rating1.$setValidity('required', req);
            $scope.questForm['ratingFieldForm_' + index].mov_rating2.$setValidity('required', req);
            $scope.questForm['ratingFieldForm_' + index].mov_rating3.$setValidity('required', req);
            $scope.questForm['ratingFieldForm_' + index].mov_rating4.$setValidity('required', req);
            $scope.questForm['ratingFieldForm_' + index].mov_rating5.$setValidity('required', req);
            $scope.questForm['explainFieldForm_' + index].explain_mov.$setValidity('required', req);

        $event.check=check
        $scope.saveClick($event, $scope.moviesNames[index])

    }


    $scope.saveClick = function ($event,movie_name) {

        console.log($event)
        var d = new Date().toUTCString();
        params = {'userID': localStorageModel.getLocalStorage('userID'), 'TimeStamp':d, 'QustionID': "TODO!!!" , 'ElementName' : `${$event.target.name} | ${movie_name}` ,'event':$event.type};

        if($event.target.type === 'checkbox') {
            params['value'] = $event.check;
        }
        else
            params['value'] = $event.target.value



        console.log(params);
        if (params)
       $http.post(host + "8000/saveData",params)
            .catch(function (error) {
                console.log(error);
            });


    }

    $scope.posters = {
        "vertical-align" : "top",
        "display": "inline-block",
    "*display": "inline",
    "zoom": "1",
    "text-align": "center"

    }

    function updateMoviesInfo(i) {

        $scope.moviesNames=[];
        {
            $scope.moviesNames.push(movies[i].rec_1);
            $scope.moviesNames.push(movies[i].rec_2);
            $scope.moviesNames.push(movies[i].rec_3);
            if (movies[i].rec_4)
                $scope.moviesNames.push(movies[i].rec_4);
            if (movies[i].rec_5)
                $scope.moviesNames.push(movies[i].rec_5);
        }
        setMoviesElements($scope, movies, i);
        $scope.QuestAmount= movies.length;
        $scope.currentQuest=i+1;
        if (i==movies.length-1)
        $scope.Last= true;
        else
            $scope.Last= false;

        console.log($scope.Last)


        $scope.moviesPosters=[];
        $scope.moviesLinks=[];

        $scope.moviesPosters.push(movies[i].rec_1_poster);
        $scope.moviesPosters.push(movies[i].rec_2_poster);
        $scope.moviesPosters.push(movies[i].rec_3_poster);


        $scope.moviesLinks.push(movies[i].rec_1_tmdb);
        $scope.moviesLinks.push(movies[i].rec_2_tmdb);
        $scope.moviesLinks.push(movies[i].rec_3_tmdb);

        if (movies[i].rec_4) {
            $scope.moviesLinks.push(movies[i].rec_4_tmdb);
            $scope.moviesPosters.push(movies[i].rec_4_poster);
        }
        if (movies[i].rec_5) {
            $scope.moviesLinks.push(movies[i].rec_5_tmdb);
            $scope.moviesPosters.push(movies[i].rec_5_poster);
        }



    }


}]);

function setMoviesElements($scope, movies, i) {
    $scope.watched = movies[i].watched;
    $scope.watched_tmdb= movies[i].watched_tmdb;
    $scope.watched_poster = movies[i].watched_poster;
    $scope.chose = movies[i].chose;
    $scope.chose_tmdb= movies[i].chose_tmdb;
    $scope.chose_poster = movies[i].chose_poster;
    $scope.rec_1 = movies[i].rec_1;
    $scope.rec_1_tmdb= movies[i].rec_1_tmdb;
    $scope.rec_1_poster = movies[i].rec_1_poster;
    $scope.rec_2 = movies[i].rec_2;
    $scope.rec_2_tmdb= movies[i].rec_2_tmdb;
    $scope.rec_2_poster = movies[i].rec_2_poster;
    $scope.rec_3 = movies[i].rec_3;
    $scope.rec_3_tmdb=  movies[i].rec_3_tmdb;
    $scope.rec_3_poster =  movies[i].rec_3_poster;
    if (movies[i].rec_4) {
        $scope.rec_4 = movies[i].rec_4;
        $scope.rec_4_tmdb = movies[i].rec_4_tmdb;
        $scope.rec_4_poster = movies[i].rec_4_poster;
    }


    for (expl in $scope.explain)
        $scope.explain[expl]="";
}




angular.module("myApp")
