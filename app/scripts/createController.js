(function () {
    angular.module('createController', [])
        .controller('createController', createController);
    createController.$inject = ['$localStorage', '$filter', '$state', '$mdToast', 'cmsService'];
    function createController($localStorage, $filter, $state, $mdToast, cmsService) {
        let self = this;
        self.cmsService = cmsService;
        self.authenticated = null;
        self.wrongPassword = '';
        self.displayName = '';
        self.featuredImg = '';
        self.blogTitle = '';
        self.blogContent = '';
        self.froalaOptions = {imageEditButtons: ['imageReplace', 'imageAlign', 'imageRemove', 'imageRotate', 'imageSize']};
        self.streamlinedOptions = {toolbarButtons: ['undo', 'redo' , '|', 'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'outdent', 'indent', 'clearFormatting', 'insertTable', 'html'],
            toolbarButtonsXS: ['undo', 'redo' , '-', 'bold', 'italic', 'underline']};
        self.blogEditor = '';
        self.posted = null;
        self.counties = {};
        self.categories = [];
        self.categoryList = [];
        self.cats = [];
        self.county = '';
        self.futureDate = '';
        self.minDate = new Date();
        self.endDate = '';
        self.startDate = '';
        self.contest = null;
        self.rules = '';
        self.deletePhoto = deletePhoto;
        self.editImage = editImage;
        self.saveBlog = saveBlog;
        self.onInit = onInit;
        self.uploadFeatured = uploadFeatured;

        function onInit() {
            if ($localStorage.currentUser) {
                let object = {
                    uid: $localStorage.currentUser.uid
                };
                let promise = self.cmsService.locateUser(object);
                promise.then(function (response) {
                    self.displayName = response.displayName;
                    let counties = cmsService.loadCounties();
                    counties.then(function (response) {
                        self.counties = response;
                        let categories = self.cmsService.loadCategories();
                        categories.then(function (response) {
                            self.categories = $filter('toArray')(response);
                            self.categories.forEach(function (category) {
                                self.cats.push(category.name);
                            });
                        }).catch(function (err) {
                            if (err) throw err;
                        });
                    }).catch(function (err) {
                        if (err) throw err;
                    });
                }).catch(function (err) {
                    if (err) throw err;
                });
            }

        }

        self.onInit();

        function deletePhoto() {
            let object = {
                path: self.featuredImg
            };
            let promise = self.cmsService.deleteImage(object);
            promise.then(function (response) {
                $mdToast.show(
                    $mdToast.simple()
                        .position('top right')
                        .theme('success-toast')
                        .textContent(response)
                        .hideDelay(3000)
                );
                self.featuredImg = '';
            }).catch(function (err) {
                if (err) throw err;
            });
        }

        function editImage(file) {
            let promise = cmsService.uploadImage(file);
            promise.then(function (response) {
                self.featuredImg = response;
            })
        }

        function uploadFeatured(file) {
            if (self.featuredImg == null || self.featuredImg == '') {
                self.editImage(file);
            }
            else {
                self.deletePhoto();
                self.editImage(file);
            }
        }
        function saveBlog(posted) {
            let obj = {};
            self.categoryList.forEach(function (category) {
                self.categories.forEach(function (cat) {
                    if (cat.name == category) {
                        obj[cat.uid] = {uid: cat.uid, name: cat.name};
                    }
                });
            });
            self.blogTitle = $filter('titlecase')(self.blogTitle);
            let titleParams = $filter('removeSpacesThenLowercase')(self.blogTitle);
            let uids = $filter('removeSpaces')(Date.now() + self.blogTitle);
            let object = {
                uid: uids,
                created: Date.now(),
                title: self.blogTitle,
                featuredImg: self.featuredImg,
                content: self.blogContent,
                author: self.displayName,
                param: titleParams,
                posted: posted,
                county: self.county,
                category: obj,
                futureDate: self.futureDate
            };
            if (self.contest) {
                object.contest = {
                    endDate: self.endDate,
                    startDate: self.startDate,
                    rules: self.rules
                }
            }
            let promise = self.cmsService.createBlog(object);
            promise.then(function (response) {
                $mdToast.show(
                    $mdToast.simple()
                        .position('top right')
                        .theme('success-toast')
                        .textContent(response)
                        .hideDelay(3000)
                );
                $state.go('app.posts');
            }).catch(function (err) {
                if (err) throw err;
            });

        }
    }

}());
