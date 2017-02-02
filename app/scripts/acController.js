(function() {
    'use strict';
    angular.module('acController', [])
        .controller('acController', acController);
    acController.$inject = ['$http', '$mdDialog', '$filter', '$localStorage'];

    function acController($http, $mdDialog, $filter, $localStorage) {
        var self = this;
        self.$http = $http;
        self.addComment = addComment;
        self.cancel = cancel;
        self.content = '';
        self.blog = {'param': 'first-ng-post', 'uid': 'mtq4mdyzmdk0mzmynezpcnn0tmdqb3n0'};
        self.user = {};
        self.onInit = onInit;

        function onInit() {
            var uid = $localStorage.currentUser.uid;
            self.$http.post('/api/allUsers', {}).then(function(response) {
                self.user = response.data[uid];
            })
        }
        self.onInit();
        function addComment() {
            var uid = $filter('removeSpaces')('comment' + Date.now());
            self.$http.post('/api/addComment', {uid: uid, content: self.content, approved: false, blog: self.blog, created: Date.now(), user: {name: self.user.name, role: self.user.role, uid: self.user.uid}}).then(function(response) {
                $mdDialog.hide();
            }).catch(function(err) {
                if (err) throw err;
            })
        }
        function cancel() {
            $mdDialog.cancel();
        }
    }
})();
