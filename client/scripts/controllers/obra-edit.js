'use strict';

/**
 * @ngdoc function
 * @name promotorApp.controller:ObraEditCtrl
 * @description
 * # ObraEditCtrl
 * Controller of the promotorApp
 */
angular.module('promotorApp')

   .controller('ObraEditCtrl', ['$scope', '$log', 'promotoresFactory', '$location', '$routeParams', 'localStorageSvc',
    	//Llama al "deletePromotor" de la API del front (en "factorias.js") que comunica con backend mediante servicio REST a ruta adecuada
        function($scope, $log, promotoresFactory, $location, $routeParams, localStorageSvc) {
          
            $scope.editObra = true; //Indica que estamos en la vista de edicion
            $scope.pantallaEditO = true;

            $scope.isError = false;      
            $scope.errorMsg = ''; 
            
            $scope.promotorId = $routeParams.id;
            $scope.codigoObra = $routeParams.cod;

            //Recuperamos los datos de la obra para poder mostrarlos en la pantalla de edicion
            promotoresFactory.detailObra($routeParams.id, $scope.codigoObra).then(
                    function(response) {
                        $scope.obraDatos = response.data.promociones[0];
                    },
                    function(err) {
                        $log.error(err);
                    }
              );

            //console.log($scope.obraDatos);

            //Cuando el usuario pulse boton para "Guardar"
            $scope.guardarObra = function() {   
                promotoresFactory.editObra($routeParams.id, $scope.codigoObra, $scope.obraDatos).then(
                    function() {
                       //Solo por probar el servicio de LS
                       //localStorageSvc.addPendingOper('editobra', $scope.obraDatos);
                       //console.log(localStorageSvc.getAllPendingOper());
                       $location.path('/obrapromotor/' + $routeParams.id + '/detail/' + $routeParams.cod);
                    },
                    function(err) {
                        $scope.isError = true;
                        $scope.errorMsg = err; 
                        $log.error('error en guardarObra: edicion');
                    }
                );
            }; 

            //Redirigimos al listado de obras de ese promotor
			$scope.back = function () {
				$location.path('/obraspromotor/' + $routeParams.id); 
			};

        }
    ]);