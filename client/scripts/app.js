angular.module('Pow', [
	'ui.router',
	'ngSanitize'
])


.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', 
	function ($locationProvider, $stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/home");
	//
	// Now set up the states
	$stateProvider
		.state('app', {
			url: "/",
			abstract: true,
			templateUrl: "views/app.html",
			controller: function (){
				console.log('hello')
			}

		})
		.state('app.home', {
			url: "home",
			templateUrl: "views/home.html"
		})
}])

.run( ['$rootScope', function ($rootScope){
	console.log('Run');
}])

