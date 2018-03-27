

app.controller('final_controller' ,['localStorageModel','$scope','$location','$rootScope', '$document','$http','$window', '$uibModal',  function (localStorageModel,$scope, $location,$rootScope,$document,$http,$window, $uibModal)
{

    $scope.answers={};
    //TODO: add required condition for input "other" - line 85
    //TODO: add links for Recsys Examples
    var modalInstance;

    var $ctrl = this;
    $scope.open = function (domainIndex) {
        $ctrl.domainIndex=domainIndex;
             modalInstance = $uibModal.open({
            templateUrl: './components/FinalQuest/popup.html',
                 controller: 'ModalInstanceCtrl',
                 controllerAs: '$ctrl',
                 windowClass: 'app-modal-window',
                 size: 'lg',
                 resolve: {
                     items: function () {
                         return $ctrl.domainIndex;
                     }
                 }
             });


    };




    $scope.domains_label=
        {
            'domain_movies'     :    'סרטים'     ,
            'domain_shopping'   :    'קניות ברשת',
            'domain_news'       :    'חדשות'     ,
            'domain_music'      :    'מוסיקה'    ,
            'domain_travel'     :    'תיירות'    ,

        }

    $scope.DF={}
    $scope.DF.domain="";
    $scope.print = function () {
        console.log("print")

        console.log($scope.DF.domain)
    }

    $scope.submitDetails= function(valid, detailsForm){
        console.log($scope.answers)

        var d = new Date().toUTCString();
        var params = {'userID': localStorageModel.getLocalStorage('userEmail'), 'TimeStamp':d, 'QustionID': "FINAL" };




        console.log(params);
        $http.post("http://localhost:8000/saveData",$scope.answers)
            .catch(function (error) {
                console.log(error);
            });

        $location.path('/Bye')


    }




}


])

app.controller('ModalInstanceCtrl', function ($uibModalInstance, items) {

    var $ctrl = this;
    $ctrl.domainIndex=items;


    switch ($ctrl.domainIndex)
    {
        case 0:
            $ctrl.img="domain_movies.png"
            break;
        case 1:
            $ctrl.img="domain_shopping.png"
            break;
        case 2:
            $ctrl.img="domain_news.png"
            break;
        case 3:
            $ctrl.img="domain_music.png"
            break;
        case 4:
            $ctrl.img="domain_travel.png"
            break;

    }



    $ctrl.ok = function () {
        $uibModalInstance.close();
    };


});