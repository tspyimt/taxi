angular.module('SudaTaxi', [
	'ui.router',
	'ngSanitize',
	'ngResource',
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
			resolve: {
				lang: function ($rootScope, $translation, $q){
					var defer = $q.defer();

					$translation.getTranslation($rootScope, 'vi', function (data){
						console.log('Lang, ', data);
						defer.resolve(data);
					})
					return defer.promise;

				}
			},
			controller: function (lang){
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

.run( ['$rootScope', '$state', '$translation', function ($rootScope, $state, $translation){
	$rootScope.$state = $state;
	var lang = 'vi';

	$rootScope.toggleLang = function (){
		lang = (lang == 'vi') ? 'en' : 'vi';
		$translation.getTranslation($rootScope, lang, function (data){
			console.log('Lang, ', data);
			
		})
	}
	console.log('Run');
}])

