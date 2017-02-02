(function(){
    'use strict';

    angular.module('commentController', [])
        .controller('commentController', commentController);
    commentController.$inject = ['$localStorage', '$http', '$filter', '$mdDialog', '$mdToast', 'cmsService'];

    function commentController($localStorage, $http, $filter, $mdDialog, $mdToast, cmsService) {
        let self = this;
        self.$http = $http;
        self.comments = {};
        self.onInit = onInit;
        self.loadComments = loadComments;
        self.cmsService = cmsService;
        self.showPrompt = showPrompt;
        self.activeItem = '';
        self.approveDeny = approveDeny;
        self.showItems = false;
        self.deleteComment = deleteComment;
        self.loadPosts = loadPosts;
        self.blogs = {};

        function approveDeny(approval, uid) {
            let promise = self.cmsService.approveDeny(approval, uid);
            promise.then(function(response) {
                $mdToast.show(
                    $mdToast.simple()
                        .position('top right')
                        .theme('success-toast')
                        .textContent(response)
                        .hideDelay(3000)
                );
                self.loadComments();

            }).catch(function(err) {
                if (err) throw err;
            })
        }
        function onInit() {
            self.loadComments();
            self.loadPosts();
        }
        self.onInit();

        function showPrompt(ev) {
            let confirm = $mdDialog.prompt({
                controller: 'acController as acom',
                templateUrl: './templates/addcomment.html',
                // parent: angular.element(document.body);
                targetEvent: ev,
            });

            $mdDialog.show(confirm).then(function() {
                self.status = 'Comment Added';
                self.loadComments();
            });
        }
        function loadPosts() {
            let promise = self.cmsService.loadPosts();
                promise.then(function(response) {
                    self.blogs = response;
                }).catch(function(err) {
                    if (err) throw err;
                });
        }
        function deleteComment(uid) {
            let promise = self.cmsService.deleteComment(uid);
            promise.then(function(response) {
                self.loadComments();
                $mdToast.show(
                    $mdToast.simple()
                        .position('top right')
                        .theme('success-toast')
                        .textContent(response)
                        .hideDelay(3000)
                );
            }).catch(function(err) {
                if (err) throw err;
            })
        }
        function loadComments() {
            let promise = self.cmsService.loadComments();
            promise.then(function(response) {
                self.comments = response;
            }).catch(function(err) {
                if (err) throw err;
            })
        }
    }

})();
