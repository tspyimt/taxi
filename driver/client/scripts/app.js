angular.module('SudaTaxi', [
	'ui.router',
	'ngSanitize',
	'ngResource',
	'Pow',
	'hmTouchEvents'
])


.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', 
	function ($locationProvider, $stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/wellcome");

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
						defer.resolve(data);
					})
					return defer.promise;

				}
			},
			controller: 'appController'

		})
		.state('app.home', {
			url: "home",
			templateUrl: "views/home.html",
			controller: function (gmaps, $timeout){
				
				
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
		.state('wellcome', {
			url: "/wellcome",
			templateUrl: "views/wellcome.html",
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
	
}])

