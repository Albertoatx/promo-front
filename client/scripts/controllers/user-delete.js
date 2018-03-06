'use strict';

/**
 * @ngdoc function
 * @name promotorApp.controller:UserDeleteCtrl
 * @description
 * # UserDeleteCtrl
 * Controller of the promotorApp
 */
angular.module('promotorApp')

   .controller('UserDeleteCtrl', ['$scope', '$log', 'authFactory', '$location', '$routeParams','$rootScope',
    	//Llama al "deletePromotor" de la API del front (en "factorias.js") que comunica con backend mediante servicio REST a ruta adecuada
        function($scope, $log, authFactory, $location, $routeParams, $rootScope) {
          
            $scope.isError  = false;      
            $scope.errorMsg = ''; 

            //console.log('BORRADO DE USUARIO');
            //console.log($routeParams);
            var username = $routeParams.username;

            if ($rootScope.administrator) {

	            //Recuperamos los datos del usuario para poder mostrarlos en pantalla de borrado 
	            //y tb porque NECESITAMOS recuperar el id para el borrado (por parametro nos llega el usuario).
	            authFactory.detailUser(username).then(
	                    function(response) {
	                        $scope.userDatos = response.data;
	                    },
	                    function(err) {
	                        $log.error(err);
	                    }
	            );

	            //Cuando se pinche el boton "Si" eliminamos el usuario, luego redirigimos al listado de usuarios
	            $scope.borrarUsuario = function() {   
	                authFactory.deleteUser($scope.userDatos._id).then(
	                    function() {
	                        $location.path('/admin'); 
	                    },
	                    function(err) {
	                        $scope.isError = true;
	                        $scope.errorMsg = err;
	                        $log.error('error en borrarUser');
	                    }
	                );
	            }; 

            } else {
            	$scope.isError = true;
            	$scope.errorMsg = 'No dispone de permisos de administrador para poder borrar un usuario.';
            }

            //Cuando se pinche en el boton "No" redirigimos al listado de usuarios
            $scope.back = function() {
              $location.path('/admin');
            };

        }
    ]);