'use strict';

/* Servico para guardar en LS las operativas de actualizacion sobre BD que no se han podido realizar
   Un para de cosas a recordar sobre el LS (local storage):
 * Los datos en LS siempre se almacenan como 'string' en formato clave, valor
 * El LS esta atado a un origen único, es decir, solo se puede acceder/modificar 
   datos en LS desde el dominio que fue creado
 * Cada navegador reserva un maximo de 5Mb para el LS (de cada dominio)
 * El guardado y recuperación de datos del LS ocurre de modo SINCRONO 
 * Cuellos de botella pueden producirse cuando usamos LS para guardar/consultar grandes cantidades de datos
*/ 
angular.module('promotorApp')
       .service('localStorageSvc', ['promotoresFactory', function(promotoresFactory){
        

          //var this = {}

          var prefijoApp  = 'obrasapp-';

          //Insertar en LS las operaciones que la app no puede realizar en BD
          //--------------------------------------------------------------------
          this.addPendingOper = function(oper, data){
            
            var timeStamp = Math.round(new Date().getTime());
            var key       = prefijoApp + oper + '-' + timeStamp;

            if(localStorage && data){
              //console.log('Entra en el IF de addPendingOper para LS');	
              //hacer stringify ya que en LS solo se puede guardar 'string'
              localStorage.setItem(key, JSON.stringify(data));	//mismo que hacer localStorage[key]=JSON.stringify;
            }			
          };

          //Eliminar una operacion pendiente del LS 
          //--------------------------------------------------------------------
          this.removePendingOper = function(key){
            if(localStorage){	
              localStorage.removeItem(key);
            }			
          };
          
          //Recuperar los operaciones pendientes de la LS
          //--------------------------------------------------------------------

          this.getAllPendingOper = function(){
            var pendingOper    = [];  //evitamos tener duplicados
            var prefixLength   = prefijoApp.length;
            //var patronBusqueda = prefijoApp + '\d+/';

            if(localStorage){	
              var i, key;

              for (i = 0; i < localStorage.length; i++){
                key = localStorage.key(i);

               // En la expression regular 
               // [a-z]{8} para decir que debería haber exactamente 8 caracteres en minuscula      
               // d+    para  evalúa que tenga 1..n  a continuación)
               // if (/obrasapp-[a-z]{8}-\d+/.test(key)){

                if (key.substring(0, prefixLength) === prefijoApp) {   
                  //Transformar el String a objeto con JSON.parse y añadirlo al array
                  var itemValue = JSON.parse(localStorage.getItem(key));
                  pendingOper.push(itemValue);
                }
              } //end for
            } //end if

            return pendingOper;
          };
          
          //--------------------------------------------------------------------
          // Ejecutar en BATCH los guardados sobre DB (cuando estemos online)
          // Para esta tarea creo deberia usar un "service worker" ya que hacerlo 
          // la localStorage trabaja de forma sincrona (bloquea)
          this.processPendingOper = function(){
            var pendingOper    = [];  //evitamos tener duplicados
            var prefixLength   = prefijoApp.length;
            //var patronBusqueda = prefijoApp + '\d+/';

            if(localStorage){	
              var i, key;

              for (i = 0; i < localStorage.length; i++){
                key = localStorage.key(i);

                if (key.substring(0, prefixLength) === prefijoApp) {   
                  //Transformar el String a objeto con JSON.parse y añadirlo al array
                  var itemValue = JSON.parse(localStorage.getItem(key));
                  //console.log(itemValue);
                   
                  //HACER LA FUNCION QUE CORRESPONDA en funcion de la operativa
                  //En todas las operativas si van bien debemos llamar a "this.removePendingOper"
                  var operativa = key.substring(prefixLength, prefixLength + 8);
                  //console.log("la operativa a tratar es " + operativa);

                  switch (operativa) {
                    case 'saveprom':
                      
                      break;	
                    case 'saveobra':
                      
                      break;	  					
                    case 'editprom':
                      //editpromotor(itemValue._id, itemValue, key);
         
                      break;
                    case 'editobra':
                    
                      break;
                    case 'deleprom':
                      
                      break;	
                    case 'deleobra':
                      
                      break;	

                    default:
                        console.log("Operativa incorrecta");
                  }
                }
              } //end for
            } //end if

            //return pendingOper;
          };


          //--------------------------------------------------------------------
          /* Funcion usa la factoria para comunicarse con el Back-end y editar un promoto 

          *  Solo lo he codificado para probar que el bucle en 'processPendingOper' puede ser ejecutado   
          *  y recorrer todos los registros en la LS para tratarlos asincronamente.
          *  Creo que esto no tiene mucho sentido ya que la LS se procesa de forma sincrona  (bloquea script)
          */
          
          var editpromotor = function(promId, promData, localStKey){

            //console.log("entra en editPromotor para procesar LocalStorage");

            promotoresFactory.editPromotor(promId, promData).then(
              function() {
                  //this.removePendingOper(localStKey) //si edicion ok -> borrar la operacion pendiente

                  localStorage.removeItem(localStKey);
                  //console.log('se ha editado el Promotor' + promId + ' correctamente desde el LS');
                   
              },
              function(err) {
                 console.log('error al editar Promotor ' + promId + ' en modo batch desde el LS');
              }
            );
          }

          //--------------------------------------------------------------------
          //return this
       }
  ]
);