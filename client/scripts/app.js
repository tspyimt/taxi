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
			controller: function (gmaps, $timeout){
				
				$timeout(function (){
					gmaps.init();
				})
			}
		})
		.state('app.history', {
			url: "history",
			templateUrl: "views/history.html",
			controller: function (gmaps){
				
			}
		})
		.state('app.payment', {
			url: "payment",
			templateUrl: "views/payment.html",
			controller: function (gmaps){
				
			}
		})
		.state('app.contact', {
			url: "contact",
			templateUrl: "views/contact.html",
			controller: function (gmaps){
				
			}
		})

	}]) // End module config 

.run( ['$rootScope', '$state', function ($rootScope, $state){
	$rootScope.$state = $state;

	console.log('Run');
}])

