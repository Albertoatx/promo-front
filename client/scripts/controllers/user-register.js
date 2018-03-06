'use strict';

/**
 * @ngdoc function
 * @name promotorApp.controller:UserAddCtrl
 * @description
 * # UserAddCtrl
 * Controller of the promotorApp
 */
angular.module('promotorApp')

   .controller('UserAddCtrl', ['$scope', '$log', 'authFactory', '$location', '$routeParams', '$rootScope',
    	//Llama al "savePromotor" de la API del front (en "factorias.js") que se comunicarse con el backend mediante servicio REST a la ruta adecuada
        function($scope, $log, authFactory, $location, $routeParams, $rootScope) {

            $scope.userDatos = {}; 

            //$rootScope.authenticated = true; 
            //$scope.isRegistrado = false; 

            $scope.isError = false;      
            $scope.errorMsg = '';    

            $scope.register = function() {   //Crear un nuevo usuario
                authFactory.saveUser($scope.userDatos).then(
                    function(res) {
                        //$scope.isRegistrado = true; 
                        $rootScope.authenticated = true; 
                        //console.log('REGISTRO DE USUARIO OK')
                        //console.log(res.data);
                        //$rootScope.current_user = res.data; //ANTES enviaba username desde el BACK-END como texto
                        
                        //console.log(res.data.username);
                        $rootScope.current_user = res.data.username; //Mejor enviar username desde BACK-END en formato JSON  
                        $location.path('/promotores'); //2 opciones tras registar, crear sesion en backend y llevar a pantalla promo
                        //$location.path('/user/login');   //No crear la sesion y llevar a la pantalla de login
                    },
                    function(err) {
                        $scope.isError = true;
                        $scope.errorMsg = err;  
                        $log.error('error en el registro de usuario. [user-register.js]');
                    }
                );
            }; 
        }
    ]);