'use strict';

/**
 * @ngdoc function
 * @name promotorApp.controller:PromotorEditCtrl
 * @description
 * # PromotorEditCtrl
 * Controller of the promotorApp
 */
angular.module('promotorApp')

   .controller('PromotorEditCtrl', ['$scope', '$log', 'promotoresFactory', '$location', '$routeParams', 'provinciasDataSvc', 'localStorageSvc',
    	//Llama al "deletePromotor" de la API del front (en "factorias.js") que comunica con backend mediante servicio REST a ruta adecuada
        function($scope, $log, promotoresFactory, $location, $routeParams, provinciasDataSvc, localStorageSvc) {
          
            $scope.editPromotor = true; //Indica que estamos en la vista de edicion
            $scope.promotorDatos_id = $routeParams.id;

            $scope.isError = false;      
            $scope.errorMsg = '';   
            $scope.pantallaEditP = true;
            $scope.pantallaAddP = false;
            $scope.provincias = provinciasDataSvc.provincias;

            //Recuperamos los datos de promotor para poder mostrarlos en pantalla 
            promotoresFactory.detailPromotor($routeParams.id).then(
                    function(response) {
                        $scope.promotorDatos = response.data;
                        //localStorageSvc.processPendingOper();  //Comentar, solo hecho para probar LS en modo por lotes
                    },
                    function(err) {
                        $log.error(err);
                    }
              );


            $scope.guardarPromotor = function() {   
                promotoresFactory.editPromotor($routeParams.id, $scope.promotorDatos).then(
                    function() {
                        //Solo para probar el servicio sobre LS
                        //localStorageSvc.addPendingOper('editprom', $scope.promotorDatos);
                        //console.log(localStorageSvc.getAllPendingOper());
                        $location.path('/promotor/detail/' + $routeParams.id); 
                    },
                    function(err) {
                        $scope.isError = true;
                        $scope.errorMsg = err; 
                        $log.error('error en guardarPromotor: edicion');
                    }
                );
            }; 

            //Redirigimos al listado de promotores
			$scope.back = function () {
				$location.path('/promotores'); 
			};
        }
    ]);