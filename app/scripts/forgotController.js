(function() {
    angular.module('forgotController', [])
        .controller('forgotController', forgotController);
    forgotController.$inject =['$http', '$location'];
    function forgotController($http, $location) {
        var self = this;
        self.email = '';
        self.$http = $http;
        self.forgotPassword = forgotPassword;
	    self.loginPage = loginPage;

	    function loginPage() {
		    $location.path('/login')
	    }
        function forgotPassword() {
            var body = {
                email: self.email
            };

            self.$http.post('/api/forgot', body).then(function(response){
                self.email = '';
                alert(response.data);
            })
        }
    }

}());
