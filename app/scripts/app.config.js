
(function() {
	angular.module('dud.config', [])
		.config(configureRouter)
        .run(run);

	configureRouter.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

	function configureRouter ($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        // $urlRouterProvider.otherwise('/home');
        $stateProvider
            .state('login', {
                url: "/login",
                views: {
                    '@': {
                        templateUrl: "./templates/login.html",
                        controller: "loginController as lc"
                    }
                },
                title: 'Login to Blog CMS'
            })
            .state("home", {
                url: "/",
                views: {
                    '@': {
                        templateUrl: "./templates/homepage.html",
                        controller: "homepageController as hc"
                    }
                },
                title: 'Doing Utah Daily, Coming Soon'
            })
            .state("app.contests", {
                url: "/contests",
                views: {
                    'header': {
                        template: "<div>Contests</div>"
                    },
                    'parent-view': {
                        templateUrl: "./templates/contests.html",
                        controller: "contestController as conc"
                    }
                }
            })
            .state("contest", {
                url: "/contest/:param",
                views: {
                    '@': {
                        templateUrl: "./templates/localcontest.html",
                        controller: "localContestController as lcc"
                    }
                }
            })
            .state("app.editcontest", {
                url: '/editcontest/:param',
                views: {
                    'header': {
                        template: "<div>Edit Contest</div>"
                    },
                    'parent-view': {
                        templateUrl: "./templates/editcontest.html",
                        controller: "editContestController as editc"
                    }
                }
            })
            .state("app.createcontest", {
                url: "/contestcreate",
                views: {
                    'header': {
                        template: "<div>Create Contest</div>"
                    },
                    'parent-view': {
                        templateUrl: "./templates/createcontest.html",
                        controller: "createContestController as createc"
                    }
                }
            })
	        .state("app", {
		        url: '/admin',
		        views: {
			        'header': {
				        template: "<div>Dashboard Home</div>"
			        },
			        '@': {
				        templateUrl: "./templates/layout.html",
                        controller: "controller as c"
			        }
		        },
                title: 'Blog CMS'
	        })
            .state("app.search", {
                url: '/search?term',
                views: {
                    'header': {
                        template: "<div>Search</div>"
                    },
                    'parent-view': {
                        templateUrl: "./templates/search.html",
                        controller: "searchController as search"
                    }
                },
                params: {
                    'term': null,
                    'squash': true
                },
            })
            .state("app.comments", {
                url: '/comments',
                views: {
                    'header': {
                        template: "<div>Comment Moderation</div>"
                    },
                    'parent-view': {
                        templateUrl: "./templates/comments.html",
                        controller: 'commentController as comc'
                    }
                }
            })
            .state("app.dashboard", {
                url: "/dashboard",
                views: {
                    'header': {
                        template: "<div>Dashboard Home</div>"
                    },
                    'parent-view': {
                        templateUrl: "./templates/dashboard.html"
                    }
                }
            })
            .state("app.posts", {
                    url: "/posts",
                    views: {
                    'header': {
                        template: "<div>Posts / All Blogs</div>",
                    },
                    'parent-view': {
                        templateUrl: "./templates/blogs.html",
                        controller: "blogController as bc"
                    }
                }
            })
            .state("app.list", {
                url: "/list",
                views: {
                    'header': {
                        template: "<div>Posts / List</div>"
                    },
                    'parent-view': {
                        templateUrl: "./templates/listview.html",
                        controller: "listController as lc"
                    }
                }
            })
            .state("app.edit", {
                url: "/edit/:param",
                views: {
                    'header': {
                        template: "<div>Edit / Post</div>"
                    },
                    'parent-view': {
                        templateUrl: "./templates/edit.html",
                        controller: "editController as ec"
                    }
                }
            })
            .state('app.users', {
                url: "/users",
                views: {
                    'header': {
                        template: "<div>Author(s)</div>"
                    },
                    'parent-view': {
                        templateUrl: "./templates/users.html",
                        controller: "userController as uc"
                    }
                }
            })

	        .state('app.categories', {
		        url: '/categories',
		        views: {
			        'header': {
				        template: "<div>Edit Categories</div>"
			        },
			        'parent-view': {
				        templateUrl: "./templates/categories.html",
				        controller: "catController as cats"
			        }
		        }
	        })
            .state('app.create', {
                url: "/create",
                views: {
                    'header': {
                        template: "<div>Posts / Create New</div>",
                    },
                    'parent-view': {
                        templateUrl: "./templates/create.html",
                        controller: "createController as cc"
                    }
                }
            });
	}
	run.$inject = ['$rootScope', '$http', '$location', '$localStorage', '$state', '$stateParams'];
    function run($rootScope, $http, $location, $localStorage, $state, $stateParams) {
        if ($localStorage.currentUser) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
        }

        // redirect to login page if not logged in and trying to access a restricted page
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var publicPages = ['/login', '/', 'contests', 'contest'];
            var restrictedPage = publicPages.indexOf($location.path()) === -1;
            if (restrictedPage && !$localStorage.currentUser) {
                $location.path('/login');
            }
        });
    }
}());