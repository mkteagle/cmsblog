(function() {
    'use strict';

    angular.module('auController', [])
        .controller('auController', auController);

    auController.$inject = ['$http','$localStorage', '$mdDialog', '$filter'];

    function auController($http, $localStorage, $mdDialog, $filter) {
        var self = this;
        self.email = '';
        self.password = '';
        self.confirm = '';
        self.$http = $http;
        self.addUser = addUser;
        self.cancel = cancel;

        function addUser() {
            var obj = {
                email: self.email,
                password: self.password
            };
            self.$http.post('/api/createUser', obj).then(function(response) {
                if (response.data.code) {
                }
                else {
                    var object = {
                        email: self.email,
                        uid: response.data
                    };
                    self.$http.post('/api/saveUserInDb', object).then(function(response) {
                        $mdDialog.hide();
                    }).catch(function(err) {
                        if (err) throw err;
                    })
                }
            }).catch(function(err) {
                if (err) throw err;
            });
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }

})();
