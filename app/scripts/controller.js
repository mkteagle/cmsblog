(function () {
	angular.module('controller', [])
		.controller('controller', controller);
	controller.$inject = ['$http', '$localStorage', '$state', '$window', '$location', '$rootScope'];
	function controller($http, $localStorage, $state, $window, $location, $rootScope) {
		var self = this;
		self.$http = $http;
		self.displayName = '';
		self.email = '';
		self.password = '';
		self.profilePic = '';
        $rootScope.title = $state.current.title;
		self.onInit = onInit;
		self.signIn = signIn;
		self.isActive = false;
		self.activate = activate;
		self.activateSubItem = activateSubItem;
		self.search = search;
		self.logout = logout;
		self.openMenu = openMenu;
		self.term = '';
        let originatorEv;
		self.menu = [
			{'url': 'app.dashboard', 'path': 'admin/dashboard', 'name': 'Dashboard Home', 'icon': 'fa fa-home'},
			{'url': 'app.users', 'path': 'admin/users', 'name': 'Authors', 'icon': 'fa fa-user' },
			{'url': '', 'path': '', 'name': 'Posts', 'icon': 'fa fa-pencil-square-o', 'subItems': [
				{'url': 'app.posts', 'path': 'admin/posts', 'name': 'View All Posts'},
				{'url': 'app.create', 'path': 'admin/create', 'name': 'Create New'}
			]},
			{'url': '', 'path': '', 'name': 'Meta Data', 'icon': 'fa fa-asterisk', 'subItems': [
				{'url': 'app.categories', 'path': 'admin/categories', 'name': 'Category List'}
			]},
			{'url': 'app.comments', 'path': 'admin/comments', 'name': 'Comments', 'icon': 'fa fa-commenting-o'}
		];
		self.showChildren = showChildren;
		self.activeItem = '';
		self.activeSubItem = '';
		self.path = '';
		self.createNew = createNew;
		function search() {
			self.activeItem = '';
			self.activeSubItem = '';
			$state.go('app.search', {term: self.term});
		}
		function activateSubItem(url) {
			$state.go(url);
		}
		function createNew() {
			self.activeItem = 'Posts';
			self.activeSubItem = 'Create New';
			$state.go('app.create');
		}
		function activate(url) {
			self.path = $location.path();
			if (self.path != 'admin/posts' || self.path != 'admin/create' || self.path != 'admin/categories') {
				self.activeSubItem = '';
			}
			if (url === '' && self.activeItem === 'Posts') {
				self.activeSubItem = 'View All Posts';
				$state.go('app.posts');
			}
			if (url === '' && self.activeItem === 'Meta Data') {
				self.activeSubItem = 'Category List';
				$state.go('app.categories');
			}
			if (url === '') {

			}
			else {
				$state.go(url);
			}

		}
		function showChildren(item) {
			item.active = !item.active;
		}

		function onInit() {
			if ($localStorage.currentUser) {
				var object = {
					uid: $localStorage.currentUser.uid
				};
				self.$http.post('/api/locateUser', object).then(function (response) {
					self.displayName = response.data.displayName;
					self.email = response.data.email;
					self.profilePic = response.data.photoURL;
				}).catch(function (err) {
					if (err) throw err;
				})
			}
			self.path = $location.path();
			// if (self.path == 'admin/blogs' || self.path != 'admin/create' || self.path != 'admin/categories' || self.path != 'admin/createcontest') {
			// 	self.activeSubItem = '';
			// }
			if (self.path == 'admin/posts') {
				self.activeItem = 'Posts';
				self.activeSubItem = 'View All Posts';
			}
			if (self.path == 'admin/create') {
				self.activeItem = 'Posts';
				self.activeSubItem = 'Create New';
			}
			if (self.path == 'admin/categories') {
				self.activeItem = 'Meta Data';
				self.activeSubItem = 'Category List';
			}
			else {
                self.menu.forEach(function(it) {
                    if (it.path === self.path) {
                        self.activeItem = it.name;
                    }
                })
			}
		}
		function openMenu($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
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
				self.$http.post('/api/checkUser', object).then(function (response) {
					$localStorage.currentUser = {uid: response.data, token: self.authenticated};
					self.$http.defaults.headers.common.Authorization = 'Bearer ' + self.authenticated;
					$location.path('/admin/dashboard');
				});
			})
		}
		function logout() {
		    delete $localStorage.currentUser;
		    self.$http.defaults.headers.common.Authorization = '';
		    $state.go('login');
		}

	}

}());
