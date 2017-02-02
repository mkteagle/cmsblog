(function () {
    angular.module('adminController', [])
        .controller('adminController', adminController);
    adminController.$inject = ['$http', '$localStorage', '$location', '$state', '$mdToast', 'Upload'];
    function adminController($http, $localStorage, $location, $state, $mdToast, Upload) {
        var self = this;
        self.$http = $http;
        self.authenticated = null;
        self.wrongPassword = '';
        self.logout = logout;
        self.createPost = createPost;
        self.updateUser = updateUser;
        self.registerPage = registerPage;
        self.displayName = '';
        self.email = '';
        self.file = '';
        self.profilePic = '';
        self.manageBlogs = manageBlogs;
        self.onInit = onInit;
        self.resetPassword = resetPassword;
        self.updateProfilePic = updateProfilePic;
        
        function onInit() {
            if ($localStorage.currentUser) {
                var object = {
                    uid: $localStorage.currentUser.uid
                };
                self.$http.post('/api/locateUser', object).then(function(response) {
                    self.displayName = response.data.displayName;
                    self.email = response.data.email;
                    self.profilePic = response.data.photoUrl;
                }).catch(function(err) {
                    if (err) throw err;
                })
            }
            
        }
        self.onInit();

        function logout() {
            delete $localStorage.currentUser;
            self.$http.defaults.headers.common.Authorization = '';
           $state.go('login');
        }
        function registerPage() {
            $state.go('register');
        }
        function createPost() {
            $state.go('create');
        }
        function resetPassword() {
            var object = {
                email: self.email,
            };
            self.$http.post('/api/resetPassword', object).then(function(response) {
                $mdToast.show(
                    $mdToast.simple()
                        .position('top right')
                        .theme('success-toast')
                        .textContent(response.data)
                        .hideDelay(3000)
                );
            }).catch(function(err) {
                if (err) throw err;
            })
        }
        function updateProfilePic (file) {
                Upload.upload({
                    url: 'api/updateProfilePic',
                    data: {file: file}
                }).then(function (resp) {
                    self.profilePic = resp.data.link;
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
        }

        function updateUser() {
            var object = {
                uid: $localStorage.currentUser.uid,
                displayName: self.displayName,
                email: self.email,
                profilePic: 'http://localhost:5000' + self.profilePic
            };
            self.$http.post('/api/adminUpdate', object).then(function(response) {
                $mdToast.show(
                    $mdToast.simple()
                        .position('top right')
                        .theme('success-toast')
                        .textContent(response.data)
                        .hideDelay(3000)
                );
            }).catch(function(err) {
                if (err) throw err;
            });
        }
        function manageBlogs() {
            $state.go('blogs');
        }

    }

}());

