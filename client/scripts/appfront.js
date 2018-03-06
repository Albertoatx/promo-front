'use strict';


// Declare app level module which depends on filters, and services
angular.module('promotorApp', [
    'ngRoute',
    'ui.bootstrap',
    'ngAnimate', 
    'angularUtils.directives.dirPagination'
]) //Pensar en "Run" como el controlador inicial (para el index.html) donde se fijan variables en tiempo de inicio de la aplicacion.
   //Only instances and constants can be injected into run blocks: This is to prevent further system configuration during application run time.
   //Run blocks are the closest thing in Angular to the main method. A run block is the code which needs to run to kickstart the application. 
  .run(function($rootScope, $log, $location, authFactory, $interval) { 
      //console.log("Se esta ejecutando el metodo de arranque RUN");
      $rootScope.administrator = false;
      $rootScope.authenticated = false;
      $rootScope.current_user = '';
      $rootScope.counterEntry = 0; //marcar en $interval si no estamos logeados (0) o si lo estamos (1)

      // ------------------------------------------------------------------------
      // La llamada al back-end devolvera una promesa (.then devuelve una promesa) 
      // que debo forzar que se ejecute ANTES que el "resolve" del enrutado (debo encadenarlas)
      // Para eso crear promesa y añadirla al $rootScope dentro del 'root' controller (el .run)
      
      $rootScope.currentUserPromise = authFactory.isLoggedIn().then(    
          function(response) {

            var sessionUsername = response.data;

            //Comprobado: Se ejecuta 1 sola vez, al arrancar la app 
            //console.log('Promesa dentro del RUN, se ejecuta 1 sola vez');

            // * si ya existe propiedad 'user' en la sesion -> user ya logeado
            // * si NO existe propiedad 'user' en la sesion -> user NO logeado
            if (sessionUsername && sessionUsername != '') {
              $rootScope.current_user = sessionUsername; 
              $rootScope.authenticated = true;

              if (sessionUsername === 'admin') 
                  $rootScope.administrator = true;

              console.log('El usuario ' + sessionUsername + ' ya se encontraba previamente logeado!');
            } 
            //la promesa puede devolver algo para enlazar como parametro a la sgte promesa
            return sessionUsername; 
        },
        function(err) {
            $log.error(err);
      });

      // ------------------------------------------------------------------------
      // Recordar que cada navegador web tendra 1 sesion compartida para todas sus pestañas
      // $interval: ejecuta la funcion de forma repetida cada cierto intervalo de tiempo 
      // Util para el control de distintas pestañas de un mismo navegador 
      //  (que todas tengan el usuario logeado en cuanto nos logemos en 1 de las pestañas)
      //Realmente este $interval solo llama al back-end cuando se cumple la condicion del IF (NO estar logeados)
      /*
      var intervalPromiseLogin = $interval(function(){

        //console.log("Se ejecuta la funcion $interval");
        //console.log("$rootScope.counterEntry: " + $rootScope.counterEntry);

        // NO estamos logeados (entonces hacer continuas llamadas al back-end hasta detectar logeo)
        if ($rootScope.counterEntry === 0) { 
          //console.log("$interval para detectar LOGIN y aplicarlo a todas pestañas del navegador");
          authFactory.isLoggedIn().then(
            function(response) {

              var sessionUser = response.data;

              //Nos hemos logeamos (backend devuelve sesion) -> las otras pestañas se enteran 
              // ya que ejecutan su propio $interval y tendrán el 'sessionUser' sincronizado (del 'back-end')
              if (sessionUser && sessionUser != '') { 
                $rootScope.current_user = sessionUser; 
                $rootScope.authenticated = true;
                $rootScope.counterEntry++;  // MUY IMPORTANTE (aqui para ser conpartido por el $interval del logout)

                if (sessionUser === 'admin') 
                  $rootScope.administrator = true;

                console.log('$interval LOGIN: El usuario ' + sessionUser + ' se encuentra logeado!');
                $location.path('/promotores');

                //stopIntervalExec();
              }
            },
            function(err) {
              $log.error(err);
            }
          )
        } // end if 
      }, 8000); //cada 8 segundos
      */
    
      //Cancelar la ejecución de $interval cuando bajo cierta condicion
      //En nuestro caso no interesa hacerlo (permitiria logearse en distintas pestañas con distintos usuarios)
      /*
      var stopIntervalExec = function() {
        if (angular.isDefined(intervalPromiseLogin) && $rootScope.current_user != '') {
          $interval.cancel(intervalPromiseLogin);
          intervalPromiseLogin = undefined;
        }
      }; */


      // ------------------------------------------------------------------------
      //Realmente este $interval solo llama al back-end cuando se cumple la condicion del IF (estamos logeados)
      //pero es necesario que este a nivel raiz del RUN (para que se ejecute en todas las pestañas)
      // (si se pusiese asociado a algo dentro del 'signout solo afectaria a la pestaña donde se haga signout)
      /*
      var intervalPromiseSignout = $interval(function(){

        //PROBLEMA, cada pestaña del navegador tendra distintas copias de las variables en rootScope
        //Para sincronizarlas NO podemos hacer STOP del $interval ya que si paramos el $interval
        //no tendriamos el valor actualizado de la sesión en las distintas pestañas
        // (al parar el $interval no podemos acceder al back-end desde el RUN para tener 
        //  el mismo current_user en las distintas pestañas). Esto sería problemático ya que 
        // permitiria salir de sesion y luego volver a entrar con distintos usuarios en dist. pestañas

        //console.log("current_user :" + $rootScope.current_user); 
        //console.log("$rootScope.counterEntry: " + $rootScope.counterEntry);

        // SI estamos logeados (entonces hacer continuas llamadas al back-end hasta detectar logout)
        if ($rootScope.counterEntry > 0) {  
          //console.log("$interval para detectar LOGOUT y aplicarlo a todas pestañas del navegador");
          authFactory.isLoggedIn().then(
            function(response) {
              
              var sessionUser = response.data;
              
              //Nos hemos deslogeado (backend no devuelve user en sesion) -> las otras pestañas se enteran 
              // ya que ejecutan su propio $interval y tendrán el 'sessionUser' sincronizado (del 'back-end')
              if (sessionUser === '') {  
                
                $rootScope.administrator = false;
                $rootScope.authenticated = false;
                $rootScope.current_user = '';
                $rootScope.counterEntry = 0;
                $location.path('/');
                console.log('$interval LOGOUT: no hay usuario en sesion');
                //stopIntervalSignoutExec();
              }
            },
            function(err) {
              $log.error(err);
            }
          )
        }
      }, 8000); //cada 8 segundos
      */

      //Cancelar la ejecución de $interval cuando bajo cierta condicion
      //En nuestro caso no interesa hacerlo (permitiria logearse en distintas pestañas con distintos usuarios)
      /*
      var stopIntervalSignoutExec = function() {
        if (angular.isDefined(intervalPromiseSignout)) {
          $interval.cancel(intervalPromiseSignout);
          intervalPromiseSignout = undefined;
        }
      }; */

    
      //-------------------------------------------------------------------------
      //El método para logout lo hace global para que podamos acceder a el en todo momento
      $rootScope.signout = function(){
        //$http.get('/auth/logout'); //Podemos llamar directo sin usar factoria no tenemos una pantalla y controlador propios
        
        authFactory.logout().then(
          function(res, err) {
              //$cookies.loggedInUser = res.data;
              $rootScope.administrator = false;
              $rootScope.authenticated = false;
              $rootScope.current_user = '';
              $location.path('/');
          },
          function(err) {
              console.log('Entra por la RAMA del error en el logout');
              //$rootScope.authenticated = false;
              //$rootScope.current_user = '';
              $log.log(err);
              //flashMessageService.setMessage(err.data);
          }
        );
      };
  })
  //to inject a service in config you just need to call the Provider of the service by adding 'Provider' to it's name
 .config(function ($routeProvider, authFactoryProvider, $locationProvider) {

    //$locationProvider.html5Mode(true);

    //Run controllers only after initialization (RUN method) is complete in AngularJS
    //(to force that checkAccess() method is executed AFTER the asynch back-end query in the RUN ends 
    var chainedCheck = function($rootScope){
      $rootScope.currentUserPromise.then(function(sessUsername) {
        //console.log("ENTRA DENTRO del THEN para encadenar promesa con usuario " + sessUsername);
        authFactoryProvider.$get().checkAccess();
      });
    }

    var chainedCheckForRole = function($rootScope){
        $rootScope.currentUserPromise.then(function(sessUsername) {
          authFactoryProvider.$get().checkAccessWithRole();
        });
    }

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      }) 
      //Rutas front-end PROMOTORES *******************
      .when('/promotores', {
        templateUrl: 'views/promotores.html',
        controller: 'PromotoresCtrl',
        resolve:{
           /* Avoid repeating the same code in every route so be better try to centralize it in a factory service
           "check":function($rootScope, $location){   //function to be resolved, accessFac and $location Injected
              //check if the user has permission -- This happens before the page loads
              if($rootScope.authenticated === true){    
                console.log("User has access");
              }else{
                alert("You don't have access here! You must log in before");
                $location.path('user/login');                
              }
            } */

            //If you define a Factory recipe, an empty Provider type with the $get method set to your factory function is automatically created
           //PROBLEM: if the user is NOT logged in the http request still happens (in Chrome dev tools we can see data)
           //check: authFactoryProvider.$get().checkPermissions

           //PROBLEM: if the user is logged and we open this route directly in a new browser tab 
           // it will redirect to the login although we are already logged (because this executes BEFORE
           // the call to the back-end in the "run" method finishes
           //check: authFactoryProvider.$get().checkAccess

           //To avoid redirecting to the login page when we are alredy logged (when we try to open a route directly)
           check: chainedCheck 

         }   
      })
      .when('/promotor/create', {
        templateUrl: 'views/promotor-add.html',
        controller: 'PromotorAddCtrl',
        resolve:{
           //check: authFactoryProvider.$get().checkPermissions 
           //check: authFactoryProvider.$get().checkAccess
           check: chainedCheck 
        }  
      })
      .when('/promotor/detail/:id', {
        templateUrl: 'views/promotor-detail.html',
        controller: 'PromotorDetailCtrl',
        resolve:{
           //check: authFactoryProvider.$get().checkPermissions 
           //check: authFactoryProvider.$get().checkAccess
           check: chainedCheck 
        }  
      })
      .when('/promotor/delete/:id', {
        templateUrl: 'views/promotor-delete.html',
        controller: 'PromotorDeleteCtrl',
        resolve:{
           //check: authFactoryProvider.$get().checkPermissions 
           //check: authFactoryProvider.$get().checkAccess
           check: chainedCheck 
        }  
      })
      .when('/promotor/edit/:id', {
        templateUrl: 'views/promotor-edit.html',
        controller: 'PromotorEditCtrl',
        resolve:{
           //check: authFactoryProvider.$get().checkPermissions 
           //check: authFactoryProvider.$get().checkAccess
           check: chainedCheck 
        } 
      })
      //Rutas front-end OBRAS ***********************
      .when('/obrasAll', {
        templateUrl: 'views/obras-all.html',
        controller: 'ObrasCtrl',
        resolve:{
           //check: authFactoryProvider.$get().checkPermissions 
           //check: authFactoryProvider.$get().checkAccess
           check: chainedCheck 
        }  
      })
      .when('/obraspromotor/:id', {
        templateUrl: 'views/obras.html',
        controller: 'ObrasPromotorCtrl',
        resolve:{
           //check: authFactoryProvider.$get().checkPermissions 
           //check: authFactoryProvider.$get().checkAccess
           check: chainedCheck 
        }  
      })
      .when('/obrapromotor/:id/create', {
        templateUrl: 'views/obra-add.html',
        controller: 'ObraAddCtrl',
        resolve:{
           //check: authFactoryProvider.$get().checkPermissions
           //check: authFactoryProvider.$get().checkAccess 
           check: chainedCheck 
        }
      })
      .when('/obrapromotor/:id/detail/:cod', {
        templateUrl: 'views/obra-detail.html',
        controller: 'ObraDetailCtrl',
        resolve:{
           //check: authFactoryProvider.$get().checkPermissions 
           //check: authFactoryProvider.$get().checkAccess
           check: chainedCheck 
        }
      })
      .when('/obrapromotor/:id/delete/:cod', {
        templateUrl: 'views/obra-delete.html',
        controller: 'ObraDeleteCtrl',
        resolve:{
           //check: authFactoryProvider.$get().checkPermissions
           //check: authFactoryProvider.$get().checkAccess
           check: chainedCheck  
        }
      })
      .when('/obrapromotor/:id/edit/:cod', {
        templateUrl: 'views/obra-edit.html',
        controller: 'ObraEditCtrl',
        resolve:{
           //check: authFactoryProvider.$get().checkPermissions
           //check: authFactoryProvider.$get().checkAccess 
           check: chainedCheck 
        }
      })
      //Rutas front-end USUARIOS ***********************
      .when('/user/create', {
        templateUrl: 'views/user-register.html',
        controller: 'UserAddCtrl',
      })
      .when('/user/login', {
        templateUrl: 'views/user-login.html',
        controller: 'UserLoginCtrl'
      })
      .when('/user/:username', { //lo usamos para detalle y borrado.
        templateUrl: 'views/user-detail.html',
        controller: 'UserDetailCtrl',
        resolve:{
           //check: authFactoryProvider.$get().checkPermissions 
          // check: authFactoryProvider.$get().checkAccessWithUser($routeParams.username)  //No permite injectar $routeParams aqui
           //check: authFactoryProvider.$get().checkAccessWithUser
          check: function($rootScope){
            $rootScope.currentUserPromise.then(function(sessUsername) {
              authFactoryProvider.$get().checkAccessWithUser();
            });
          }
        }
      })
      .when('/admin', { //Ruta al panel de administracion
        templateUrl: 'views/user-admin.html',
        controller: 'UserAdminCtrl',
        resolve:{
           //check: authFactoryProvider.$get().checkUserRole
           //check: authFactoryProvider.$get().checkAccessWithRole 
           check: chainedCheckForRole
        }
      })
      .when('/user/delete/:username', { 
        templateUrl: 'views/user-delete.html',
        controller: 'UserDeleteCtrl',
        resolve:{
           //check: authFactoryProvider.$get().checkUserRole 
           //check: authFactoryProvider.$get().checkAccessWithRole 
           check: chainedCheckForRole
        }
      })
      .otherwise({
        redirectTo: '/'
      });
      
    }) //config(function ($routeProvider)
