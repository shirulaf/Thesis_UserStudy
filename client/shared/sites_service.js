angular.module("myApp").service("sitesService", [
  function() {
    let self = this;
    self.sites = {};

    self.setSites = function(data) {
      self.sites = data;
    };

    self.getSites = function() {
      return self.sites;
    };
  }
]);
