(function () {
    angular.module('editController', [])
        .controller('editController', editController);
    editController.$inject = ['$http', '$localStorage', '$location', '$filter', '$stateParams', 'Upload', '$state', 'cmsService', '$mdToast', '$q', '$timeout',];
    function editController($http, $localStorage, $location, $filter, $stateParams, Upload, $state, cmsService, $mdToast, $q, $timeout) {
        let self = this;
        self.$http = $http;
        self.cmsService = cmsService;
        self.froalaOptions = {};
        self.blogEditor = '';
        self.post = {};
        self.counties = {};
        self.county = {};
        self.categories = {};
        self.categoryList = [];
        self.cats = [];
        self.category = [];
        self.minDate = new Date();
        self.updateBlog = updateBlog;
        self.uploadFeatured = uploadFeatured;
        self.onInit = onInit;
        self.deletePost = deletePost;

        function onInit() {
            if ($localStorage.currentUser) {
                let object = {
                    uid: $localStorage.currentUser.uid
                };

                let promise = self.cmsService.locateUser(object);
                promise.then(function(re) {
                    let posts = self.cmsService.loadPosts();
                    posts.then(function(response) {
                        self.blogs = response;
                        angular.forEach(self.blogs, function (blog) {
                            if (blog.param === $stateParams.param) {
                                self.post = blog;
                                self.post.futureDate = new Date(self.post.futureDate);
                                self.category = $filter('toArray')(self.post.category);
                                let category = self.cmsService.loadCategories();
                                category.then(function(res) {
                                    self.categories = $filter('toArray')(res);
                                    self.post.category = self.category;
                                    self.post.category.forEach(function(category) {
                                        self.categoryList.push(category.name);
                                    });
                                    let counties = self.cmsService.loadCounties();
                                    counties.then(function(response) {
                                        self.counties = response;
                                        self.county = self.post.county;
                                    })
                                }).catch(function(err) {
                                    if (err) throw err;
                                })
                            }
                        })
                    }).catch(function(err) {
                        if (err) throw err;
                    })

                }).catch(function(err) {
                    if (err) throw err;
                })
            }
        }

        self.onInit();


        function uploadFeatured(file) {
            if (self.post.featuredImage) {
               let object = {
                    path: self.post.featuredImage
                };
                self.$http.post('/api/deletePhoto', object).then(function (response) {
                    Upload.upload({
                        url: 'api/uploadFeatured',
                        data: {file: file}
                    }).then(function (resp) {
                        self.post.featuredImage = resp.data.link;
                        self.$http.post('/api/updateBlog', self.post).then(function (post) {

                        }).catch(function (err) {
                            if (err) throw err;
                        })
                    }, function (resp) {
                        console.log('Error status: ' + resp.status);
                    }, function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    });

                }).catch(function (err) {
                    if (err) throw err;
                });
            }
            else {
                Upload.upload({
                    url: 'api/uploadFeatured',
                    data: {file: file}
                }).then(function (resp) {
                    self.post.featuredImage = resp.data.link;
                    self.$http.post('/api/updateBlog', self.post).then(function (post) {

                    }).catch(function (err) {
                        if (err) throw err;
                    })
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            }
        }

        function updateBlog() {
            if (self.county == null) {
                self.county = self.post.county;
            }
            let titleParams = $filter('removeSpacesThenLowercase')(self.post.title);

            let object = {
                uid: self.post.uid,
                title: self.post.title,
                featuredImage: self.post.featuredImage,
                content: self.post.content,
                param: titleParams,
                county: self.county,
                posted: self.post.posted
            };
            let obj = {};
            self.categoryList.forEach(function(category) {
                self.categories.forEach(function(cat) {
                    if (cat.name == category) {
                        obj[cat.uid] = {uid: cat.uid, name: cat.name}
                    }
                });
            });
            object.category = obj;
            self.$http.post('/api/updateBlog', object).then(function (response) {

            }).catch(function (err) {
                if (err) throw err;
            })
        }

        function deletePost() {
            let promise = self.cmsService.deletePost(self.post.uid);
            promise.then(function (response) {
                $mdToast.show(
                    $mdToast.simple()
                        .position('top right')
                        .theme('success-toast')
                        .textContent(self.post.title + ' Deleted Successfully')
                        .hideDelay(3000)
                );
                $state.go('blogs.posts')
            })
        }

    }

}());
