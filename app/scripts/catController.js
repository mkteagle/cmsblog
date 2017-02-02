(function () {
	angular.module('catController', [])
		.controller('catController', catController);
	catController.$inject = ['$http', '$mdDialog', 'cmsService', '$mdToast'];
	function catController($http, $mdDialog, cmsService, $mdToast) {
		var self = this;
		self.$http = $http;
		self.deleteCategory = deleteCategory;
		self.onInit = onInit;
		self.name = '';
		self.reloadCategories = reloadCategories;
		self.categories = {};
		self.cmsService = cmsService;

		function onInit() {
			self.reloadCategories();
		}
		self.onInit();

		function reloadCategories() {
			let promise = cmsService.loadCategories();
			promise.then(function(response) {
				self.categories = response;
			}).catch(function(err) {
				if (err) throw err;
            });
		}
		self.showPrompt = function(ev) {
			let confirm = $mdDialog.prompt({
				controller: 'acdController as acd',
				templateUrl: './templates/addCategory.html',
				targetEvent: ev
			});

			$mdDialog.show(confirm).then(function() {
				self.status = 'Category Added';
				self.reloadCategories();
			});
		};

		function deleteCategory(uid) {
			let promise = cmsService.deleteCategory(uid);
			promise.then(function(response) {
                $mdToast.show(
                    $mdToast.simple()
                        .position('top right')
                        .theme('success-toast')
                        .textContent(response)
                        .hideDelay(3000)
                );
                self.reloadCategories();
			}).catch(function(err) {
				if (err) throw err;
			})
		}
	}
})();
