'use strict';

/**
 * @ngdoc function
 * @name promotorApp.controller:PromotoresCtrl
 * @description
 * # PromotoresCtrl
 * Controller of the promotorApp
 */
angular.module('promotorApp')
//.controller('PromotoresCtrl', function ($scope) { //Le pasamos el objeto factoria "Promotor" creado en "app.js"
  .controller('PromotoresCtrl', ['$scope', '$log', 'promotoresFactory', '$location','$rootScope',

      //HARD-CODEADO para comprobar integracion inicial.
      /*$scope.promotores = [
        {
          codigo: '000001',
          nombre: 'Promotor hardcodeado 1'
        },
        {
          codigo: '000002',
          nombre: 'Promotor hardcodeado 2'
        },
        {
          codigo: '0003003',
          nombre: 'Promotor hardcodeado 3'
        }
      ];  */

      function($scope, $log, promotoresFactory, $location, $rootScope) {


          $rootScope.promotorSeleccionado = '';
          /*
          console.log("current user: " + $rootScope.current_user);
          console.log("administrator: " + $rootScope.administrator);
          console.log("authenticated: " + $rootScope.authenticated); */
          $scope.miFiltro = '';
          $scope.promotoresAll = [];
          $scope.promotoresUser = [];
          $scope.strictFilter = false;
          $scope.numItemsPerPage = 10;

          
          //Llama al método "getPromotores" de la API del front definido en "factorias.js" y que a su vez se comunica con el backend
          // con el backend mediante un servicio REST a la ruta adecuada
          // FUNCIONAAAAAAAAAAA - Version estable OLD (sin usar cache)
          
          promotoresFactory.getPromotores().then(    
                function(response) {  
                    //En el $scope estarán los datos devueltos por el servicio REST a la factoria.       
                    $scope.promotores = response.data; 
                    $scope.promotoresAll = response.data; 
                    $scope.countPromo = response.data.length;
                    //console.log($scope.countPromo);
                },
                function(err) {
                    $log.error(err);
          }); 

          // TESTEANDO NUEVA VERSION (la factoria ya trata la promesa y nos envia datos (de la cache o servidor) en otra promesa )************
          /*
          promotoresFactory.getPromotores().then(    
                function(data) {     
                    $scope.promotores = data; 
                    $scope.countPromo = data.length;
                    console.log($scope.countPromo);
                    console.log($scope.promotores);
                },
                function(err) {
                    $log.error(err);
          }); 
          */

          //Así se haría un borrado DIRECTO (es decir, sin no definimos vista parcial ni controlador propios)
          //    "eliminarPromotor" solo se lanza cuando el usuario pulse en "Eliminar" de la fila
          //    Se llama directo al metodo "deletePromotor" en la API del front (definida en "factorias.js")
          //    Una vez eliminado el promotor redirigimos al listado de los promotores con $location
          /*$scope.eliminarPromotor = function(id) {
                promotoresFactory.deletePromotor(id).then( 
                  function() {
                      $location.path('/promotores'); 
                  },
                  function() {
                      $log.error('error en eliminarPromotor');
                  }
              );
          };  */

          $scope.sort = function(keyname){
            $scope.sortKey = keyname;         //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
          }

          //OPCION1: Usar un FILTRO de Angular, de este modo no hace falta ir al servidor por "mis promotores"
          $scope.gestionarCheckbox = function() {   
            //console.log('Entra en validarCheckbox');

            if ($scope.activado) {
                $scope.usuario = $rootScope.current_user;
                $scope.strictFilter = true;

            }
            else {
               $scope.usuario = '';
               $scope.strictFilter = false;
            }
          };         


          //OPCION2: Ir al servidor por la info de "mis promotores", se hace control para solo tener que ir 1 vez 
          //         al servidor por esa información, se guardan copias que luego se presentan o no en funcion del checkbox
          /* 
          $scope.gestionarCheckbox = function() {   
            console.log('Entra en validarCheckbox');

            if ($scope.activado) {
                
                if ($scope.promotoresUser.length) { //
                  console.log('Muestra MIS promotores sin irlos a buscar al server (ya los buscamos antes)');
                  $scope.promotores = $scope.promotoresUser;
                } else {
                  //Conectamos con servidor para traer mis promotores (hacerlo solo 1 vez)
                  console.log('Aun no tenemos mis promotores especificos, ir a buscarlos al server');
                  promotoresFactory.misPromotores($rootScope.current_user).then(    
                    function(response) {  
                        //En el $scope estarán los datos devueltos por el servicio REST a la factoria.       
                        $scope.promotores     = response.data; 
                        $scope.promotoresUser = response.data;
                        $scope.countPromo     = response.data.length;
                        console.log($scope.countPromo);
                    },
                    function(err) {
                        $log.error(err);
                  });
                }
            }
            else {
               console.log('Muestra TODOS los promotores SIN irlos a buscar al server');
               $scope.promotores = $scope.promotoresAll;
            }
          }; */

      }
  ]);