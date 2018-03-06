'use strict';

/**
 * @ngdoc function
 * @name promotorApp.controller:ObrasCtrl
 * @description
 * # ObrasCtrl
 * Controller of the promotorApp
 */
angular.module('promotorApp')

  .controller('ObrasCtrl', ['$scope', '$log', 'promotoresFactory', '$location', '$routeParams',

      function($scope, $log, promotoresFactory, $location, $routeParams) {

          $scope.numItemsPerPage = 10;
          
          //Llama al método "getObrasAll" de la API del front definido en "factorias.js"
          promotoresFactory.getObrasAll().then(    
              function(response) {  
                  //En el $scope estarán los datos devueltos por el servicio REST a la factoria.
                  // $scope.resultado = response.data;        
                  $scope.obras = response.data; 
                  $scope.countObras = response.data.length;
                  //console.log("LISTADO DE TODAS LAS OBRAS");
                  //console.log($scope.obras);
              },
              function(err) {
                  $log.error(err);
          });

          $scope.sort = function(keyname){
            $scope.sortKey = keyname;         //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
          }

      }

      
  ]);