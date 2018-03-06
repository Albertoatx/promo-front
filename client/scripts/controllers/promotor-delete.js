'use strict';

/**
 * @ngdoc function
 * @name promotorApp.controller:PromotorDeleteCtrl
 * @description
 * # PromotorDeleteCtrl
 * Controller of the promotorApp
 */
angular.module('promotorApp')

   .controller('PromotorDeleteCtrl', ['$scope', '$log', 'promotoresFactory', '$location', '$routeParams',
    	//Llama al "deletePromotor" de la API del front (en "factorias.js") que comunica con backend mediante servicio REST a ruta adecuada
        function($scope, $log, promotoresFactory, $location, $routeParams) {
          
            $scope.isError  = false;      
            $scope.errorMsg = ''; 

            $scope.promotorDatos_id = $routeParams.id;

            //Recuperamos los datos de promotor para poder mostrarlos en pantalla de borrado
            promotoresFactory.detailPromotor($routeParams.id).then(
                    function(response) {
                        $scope.promotorDatos = response.data;
                    },
                    function(err) {
                        $log.error(err);
                    }
              );

            //Cuando se pinche el boton "Yes" eliminamos el promotor, luego redirigimos al listado de promotores
            $scope.borrarPromotor = function() {   
                promotoresFactory.deletePromotor($scope.promotorDatos_id).then(
                    function() {
                        $location.path('/promotores'); 
                    },
                    function(err) {
                        $scope.isError = true;
                        $scope.errorMsg = err;
                        $log.error('error en borrarPromotor');
                    }
                );
            }; 

            //Cuando se pinche en el boton "No" redirigimos al detalle del promotor
            $scope.back = function() {
              $location.path('/promotor/detail/' + $routeParams.id);
            };

        }
    ]);