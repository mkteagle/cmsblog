(function() {
    'use strict';
    angular.module('listController', [])
        .controller('listController', listController);
    listController.$inject = ['$http'];
    function listController($http) {
        var self = this;
        self.$http = $http;
        self.onInit = onInit;

        function onInit() {

        }
    }
})();