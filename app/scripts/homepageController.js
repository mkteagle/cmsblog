(function(){
	'use strict';
	angular.module('homepageController', [])
		.controller('homepageController', homepageController);

	homepageController.$inject = ['$http', '$rootScope', '$state'];

	function homepageController($http, $rootScope, $state) {
		let self = this;
		self.post = post;
		self.email = '';
		self.$http = $http;
		self.message = 'Nothing Here Yet';
		self.truth = false;
        $rootScope.title = $state.current.title;
        function post() {
			self.$http.post('/api/postEmail', {"email": self.email}).then(function(response){
				self.truth = response;
				self.email = '';
				self.message = 'Thanks for joining!';
			});
		}
	}
})();
