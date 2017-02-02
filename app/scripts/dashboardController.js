(function() {
   'use strict';
    window.fbAsyncInit = function() {
        FB.init({
            appId      : '1571267976534380',
            xfbml      : true,
            version    : 'v2.8'
        });
    };

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

   angular.module('dashboardController', [])
       .controller('dashboardController', dashboardController);
   dashboardController.$inject = ['cmsService'];

   function dashboardController(cmsService) {
       var self = this;
       self.cmsService = cmsService;
       self.accessToken = '';
       self.facebookLogin = facebookLogin;
       self.pageId = '1777548432458197';
       // self.pageId = 'me';
       function facebookLogin() {
           FB.login(function(response){
               if (response.authResponse) {
                   console.log('Welcome!  Fetching your information.... ');
                   FB.api('/' + self.pageId + '/page_backed_instagram_accounts', function(response) {
                       console.log(response);
                   });
               } else {
                   console.log('User cancelled login or did not fully authorize.');
               }
               // console.log(response.authResponse.accessToken);
               // self.accessToken = response.authResponse.authToken;
               // console.log(self.accessToken);
               self.accessToken = self.cmsService.saveAccessToken(response.authResponse.accessToken);
               // var promise = self.cmsService.saveAccessToken(response.authResponse.accessToken);
               // promise.then(function(response) {
               //     self.accessToken = response;
               //     console.log(self.accessToken);
               // })
           }, {scope: 'publish_actions,manage_pages,user_friends,ads_management',  return_scopes: true});
       }
       function facebookGraphRequest() {

       }

    }
})();
