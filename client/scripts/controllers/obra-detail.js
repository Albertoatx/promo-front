'use strict';

/**
 * @ngdoc function
 * @name promotorApp.controller:PromotorDetailCtrl
 * @description
 * # PromotorDetailCtrl
 * Controller of the promotorApp
 */
angular.module('promotorApp')
    .controller('ObraDetailCtrl', ['$scope', '$log', 'promotoresFactory', '$routeParams', '$location',
	    function ($scope, $log, promotoresFactory, $routeParams, $location) {

			  $scope.viewObra = true;  //Vamos a usar "tabs" para la navegación, dar mismos nombre a las variables del scope

			  $scope.obraDatos  = {}; //Vaciamos el objeto del $scope
			  $scope.promotorId = $routeParams.id;
			  $scope.codigoObra = $routeParams.cod;

			  //DETALLE de la obra
			  promotoresFactory.detailObra($scope.promotorId, $scope.codigoObra).then(
		            function(response) {
		            	//OJO devuelve el _id del documento + array llamado "promociones" con solo 1 elemento.
		                $scope.obraDatos = response.data.promociones[0];
		                $log.info($scope.obraDatos);
		            },
		            function(err) {
		                $log.error(err);
		            }
	          );


            //Cuando se pinche en el boton "No" redirigimos al listado de obras
            $scope.back = function() {
              $location.path('/obraspromotor/' + $routeParams.id);  
            };
		}
	]);