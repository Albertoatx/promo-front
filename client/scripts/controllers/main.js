'use strict';

/**
 * @ngdoc function
 * @name promotorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the promotorApp
 */
angular.module('promotorApp')

   .controller('MainCtrl', ['$scope', '$log', '$location',
    	
        function($scope, $log, $location) {

					$scope.baseUrlForDevNode = "http://localhost:3000";  //la ruta base del servidor NODE donde correra el back-end

			$scope.active = 0;
		/*	var baseURL = 'http://lorempixel.com/960/450/';
			$scope.setInterval = 3000;

			$scope.slides = [ 
			  {
				title : '7 ways to stay fit',
				image : baseURL + 'sports/',
				idx : 0
			  }, {
				title : 'Relaxing Holidays',
				image : baseURL + 'nature/',
				idx : 2
			  }]; */

			var baseURL = "http://lorempixel.com/200/200/";
			$scope.content = [
				{
					img : baseURL + "people",
					title : "About Us",
					summary : "We are good, we are the best out there"
				},
				{

					img : baseURL + "transport",
					title : "Contact Us",
					summary : "#111, Good Health Blvd, Happy Place, Antartica, Zip-432167"
				}];

        }
    ]);