'use strict';

/**
 * @ngdoc function
 * @name promotorApp.controller:PromotorDetailCtrl
 * @description
 * # PromotorDetailCtrl
 * Controller of the promotorApp
 */
angular.module('promotorApp')
	.controller('PromotorDetailCtrl', 
	  ['$scope', '$log', 'promotoresFactory', '$routeParams', '$location', 'provinciasDataSvc',
		function ($scope, $log, promotoresFactory, $routeParams, $location, provinciasDataSvc) {

			$scope.viewPromotor = true; //Vamos a usar "tabs" para la navegación
			$scope.viewMap = false;
			$scope.addressFilled = false;
			$scope.countClicks = 0;
			$scope.coordenadas = {};
			$scope.resultados = {};
			$scope.promotorDatos = {}; //Vaciamos el objeto movie del $scope
			$scope.promotorDatos._id = $routeParams.id;
			//console.log($scope.promotorDatos._id);
			//console.log(provinciasDataSvc.provincias);

			$scope.isError = false;
			$scope.errorMsg = {};

			//TRAER EL DETALLE
			promotoresFactory.detailPromotor($scope.promotorDatos._id).then(
				function (response) {
					$scope.promotorDatos = response.data;
					$log.info($scope.promotorDatos);

					if ($scope.promotorDatos.direcp && $scope.promotorDatos.direcp !== {}) {
						$scope.addressFilled = true; //Solo mostramos el boton mapa si hay dirección
					}
				},
				function (err) {
					$log.error(err);
				}
			); //promotoresFactory.detailPromotor


			//Cuando se pinche en el boton "Back" redirigimos al listado de promotores
			$scope.back = function () {
				$location.path('/promotores');
			};


			//COORDENADAS-- ---------------------------------------------------------*/
			// No necesito IFs pues NO mostrare boton si no hay datos en la direccion del promotor
			$scope.getCoordenadas = function () {

				/*
				if ($scope.promotorDatos.direcp && $scope.promotorDatos.direcp !== {}) {
				*/
				/* var address = '1600+Amphitheatre+Parkway,+Mountain+View,+CA'; */

				//.JOIN: prettiest way to concatenate String with potential null or undefined
				var addressArray = []; // create array 
				for (var prop in $scope.promotorDatos.direcp)
					addressArray.push($scope.promotorDatos.direcp[prop]);

				var address = addressArray.join(' '); //CONCAT elementos array sin contar 'undefined' o 'null'
				//alert(address);

				//OJO, es necesario hacer RETURN para que la promesa llegue a "iniciarMapaGoogle"
				return promotoresFactory.getLatitudLongitud(address); //devuelvo la promesa
				/*			} */
				/*
				else {
					//OJOOO!!! Mostrar una ventana informativa
					// PROBLEMA es que si entra por aqui a la funcion "iniciarMapaGoogle" no le llega promesa
					alert("Coordenadas no obtenidas al no haber direccion");
					
				}*/
			}

			//CARGAR MAPA GOOGLE ---------------------------------------------------------*/
			$scope.iniciarMapaGoogle = function () {

				$scope.getCoordenadas()
					.then(
					function (coordenadas) {
						$scope.viewMap = true;
						$scope.countClicks++;
						//alert("getCoordenadas, valores: " + coordenadas.latitud + ", " + coordenadas.longitud);
						promotoresFactory.initMap(coordenadas, $scope.promotorDatos);
					}
					/*	,
						function (err) {
								$scope.isError = true; 
								console.log("error al intentar mostrar mapa de Google. [promotor-detail.js]");  
								$scope.errorMsg.data = "Error al intentar mostrar mapa Google!!!";
						} */
					)
					.catch(
					function error(err) {
						$scope.isError = true;

						if (err.data === null)
							$scope.errorMsg.data = "Error al intentar mostrar mapa Google!!! La URL para conseguir coordenadas podría estar mal";
						else
							$scope.errorMsg.data = "Error al intentar mostrar mapa Google!!! Motivo: " + err.data.status +
								", Mensaje error: " + err.data.error_message;

						$log.error("error al intentar mostrar mapa de Google. [promotor-detail.js]");
					}
					);

			} //$scope.iniciarMapaGoogle

			/* ----------------------------------------------------------------------*/
			$scope.toggleMap = function () {
				$scope.viewMap = !($scope.viewMap);
			}

			/* ----------------------------------------------------------------------*/
			/*
			$scope.ocultarMapaGoogle = function () {
				$scope.viewMap = false;
			} */

			/* ----------------------------------------------------------------------*/
			/*
			$scope.mostrarMapa = function () {

				console.log('Dentro de MOSTRAR mapa');

				var geocoder = new google.maps.Geocoder();
				var address = $scope.promotorDatos.direcp.callep + "," + $scope.promotorDatos.direcp.pueblo;
				var latitud, longitud;

				//geocoder.geocode( {'address': address, 'key':AIzaSyAYPE5eUENmWQ4ci3EkbTBR3C1c45qb9tA}, function(results, status) {
				$scope.resultados =
					geocoder.geocode({ 'address': address }, function (results, status) {

						if (status == google.maps.GeocoderStatus.OK) {

							console.log('Resultados DENTRO de la función Geocode');
							console.log(results[0].geometry);
							$scope.coordenadas.latitud = results[0].geometry.location.lat();
							$scope.coordenadas.longitud = results[0].geometry.location.lng();

							//AQUI no dibuja nada (aunque las coordenadas las recupera OK)
							$scope.rutaImagen = "http://maps.google.com/maps/api/staticmap?sensor=false&center="
							+ $scope.coordenadas.latitud
							+ ","
							+ $scope.coordenadas.longitud
							+ "&zoom=4&size=300x400&markers=color:red|label:P|"
							+ $scope.coordenadas.latitud + "," + $scope.coordenadas.longitud; 
							return results;
						}

						else {
							alert("Geocode was not successful for the following reason: " + status);
							return results;
						}
					});

				console.log('Resultados FUERA de la función Geocode');
				console.log($scope.coordenadas);
				console.log($scope.resultados);
				latitud = $scope.resultados.location.lat();
				longitud = $scope.resultados.location.lng();
				console.log('latitud: ' + latitud);
				console.log('longitud: ' + longitud);


				//console.log(longitud);
				$scope.rutaImagen = "http://maps.google.com/maps/api/staticmap?sensor=false&center="
					+ latitud
					+ ","
					+ longitud
					+ "&zoom=4&size=300x400&markers=color:red|label:P|"
					+ latitud + "," + longitud;

			}; //mostrarMapa
			*/

		} //function ($scope, $log, promotoresFactory, $routeParams, $location)
	]);