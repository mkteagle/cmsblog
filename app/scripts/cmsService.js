(function() {
    angular.module('cmsService', [])
        .service('cmsService', cmsService);
    cmsService.$inject = ['$http', '$localStorage', 'Upload'];
    function cmsService($http, $localStorage, Upload) {
        let self = this;
        self.$http = $http;
        self.comments = {};
        self.users = {};
        self.blogs = {};
        self.categories = {};
        self.user = {};
        self.contests = {};
        self.accessToken = '';
        self.loadComments = loadComments;
        self.loadPosts = loadPosts;
        self.loadCategories = loadCategories;
        self.loadCounties = loadCounties;
        self.loadUsers = loadUsers;
        self.locateUser = locateUser;
        self.adminUpdate = adminUpdate;
        self.updateUser = updateUser;
        self.uploadImage = uploadImage;
        self.saveAccessToken = saveAccessToken;
        self.updateBlog = updateBlog;
        self.deletePost = deletePost;
        self.deleteComment = deleteComment;
        self.approveDeny = approveDeny;
        self.createBlog = createBlog;
        self.deleteImage = deleteImage;
        self.deleteCategory = deleteCategory;
        self.loadContests = loadContests;
        self.addContest = addContest;
        self.deleteContest = deleteContest;

        function deleteImage(path) {
            return self.$http.post('/api/deletePhoto', path).then(function(response) {
                return response.data;
            }).catch(function(err) {
                if (err) return err;
            })

        }
        function loadCounties() {
            return self.$http.get('../assets/static/counties.json').then(function(response) {
                self.counties = response.data.counties;
                return self.counties;
            }).catch(function(err) {
                if (err) throw err;
            });
        }
        function createBlog(object) {
            return self.$http.post('/api/createBlog', object).then(function(response) {
                return response.data;
            }).catch(function(err) {
                if (err) return err;
            })
        }
        function uploadImage(file) {
            return Upload.upload({
                url: 'api/uploadImage',
                data: {file: file}
            }).then(function(response) {
                return response.data.link;
            })
        }
        function deletePost(uid) {
            return self.$http.post('/api/deletePost', {uid: uid}).then(function(response) {
                return response.data;
            }).catch(function(err) {
                if (err) return err;
            })
        }
        function saveAccessToken(accessToken) {
            self.accessToken = accessToken;
            return self.accessToken;
        }
        function adminUpdate(user) {
            return self.$http.post('/api/adminUpdate', user).then(function(response) {
                return response.data;
            }).catch(function(err) {
                if (err) return err;
            })
        }
        function updateUser(user) {
            return self.$http.post('/api/updateUser', user).then(function(response) {
                let message = response.data;
                return message;
            }).catch(function(err) {
                if (err) return err;
            })
        }
        function loadPosts() {
            return self.$http.post('/api/all', {}).then(function(response) {
                self.blogs = response.data;
                return self.blogs;
            }).catch(function(err) {
                if (err) return err;
            })
        }
        function updateBlog(blog) {
            return self.$http.post('/api/updateBlog', blog).then(function(response) {
                return 'All Done Successfully';
            }).catch(function(err) {
                if (err) return err;
            })
        }
        function loadComments() {
            return self.$http.post('/api/loadComments', {}).then(function(response) {
               self.comments = response.data;
               return self.comments;
            }).catch(function(err) {
                if (err) return err;
            });
        }
        function loadCategories() {
            return self.$http.post('/api/loadCategories', {}).then(function(response) {
                self.categories = response.data;
                return self.categories;
            }).catch(function(err) {
                if (err) return err;
            });
        }
        function loadUsers() {
            return self.$http.post('/api/loadUsers', {}).then(function(response) {
                self.users = response.data;
                return self.users;
            }).catch(function(err) {
                if (err) return err;
            });
        }
        function locateUser(obj) {
            return self.$http.post('/api/locateUser', obj).then(function(response) {
                self.user = response.data;
                return self.user;
            }).catch(function(err) {
                if (err) return err;
            });
        }
        function approveDeny(approval, uid) {
            return self.$http.post('/api/approveComment', {uid: uid, approved: approval}).then(function(response) {
                return response.data;
            }).catch(function(err) {
                if (err) return err;
            })
        }
        function deleteComment(uid) {
            return self.$http.post('/api/deleteComment', {uid: uid}).then(function(response) {
                return response.data;
            }).catch(function (err) {
                if (err) {
                    return err;
                }
            })
        }
        function deleteCategory(uid) {
            return self.$http.post('/api/deleteCategory', {uid: uid}).then(function(response) {
                return response.data;
            }).catch(function(err) {
                if (err) return err;
            })
        }
        function loadContests() {
            return self.$http.post('/api/loadContests', {}).then(function(response) {
                self.contests = response.data;
                return self.contests;
            }).catch(function(err) {
                if (err) return err;
            })
        }
        function addContest(contest) {
            return self.$http.post('/api/addContest', contest).then(function(response) {
                return response.data;
            }).catch(function(err) {
                if (err) return err;
            })
        }
        function deleteContest(uid) {
            return self.$http.post('/api/deleteContest', uid).then(function(response) {
                return response.data;
            }).catch(function(err) {
                if (err) return err;
            })
        }
    }
})();