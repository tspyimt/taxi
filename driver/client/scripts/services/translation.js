'use strict';


angular.module('SudaTaxi')
    .factory('$translation', ['$timeout' , '$resource',
        function ($timeout, $resource) {
        	return {
        		getTranslation: function (scope, language, callback){

        			var languageFilePath = 'scripts/translations/translation_' + language + '.json';
        			
		            $resource(languageFilePath).get(function (data) {
		            	$timeout(function (){
		            		scope.lang = data;
		            	})
		                callback(data);
		            });
        		}
        	}
        }])
