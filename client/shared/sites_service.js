angular.module("myApp").service("userHistory", [
  "localStorageModel",
  function(localStorageModel) {
    let self = this;
    self.history = [];

    self.passedTime = self.add = function(data) {
      self.history.push(data);
    };

    self.getSites = function() {
      return self.sites;
    };

    self.getDate = function() {
      var today = new Date();
      var date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      var time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = [date + " " + time, "" + Date.now()];

      return dateTime;
    };

    self.getHistory = function() {
      return self.history;
    };

    self.downloadHist = function() {
      fileName = localStorageModel.getLocalStorage("userID");
      var textToSave = self.history;
      var textToSaveAsBlob = new Blob([textToSave], { type: "text/plain" });
      var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
      var fileNameToSaveAs = fileName;

      var downloadLink = document.createElement("a");
      downloadLink.download = fileNameToSaveAs;
      downloadLink.innerHTML = "לסיום השאלון";
      downloadLink.href = textToSaveAsURL;
      downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);

      downloadLink.click();
      for (let index = 0; index < 100; index++) {
        const element = 100;
      }
    };
    function destroyClickedElement(event) {
      document.body.removeChild(event.target);
    }
  }
]);
