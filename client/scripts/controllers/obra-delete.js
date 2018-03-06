'use strict';

/**
 * @ngdoc function
 * @name promotorApp.controller:ObraDeleteCtrl
 * @description
 * # ObraDeleteCtrl
 * Controller of the promotorApp
 */
angular.module('promotorApp')

   .controller('ObraDeleteCtrl', ['$scope', '$log', 'promotoresFactory', '$location', '$routeParams',
    	//Llama al "deletePromotor" de la API del front (en "factorias.js") que comunica con backend mediante servicio REST a ruta adecuada
        function($scope, $log, promotoresFactory, $location, $routeParams) {
          
            $scope.isError  = false;      
            $scope.errorMsg = '';   

            $scope.promotorDatos_id = $routeParams.id;
            $scope.codigoObra       = $routeParams.cod;

            //Recuperamos los datos de la obra para poder mostrarlos en pantalla de borrado
            promotoresFactory.detailObra($routeParams.id, $scope.codigoObra).then(
                    function(response) {
                       /* $scope.promotorDatos = response.data; */
                        //console.log(response.data);
                        $scope.obraDatos = response.data.promociones[0];
                    },
                    function(err) {
                        $log.error(err);
                    }
              );

            //Cuando se pinche el boton "Yes" eliminamos el promotor, luego redirigimos al listado de obras
            $scope.borrarObra = function() {   
                promotoresFactory.deleteObra($scope.promotorDatos_id, $scope.codigoObra).then(
                    function() {
                        $location.path('/obraspromotor/' + $routeParams.id);  
                    },
                    function(err) {
                        $scope.isError = true;
                        $scope.errorMsg = err; 
                        $log.error('error en borrarObra de un promotor');
                    }
                );
            }; 

            //Cuando se pinche en el boton "No" redirigimos al detalle de la obra
            $scope.back = function() {
              $location.path('/obrapromotor/' + $routeParams.id + '/detail/' + $routeParams.cod);  
            };

        }
    ]);