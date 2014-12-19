angular.module('SudaTaxi')
	.controller('WellcomeCtrl', ['$scope', '$state', function ($scope, $state){
		console.log('WellcomeCtrl', 'start', true);


		$scope.login = function (){
			$state.go('app.home');
		}
	}])