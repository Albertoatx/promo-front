'use strict';

/**
 * @ngdoc function
 * @name promotorApp.controller:UserDetailCtrl
 * @description
 * # UserDetailCtrl
 * Controller of the promotorApp
 */
angular.module('promotorApp')
    .controller('UserDetailCtrl', ['$scope', '$log', 'authFactory', '$routeParams','$location',
	    function ($scope, $log, authFactory, $routeParams, $location) {

			  $scope.viewUser = true; //Vamos a usar "tabs" para la navegación

			  $scope.userDatos = {}; //Vaciamos el objeto movie del $scope
			  $scope.userDatos.username = $routeParams.username;
			  //console.log($scope.userDatos.username);

			  $scope.isError  = false;
			  $scope.isOk     = false;      
              $scope.errorMsg = '';  
              $scope.okMsg    = '';
              $scope.okRuta   = '';

			  //TRAER EL DETALLE
			  authFactory.detailUser($scope.userDatos.username).then(
		            function(response) {
		                $scope.userDatos = response.data;
		                $scope.userDatos.datebirth = new Date($scope.userDatos.datebirth);
		                $log.info($scope.userDatos);
		            },
		            function(err) {
		                $log.error(err);
		            }
	          );

              //console.log($scope.userDatos);
              var username = $scope.userDatos.username;


	          //Si pinchamos boton "actualizar", navegar al detalle.  
              $scope.actualizar = function() {
            	authFactory.editUser($scope.userDatos._id, $scope.userDatos).then(
                    function(res) {

                        //console.log('ACTUALIZACION DE USUARIO OK')
                        //console.log(res.data);
                        $scope.isOk = true;
                        $scope.activado = false;
                        $scope.okMsg = 'Se han actualizado sus datos de usuario exitosamente';
                        $scope.okRuta = '/promotores'

                        //$location.path('/user/' + username); 
                    },
                    function(err) {
                        $scope.isError = true;
                        $scope.errorMsg = err;  
                        $log.error('error en la actualizacion de usuario. [user-xxxxx.js]');
                    }
                ); 
             }; 
		}
	]);