angular.module("myApp").service("userHistory", [
  "localStorageModel",
  function(localStorageModel) {
    let self = this;
    self.history = [];

    self.add = function(data) {
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
      var dateTime = date + " " + time;

      return dateTime;
    };

    self.downloadHist = function() {
      fileName = localStorageModel.getLocalStorage("userID") + "quest";
      var textToSave = self.history;
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
    };
    function destroyClickedElement(event) {
      document.body.removeChild(event.target);
    }
  }
]);
