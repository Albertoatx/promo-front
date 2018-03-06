'use strict';

/**
 * @ngdoc function
 * @name promotorApp.controller:ObraAddCtrl
 * @description
 * # ObraAddCtrl
 * Controller of the promotorApp
 */
angular.module('promotorApp')

   .controller('ObraAddCtrl', ['$scope', '$log', 'promotoresFactory', '$location', '$routeParams',
    	//Llama al "savePromotor" de la API del front (en "factorias.js") que se comunicarse con el backend mediante servicio REST a la ruta adecuada
        function($scope, $log, promotoresFactory, $location, $routeParams) {

            $scope.isError  = false;      
            $scope.errorMsg = '';   
            $scope.pantallaAddO = true;

            $scope.obraDatos = {};              //Creamos el objeto obra y lo adjuntamos a $scope

            $scope.guardarObra = function() {   //Crear un nueva obra
                promotoresFactory.saveObra($routeParams.id, $scope.obraDatos).then(
                    function() {
                        $location.path('/obraspromotor/' + $routeParams.id); //Una vez guardada la obra redirigimos al listado de las obras
                    },
                    function(err) {
                        $scope.isError = true;
                        $scope.errorMsg = err; 
                        $log.error('error en guardarObra');
                    }
                );
            };

            //Redirigimos al listado de obras de ese promotor
			$scope.back = function () {
				$location.path('/obraspromotor/' + $routeParams.id); 
			};
        }
    ]);