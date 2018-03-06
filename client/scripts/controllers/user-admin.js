'use strict';

/**
 * @ngdoc function
 * @name promotorApp.controller:UserAdminCtrl
 * @description
 * # UserAdminCtrl
 * Controller of the promotorApp
 */
angular.module('promotorApp')
//.controller('PromotoresCtrl', function ($scope) { //Le pasamos el objeto factoria "Promotor" creado en "app.js"
  .controller('UserAdminCtrl', ['$scope', '$log', 'authFactory', '$location','$rootScope','$uibModal',

      function($scope, $log, authFactory, $location, $rootScope, $uibModal) {

          //console.log($rootScope.current_user);
          $scope.numItemsPerPage = 10;
        
          //Llama al método "getUsers" de la API del front definido en "factorias.js" y que se comunica con el back
          authFactory.getUsers().then(    
                function(response) {  
                    //En el $scope estarán los datos devueltos por el servicio REST a la factoria.       
                    $scope.usuarios   = response.data; 
                    $scope.countUsers = response.data.length;
                    //console.log($scope.countUsers);
                },
                function(err) {
                    $log.error(err);
          });

          $scope.sort = function(keyname){
            $scope.sortKey = keyname;         //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
          };

          // MODAL WINDOW  *********************************************************************************************
          $scope.showModal = function(user) {
            $scope.user = user;                  //Como argumento llega el usuario seleccionado de la lista de usuarios
            
            console.log('usuario en showModal');
            //console.log(user);
            
            //ABRE de una ventana modal ($uibModal utiliza promesas para devolver los objetos)
            var modalInstance = $uibModal.open({  
                //La ventana modal que se va a renderizar 
                templateUrl: 'views/modalwindows/change-password.html',
                //El controlador que va a gestionar la pantalla modal (hay que definirlo en el mismo fichero)
                controller: 'PasswordCtrl',
                //
                size: 'lg',
                //nombre que le vamos a dar a la ventana para aplicarles estilos en el CSS
                windowClass: 'large-Modal',
                //En el resolve 
                resolve: {     //Enviamos la función "userData" como parametro al controller de la ventana modal
                               //De esa forma le estamos pasando lo que tengamos aquí en $scope.user
                               //Al cerrarse la ventana modal (metodo close) lo que pongamos como parametro llegara aqui
                               //para poder ser utilizado luego en nuestro controlador externo (UserAdminCtrl)
                    userData: function() {
                        return $scope.user; //in the resolve we are returning the newUser model 
                    }
                } 
            })

            //console.log($scope.user);

          } 
             /* Esto sería en caso de que quisiesemos utilizar lo que nos devuelve la ventana modal al hacer "close" ($scope.data)
             /* En nuestro caso no tiene sentido, si estuviesemos insertando algo si que lo tendría
            //Now we have "newUser" model returned as a response to the promise, push it into our "subscriber" model.
            modalInstance.result.then(function(selectedItem) {
            //modalInstance.result.then(function() {
                $scope.subscribers.push({
                    no: $scope.subscribers.length + 1,
                    name: $scope.newUser.name,
                    userType: $scope.newUser.userType,
                    loyalty: $scope.newUser.loyalty,
                    joinDate: $scope.newUser.joinDate
                });
            }); 
        }; */
      }
  ])

  //Controlador para la "modal window" ************************************************************************
  .controller('PasswordCtrl', function($scope, $uibModalInstance, userData, authFactory) {
      //La ventana modal tiene su propio $scope
      $scope.userDatos = userData;

      $scope.data = {};
      $scope.isError  = false;
      $scope.isOk     = false;         
      $scope.errorMsg = '';  
      $scope.okMsg    = '';

      //Function for the X button in the modal window
      $scope.cancel = function() {
          $uibModalInstance.dismiss('cancel');
      };

      //Function for the "Guardar password" in the modal window
      $scope.saveNewPassword = function() {

          //console.log('Entra en funcion saveNewPassword');

          $scope.data.username    = $scope.userDatos.username;
          $scope.data.oldpassword = $scope.oldPassword;
          $scope.data.newpassword = $scope.newPassword;
        
          authFactory.renewPassword($scope.data).then(
                function(res) {

                    console.log('Se ha actualizado el nuevo password bien');
                    //console.log(res.data);
                    $scope.userDatos = res.data;
                    $scope.isOk = true;
                    $scope.isError = false;
                    $scope.okMsg = 'Password del usuario: ' + $scope.data.username + ' renovada exitosamente';
                    $scope.okRuta = '/admin';
                    //Si el proceso ha ido OK al cabo de 3 segundos cerramos la ventana modal regresando datos.
                    setTimeout(function(){
                        $uibModalInstance.close($scope.data);
                        //$uibModalInstance.close($scope.userDatos); //devuelve datos actualizados del usuario 
                    }, 3000);                         //por si queremos usarlos en el controlador externo que llama a la ventana modal
                },
                function(err) {
                    $scope.isOk     = false;
                    $scope.isError  = true;
                    $scope.errorMsg = err; 
                }
          ); 
      };
  });