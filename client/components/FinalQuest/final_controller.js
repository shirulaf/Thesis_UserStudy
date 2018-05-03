app.controller('final_controller', ['localStorageModel', '$scope', '$location', '$rootScope', '$document', '$http', '$window', '$uibModal', function (localStorageModel, $scope, $location, $rootScope, $document, $http, $window, $uibModal) {

    $scope.answers = {};
    //TODO: add required condition for input "other" - line 85
    //TODO: add links for Recsys Examples
    var modalInstance;
    var dataToSave = []

    var host = "http://132.72.23.161:"


    var $ctrl = this;
    $scope.open = function (domainIndex) {
        $ctrl.domainIndex = domainIndex;
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




    $scope.domains_label =
        {
            'domain_movies': 'סרטים',
            'domain_shopping': 'קניות ברשת',
            'domain_news': 'חדשות',
            'domain_music': 'מוסיקה',
            'domain_travel': 'תיירות',

        }

    $scope.DF = {}
    $scope.DF.domain = "";
    $scope.print = function () {
        console.log("print")

        console.log($scope.DF.domain)
    }

    $scope.submitDetails = function (valid, detailsForm) {

        var d = new Date().toUTCString();
        var params = { 'userID': localStorageModel.getLocalStorage('userID'), 'TimeStamp': d, 'QustionID': "FINAL" };
        params['finalQuestAnswers'] =JSON.stringify($scope.answers)
        params['recDomain'] = $scope.DF.domain
        params['data'] = dataToSave

        saveTextAsFile(JSON.stringify(params))

        $http.post(host + "8000/saveData", params)
            .catch(function (error) {
                console.log(error);
            });

        $location.path('/Bye')


    }


    $scope.saveClick = function ($event, val) {

        var d = new Date().toUTCString();
        var params = { 'userID': localStorageModel.getLocalStorage('userID'), 'TimeStamp': d, 'ElementName': $event.target.name, 'event': $event.type };

        if (val)
            params['val'] = val;

        dataToSave.push(JSON.stringify(params))


    }

    function saveTextAsFile(params)
    {
        fileName=localStorageModel.getLocalStorage('userID')+"final";
        var textToSave = params;
        var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
        var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
        var fileNameToSaveAs =fileName
     
        var downloadLink = document.createElement("a");
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = "Download File";
        downloadLink.href = textToSaveAsURL;
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
     
        downloadLink.click();
    }
    function destroyClickedElement(event)
    {
        document.body.removeChild(event.target);
    }
    


} ])


app.controller('ModalInstanceCtrl', function ($uibModalInstance, items) {

    var $ctrl = this;
    $ctrl.domainIndex = items;


    switch ($ctrl.domainIndex) {
        case 0:
            $ctrl.img = "domain_movies.png"
            break;
        case 1:
            $ctrl.img = "domain_shopping.png"
            break;
        case 2:
            $ctrl.img = "domain_news.png"
            break;
        case 3:
            $ctrl.img = "domain_music.png"
            break;
        case 4:
            $ctrl.img = "domain_travel.png"
            break;

    }



    $ctrl.ok = function () {
        $uibModalInstance.close();
    };


});