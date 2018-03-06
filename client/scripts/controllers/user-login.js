'use strict';

/**
 * @ngdoc function
 * @name promotorApp.controller:UserLoginCtrl
 * @description
 * # UserLoginCtrl
 * Controller of the promotorApp
 */
angular.module('promotorApp')

   .controller('UserLoginCtrl', ['$scope', '$log', 'authFactory', '$location', '$routeParams', '$rootScope',
    	//Llama al "savePromotor" de la API del front (en "factorias.js") que se comunicarse con el backend mediante servicio REST a la ruta adecuada
        function($scope, $log, authFactory, $location, $routeParams, $rootScope) {

            //$scope.userDatos = {};  
            //$scope.isRegistrado = false; 
            $scope.isError = false;      
            $scope.errorMsg = '';   

            $scope.credentials = {
                username: '',
                password: ''
            };

            $scope.login = function(credentials) {
                authFactory.login(credentials).then(
                    function(res, err) {
                        //$cookies.loggedInUser = res.data;
                        $rootScope.authenticated = true;
                        console.log('Login exitoso, se ha logeado con el usuario: ' + res.data);
                        $rootScope.current_user = res.data;

                        if (res.data == 'admin') {
                            $rootScope.administrator = true;
                        }
                        
                        $location.path('/promotores');  //url en Router
                    },
                    function(err) {
                    	$scope.isError = true;
                        $scope.errorMsg = err;  
                        $log.log(err);
                        //flashMessageService.setMessage(err.data);
                    });
            }; 

         /*   $scope.login = function() {   //Crear un nuevo usuario
                authFactory.login($scope.userDatos).then(
                    function() {
                        $scope.isRegistrado = true; 
                        $location.path('/promotores');
                    },
                    function(err) {
                        $scope.isError = true;
                        $scope.errorMsg = err;  
                        $log.error('error en el registro de usuario. [user-register.js]');
                    }
                );
            };  */
        }
    ]);