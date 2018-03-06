'use strict';
//angular.module('promotorApp.factorias', [])
angular.module('promotorApp')

    //Ya que vamos a tratar con datos usando un servicio web en el backend (usando nuestra api definida en "api.js"), creamos factorias para 
    //comunicarnos con dicho servicio web en el backend. 
    //Por tanto aquí crearemos nuestros servicios factoria que harán las operaciones CRUD
    //Ver esta factoria como una API en el frontend para comunicarse con nuestra API definida en el backend con ExpressJS
    // (Normalmente se define 1 funcionalidad en el front para cada funcionalidad en el backend haciendo una petición a la ruta ExpressJS apropiada)
    //NOTA: Los controladores de Angular serán quienes trabajen con estas factorias que definimos aqui.
    .factory('promotoresFactory', ['$http', '$q',
        function ($http, $q) {

            // Sin salida a Internet esta instruccion google = undefined ya que no ha podido descargar el script
            //   y esto tenia como efecto secundario que no se recuperasen los promotores
            // var geocoder = new google.maps.Geocoder();  
            // var coordenadas = {'latitud':0.0, 'longitud':0.0};

            var baseUrlForCoordenates = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
            var keyApi = 'AIzaSyAYPE5eUENmWQ4ci3EkbTBR3C1c45qb9tA';

            var self = this;
            self.promotores = null;

            var baseUrlForDevNode = "http://localhost:3000";  //la ruta base del servidor NODE donde correra el back-end
            
            var httpConfigObj = {withCredentials: true};

            return {

                //PROMOTORES *********************************************************************************
                //$http devuelve una promesa
                getPromotores: function () {

                    //console.log("La ruta para mostrar lista promotores con la app Node sera: ");
                    //console.log(baseUrlForDevNode + '/api/promotores');
                    
                    //OLD VERSION
                    //return $http.get(baseUrlForDevNode + '/api/promotores', {withCredentials: true});
                    return $http.get(baseUrlForDevNode + '/api/promotores', httpConfigObj);  //Llama al servicio web REST del backend encargado de atender la ruta "/api/pages"

                    //NEW VERSION (uses $q to cached data)
                    /*
                    // Create a deferred operation.
                    var deferred = $q.defer();
                    
                    // If we already have the list of promoters (CACHED), we can resolve the promise.
                    if(self.promotores !== null) {
                        console.log("(from Cache!)" + self.promotores);
                        deferred.resolve(self.promotores);
                    } else {
                        // Get promoters from the server.
                        $http.get(baseUrlForDevNode + '/api/promotores', httpConfigObj)
                          .then(function(response) {
                            self.promotores = response.data;
                            console.log("(from Server!)" + self.promotores);
                            deferred.resolve(self.promotores);
                          },function(error) {
                            deferred.reject(error);
                          });
                    }
 
                    return deferred.promise; //return the promise we've built with deferred
                    */
                },
                savePromotor: function (promotorData) {
                    return $http.post(baseUrlForDevNode + '/api/promotores/add', promotorData, httpConfigObj);
                },
                detailPromotor: function (id) {
                    return $http.get(baseUrlForDevNode + '/api/promotores/' + id, httpConfigObj);
                },
                editPromotor: function (id, promotorData) {
                    return $http.put(baseUrlForDevNode + '/api/promotores/' + id, promotorData, httpConfigObj);
                },
                deletePromotor: function (id) {
                    return $http.delete(baseUrlForDevNode + '/api/promotores/' + id, httpConfigObj);
                },
                misPromotores: function (username) {
                    return $http.get(baseUrlForDevNode + '/api/mispromotores/' + username, httpConfigObj);
                },

                //OBRAS *************************************************************************************
                getObrasAll: function () {
                    return $http.get(baseUrlForDevNode + '/api/promociones', httpConfigObj);
                },
                getObrasPromotor: function (id) {
                    return $http.get(baseUrlForDevNode + '/api/promociones/' + id, httpConfigObj);
                },
                saveObra: function (id, obraData) {
                    return $http.post(baseUrlForDevNode + '/api/promociones/add/' + id, obraData, httpConfigObj);
                },
                detailObra: function (id, codObra) {
                    return $http.get(baseUrlForDevNode + '/api/promociones/' + id + '/' + codObra, httpConfigObj);
                },
                editObra: function (id, codObra, obraData) {
                    return $http.put(baseUrlForDevNode + '/api/promociones/' + id + '/' + codObra, obraData, httpConfigObj);
                },  //Ojo, es POST porque el borrado NO es de todo el documento, solo de 1 elemento embebido 
                deleteObra: function (id, codObra) {
                    return $http.post(baseUrlForDevNode + '/api/promociones/' + id + '/' + codObra, httpConfigObj);
                },

                //Look for coordinates to later use in Google Maps ----------------------
                getLatitudLongitud: function (address) {

                    var coord = { 'latitud': 0, 'longitud': 0 };
                    var fullUrl = baseUrlForCoordenates + address + '&key=' + keyApi;
                    //alert("fullUrl para obtener coordenadas " + fullUrl);

                    //El servicio trata la promesa (haga la logica que pueda usar cualquier controlador) 
                    return $http.get(fullUrl)
                        .then(
                        function (response) {
                            coord.latitud = response.data.results[0].geometry.location.lat;
                            coord.longitud = response.data.results[0].geometry.location.lng;

                            return coord;
                        } //Si hay error que lo capture el .catch de la ultima promesa
                        /*
                        ,
                        function (err) {
                            console.log("Error al intentar conseguir las coordenadas");
                        } */
                        );

                },
                //GOOGLE MAPS **********************************************************************************
                initMap: function (coordenates, promotorData) {

                    //console.log(promotorData);

                    if (coordenates && coordenates.latitud !== 0 && coordenates.longitud !== 0) {

                        // Map options
                        var options = {
                            zoom: 15,
                            center: { lat: coordenates.latitud, lng: coordenates.longitud }
                        }

                        // New map
                        var map = new google.maps.Map(document.getElementById('map'), options);

                        // OPT1 to prevent showing a gray map: 
                        // Wait for map's 'idle' state (i.e. when it's finished) to trigger event 'resize' on the map                        
                        google.maps.event.addListenerOnce(map, 'idle', function () {
                            var currentCenter = map.getCenter();
                            google.maps.event.trigger(map, 'resize');
                            map.setCenter(currentCenter);
                        }); 

                        // OPT2 to prevent showing a gray map: 
                        /* dispatch a 'resize' event for the window
                        setTimeout(function () {
                            window.dispatchEvent(new Event("resize"));
                        }, 1);
                        */

                        // Listen for click on map and put a marker (I DON'T NEED THIS! )
                        /*
                        google.maps.event.addListener(map, 'click', function(event){
                            addMarker({coords:event.latLng}); // Add marker
                        }); */

                        // Array of markers ---------------
                        var markers = [
                            {
                                coords: { lat: coordenates.latitud, lng: coordenates.longitud },
                                content: `<h3>Promotor: ${promotorData.nombrep}</h3>
                                    <p>  email: ${promotorData.emailp}  </p> 
                                    <p>  calle: ${promotorData.direcp.callep}</p>
                                    <p>  localidad: ${promotorData.direcp.pueblo} 
                                        (${promotorData.direcp.codpostal})
                                    </p> 
                                    <p>  provincia: ${promotorData.direcp.provincia}</p> 
                                    `
                            }
                        ];

                        // Loop through markers -------------
                        for (var i = 0; i < markers.length; i++) {
                            // Add marker
                            addMarker(markers[i]);
                        }

                        // Add Marker Function ---------------
                        function addMarker(props) {

                            var marker = new google.maps.Marker({
                                position: props.coords,
                                map: map,
                            });

                            // Check for custom icon
                            if (props.iconImage) {
                                marker.setIcon(props.iconImage); // Set icon image
                            }

                            // Check for content
                            if (props.content) {

                                var infoWindow = new google.maps.InfoWindow({
                                    content: props.content
                                });

                                //listen for a click in the Google Map window
                                marker.addListener('click', function () {
                                    infoWindow.open(map, marker);
                                });
                            }
                        } // function addMarker

                    } //end IF

                }, //function initGoogleMap(){

                /*
                getMaps: function (address) {
                    //return $http.get(address); 

                    var geocoder = new google.maps.Geocoder();
                    var coordenadas = { 'latitud': 0.0, 'longitud': 0.0 };


                    geocoder.geocode({ 'address': address }, function (results, status) {

                        if (status == google.maps.GeocoderStatus.OK) {
                            console.log('Resultados en la fatoria de la función getMaps');
                            console.log(results[0].geometry);
                            var latitud = results[0].geometry.location.lat();
                            var longitud = results[0].geometry.location.lng();
                            coordenadas.latitud = results[0].geometry.location.lat();
                            coordenadas.longitud = results[0].geometry.location.lng();
                        }
                        else {
                            alert("Geocode was not successful for the following reason: " + status);
                        }
                    });
                },
                getGeocoder: function () {
                    return geocoder;
                },
                getCoordenadas: function () {
                    return coordenadas;
                },*/
            };
        }
    ])
    //Creamos una factoria (proporcionará una API en el front) para la autenticacion que comunica con la ruta del backend
    .factory('authFactory', ['$http', '$rootScope', '$location', '$q', "$route", 
        function ($http, $rootScope, $location, $q, $route) {

            var baseUrlForDevNode = "http://localhost:3000";  //la ruta base del servidor NODE donde correra el back-end
            var httpConfigObj = {withCredentials: true};

            return {
                saveUser: function (userData) {
                    return $http.post(baseUrlForDevNode + '/auth/signup', userData, httpConfigObj);
                },
                login: function (credentials) {
                    
                    //console.log("La ruta para el login con la app Node sera: ");
                    //console.log(baseUrlForDevNode + '/auth/login');
                    //Llama al servicio web REST del backend encargado de atender la ruta "/api/login"
                    return $http.post(baseUrlForDevNode + '/auth/login', credentials, httpConfigObj);
                },
                logout: function () {
                    return $http.get(baseUrlForDevNode + '/auth/logout', httpConfigObj); //Se llamara desde el punto de entrada "appback.js" ya que no tiene vista/controlador
                },                                     //asociado y debe poderse cerrar sesion desde cualquier punto de la app
                detailUser: function (username) {
                    return $http.get(baseUrlForDevNode + '/auth/users/' + username, httpConfigObj);
                },
                editUser: function (id, userData) {
                    return $http.put(baseUrlForDevNode + '/auth/users/' + id, userData, httpConfigObj);
                },
                getUsers: function () {
                    return $http.get(baseUrlForDevNode + '/auth/users', httpConfigObj);
                },
                deleteUser: function (id) {
                    return $http.delete(baseUrlForDevNode + '/auth/users/' + id, httpConfigObj);
                },
                renewPassword: function (data) {
                    return $http.post(baseUrlForDevNode + '/auth/newpassword', data, httpConfigObj);
                },
                isLoggedIn: function () {
                    return $http.get(baseUrlForDevNode + '/auth/sessionUsername', httpConfigObj);
                },
                //He inyectado el $rootscope y $location para poder usarlos desde la factoria
                //PROBLEMA: Aunque no permita ir a la ruta si que sigue haciendo peticion http y consultando datos
                /*
                checkPermissions: function () {
                    if ($rootScope.authenticated === true) {
                        console.log("User has permissions");
                    } else {
                        alert("You don't have access here! You must log in before");
                        $location.path('user/login');
                    }
                },
                checkUserRole: function () {
                        console.log("Entre en metodo checkUserRole");
                        console.log("current user: "  + $rootScope.current_user);
                        console.log("administrator: " + $rootScope.administrator);
                        console.log("authenticated: " + $rootScope.authenticated);

                    if ($rootScope.authenticated === true && 
                        $rootScope.administrator === true) {
                        console.log("User has permissions");
                    } else if ($rootScope.authenticated === true) {
                        alert("You don't have access here! Your user does NOT have admin privileges");
                        $location.path('/promotores');
                    } else {
                        alert("You don't have access here! You must log in with admin privileges");
                        $location.path('user/login');
                    }
                }, */
                checkAccess: function (){
                    // Create a deferred operation (this object contains the promise we'll return)
                    var deferred = $q.defer(); 

                    //Call 'resolve' on a deferred object to complete it successfully, 
                    //Call 'reject' to fail it with an error.
                    if ($rootScope.authenticated) {
                        //console.log("El usuario ha entrado en el sistema y puede consultar esta ruta");
                        deferred.resolve();
                    } else {
                        alert("¡No tienes permisos para acceder aquí! Antes debes entrar en el sistema");
                        deferred.reject();
                        $location.path('user/login');
                    }

                    return deferred.promise; //Return the promise
                },
                checkAccessWithUser: function (){
                    // Create a deferred operation (this object contains the promise we'll return)
                    var deferred = $q.defer(); 
                    //console.log("username en checkAccessWithUser" +  $route.current.params);

                    if (!$rootScope.authenticated) {
                        alert("¡No tienes permisos para acceder aquí! Antes debes entrar en el sistema");
                        deferred.reject();
                        $location.path('user/login');
                    } else if ($rootScope.current_user !== $route.current.params.username &&
                               $rootScope.current_user !== 'admin') {
                        alert("¡No tienes permisos para acceder a otro perfil de usuario! Le redirigimos al suyo");
                        deferred.reject();
                        $location.path('/user/' + $rootScope.current_user);
                    } else {
                        //console.log("El usuario ha accedido correctamente a los datos de su perfil");
                        deferred.resolve();
                    }

                    return deferred.promise;  //Return the promise
                },
                checkAccessWithRole: function (){
                    // Create a deferred operation (this object contains the promise we'll return)
                    var deferred = $q.defer(); 

                    if ($rootScope.authenticated && $rootScope.administrator) {
                        //console.log("El usuario ha entrado en el sistema y tiene permisos para consultar esta ruta");
                        deferred.resolve();
                    } else if ($rootScope.authenticated) {
                        alert("No tienes permisos para acceder aquí: son necesarios permisos de administrador");
                        deferred.reject();
                        $location.path('/');  //Evitar asi que en 2ª peticion a misma http salga de la app                       
                    } else {
                        alert("¡No tienes permisos para acceder aquí! Antes debes entrar en el sistema como administrador");
                        deferred.reject();
                        $location.path('user/login');
                    }

                    return deferred.promise; //Return the promise
                }
            };

        }
    ]);
