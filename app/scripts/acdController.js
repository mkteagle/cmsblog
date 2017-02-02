(function() {
	'use strict';

	angular.module('acdController', [])
		.controller('acdController', acdController);
	acdController.$inject = ['$http', '$filter', '$mdDialog', '$localStorage'];
	function acdController($http, $filter, $mdDialog, $localStorage) {
		var self = this;
		self.addCategory = addCategory;
		self.cancel = cancel;
		self.$http = $http;
		self.name = '';
		self.displayName = '';
		self.onInit = onInit;

		function onInit() {
			if ($localStorage.currentUser) {
				var object = {
					uid: $localStorage.currentUser.uid
				};
				self.$http.post('/api/locateUser', object).then(function (response) {
					self.displayName = response.data.displayName;
				}).catch(function (err) {
					if (err) throw err;
				})
			}
		}

		self.onInit();

		function addCategory() {
			var uid = $filter('removeSpaces')(self.name + Date.now());
			var obj = {
				uid: uid,
				author: self.displayName,
				name: self.name
			};
			self.$http.post('/api/addCategory', obj).then(function(response) {
				$mdDialog.hide();
			});
		}
		function cancel () {
			$mdDialog.cancel();
		}
	}
})();
