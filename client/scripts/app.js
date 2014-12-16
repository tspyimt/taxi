angular.module('SudaTaxi', [
	'ui.router',
	'ngSanitize',
	'Pow',
	'hmTouchEvents'
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
			templateUrl: "views/home.html",
			controller: function (gmaps){
				gmaps.init();

			}
		})


	}]) // End module config 

.run( ['$rootScope', function ($rootScope){
	console.log('Run');
}])

