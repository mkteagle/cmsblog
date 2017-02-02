(function () {
    'use strict';

    angular.module('userController', [])
        .controller('userController', userController);
    userController.$inject = ['$http', '$localStorage', '$mdDialog', 'Upload', '$mdToast', 'cmsService'];

    function userController($http, $localStorage, $mdDialog, Upload, $mdToast, cmsService) {

        var self = this;
        self.$http = $http;
        self.cmsService = cmsService;
        self.displayName = '';
        self.email = '';
        self.master = {};
        self.onInit = onInit;
        self.uid = '';
        self.users = {};
        self.updateUserSelection = updateUserSelection;
        self.activeItem = '';
        self.showPrompt = showPrompt;
        self.reloadUsers = reloadUsers;
        self.roles = ['admin', 'author', 'viewer'];
        self.showItems = false;
        self.file = '';
        self.save = save;
        self.reset = reset;
        self.updateProfilePic = updateProfilePic;

        function save(user) {
            if (user.photoUrl != self.master.photoUrl) {
                user.photoUrl = 'http://doingutahdaily.com' + user.photoUrl;
            }
            let role = self.user.role;
            self.user.role = {};
            self.user.role[role] = true;
            var object = {
                uid: user.uid,
                displayName: user.name,
                email: user.email,
                profilePic: user.photoUrl
            };
            var promise = self.cmsService.adminUpdate(object);
            promise.then(function(response) {
                var prm = self.cmsService.updateUser(user);
                prm.then(function(res) {
                    $mdToast.show(
                        $mdToast.simple()
                            .position('top right')
                            .theme('success-toast')
                            .textContent(response.data)
                            .hideDelay(3000)
                    );
                    self.reloadUsers();
                }).catch(function(err) {
                    if (err) throw err;
                })
            }).catch(function(err) {
                if (err) throw err;
            });
        }
        function reset() {
            self.user = angular.copy(self.master);
        }
        function updateProfilePic (file) {
            var promise = self.cmsService.uploadImage(file);
            promise.then(function(response) {
                self.user.photoUrl = response;
                // save(self.user);
            });
        }

        function onInit() {
            if ($localStorage.currentUser) {
                var object = {
                    uid: $localStorage.currentUser.uid
                };
                var promise = self.cmsService.locateUser(object);
                promise.then(function(response) {
                    self.displayName = response.displayName;
                    self.uid = $localStorage.currentUser.uid;
                    self.email = response.email;
                    self.profilePic = response.photoUrl;
                    self.reloadUsers();
                });
            }
        }
        self.onInit();
        function reloadUsers() {
            var promise = self.cmsService.loadUsers();
            promise.then(function(response) {
                self.users = response;
            });
        }
        function updateUserSelection(uid) {
            self.master = self.users[uid];
            self.reset();
        }

        function showPrompt(ev) {
            var confirm = $mdDialog.prompt({
                controller: 'auController as auc',
                templateUrl: './templates/adduser.html',
                // parent: angular.element(document.body);
                targetEvent: ev,
            });

            $mdDialog.show(confirm).then(function() {
                self.status = 'User Added';
                self.reloadUsers();
            });
        }

    }
})();
