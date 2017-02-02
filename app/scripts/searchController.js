(function() {
    'use strict';
    angular.module('searchController', [])
        .controller('searchController', searchController);

    searchController.$inject = ['cmsService', '$stateParams'];
    function searchController(cmsService, $stateParams) {
        let self = this;
        self.cmsService = cmsService;
        self.term = $stateParams.term;
        self.reversed = true;
        self.featured = false;
        self.filtered = [];
        self.featurePost = featurePost;
        self.onInit = onInit;

        function onInit() {
            let promise = self.cmsService.loadPosts();
            promise.then(function(response) {
                self.blogs = response;
            });

        }
        self.onInit();
        function featurePost(blog) {
            let promise = self.cmsService.updateBlog({uid: blog.uid, featured: blog.featured});
            promise.then(function(response) {
                self.onInit();
            })
        }

    }
})();