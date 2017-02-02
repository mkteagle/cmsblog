(function() {
    'use strict';
    angular.module('editContestController', [])
        .controller('editContestController', editContestController);

    editContestController.$inject = ['cmsService'];

    function editContestController(cmsService) {
        const self = this;
        self.content = '';
        self.title = '';
        self.cmsService = cmsService;
        self.minDate = new Date();
        self.futureDate = '';
        self.saveContest = saveContest;
        self.featuredImg = null;
        self.file = '';
        self.onInit = onInit;
        self.uploadFeatured = uploadFeatured;

        function onInit() {

        }
        function saveContest(posted) {

        }
        function uploadFeatured(file) {

        }
    }
})();