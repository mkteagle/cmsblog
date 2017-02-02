(function () {
	angular.module('loginController', [])
		.controller('loginController', loginController);
	loginController.$inject = ['$http', '$localStorage', '$location', '$state', '$rootScope'];
	function loginController($http, $localStorage, $location, $state, $rootScope) {
		var self = this;
		self.email = '';
		self.$http = $http;
		self.signIn = signIn;
		self.authenticated = null;
		self.wrongPassword = '';
        $rootScope.title = $state.current.title;
		self.onInit = onInit;
		self.logout = logout;

		function onInit() {
		}
		self.onInit();
		function signIn() {
			var body = {
				email: self.email,
				password: self.password
			};
			self.$http.post('/api/login', body).then(function (response) {
					self.authenticated = response.data;
					var object = {
						token: self.authenticated
					};
					self.$http.post('/api/checkUser', object).then(function(response) {
						$localStorage.currentUser = {uid: response.data, token: self.authenticated};
						self.$http.defaults.headers.common.Authorization = 'Bearer ' + self.authenticated;
						$state.go('app');
					});
			})
		}
		function logout() {
			delete $localStorage.currentUser;
			self.$http.defaults.headers.common.Authorization = '';
			$state.go('/login');
		}

	}

}());
