var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var socketio = require("socket.io");

var MongoClient = require('mongodb').MongoClient;
var MongoServer = require('mongodb').Server;

var mimeTypes = { "html": "text/html", "jpeg": "image/jpeg", "jpg": "image/jpeg", "png": "image/png", "js": "text/javascript", "css": "text/css", "swf": "application/x-shockwave-flash"};


// Creacion del servicio
var httpServer = http.createServer(

	// funcion que hace el servicio
	function(request, response) {
    // Pagina que se cargara por defecto
    const DEFAULT = "panel.html";

		// Obtener url a partir de /
		var uri = url.parse(request.url).pathname;
    console.log("Esta es la uri en cuestion " + uri);

    // si nos encontramos con una uri vacia, entonces cargamos opcion por defecto
    if (uri == "/") uri = DEFAULT;
    else {
      while (uri.indexOf('/') == 0) {uri = uri.slice(1); console.log(uri);}
      var uri = uri.toLowerCase();

      // quitamos la extension si la tuviese
      var indiceExtension = uri.indexOf('.');
      if (indiceExtension > 0) uri.substr(0, indiceExtension);

      if (uri == "sensores"){
        uri = "/sensores.html";
      }
      else if (uri == "panel"){
        uri = "/panel.html";
      } else if (uri == "agente"){
				uri = "/agente.html";
			}
    }

		var fname = path.join(process.cwd(), uri);
		// ver si existe el fichero
		fs.exists(fname, function(exists) {

			// si el fichero existe, se lee y se responde su contenido
			if (exists) {
				fs.readFile(fname, function(err, data){
					if (!err) {
						var extension = path.extname(fname).split(".")[1];
						var mimeType = mimeTypes[extension];
						response.writeHead(200, mimeType);
						response.write(data);
						response.end();
					}
					else {
						// si el fichero no se pudo leer correctamente
						response.writeHead(500, {"Content-Type": "text/plain"});
						response.write('Error de lectura en el fichero: '+uri);
						response.end();
					}
				});
			}

			// En este caso no existe el fichero que hemos intentado abrir, por lo
      // que podría tratarse de una peticion de los sensores
			else{
        // extraer url justo despues de "/"
        while (uri.indexOf('/') == 0) uri = uri.slice(1);

        // obtener vector con las cadenas separadas por /
        var params = uri.split("/");

        if (params.length >= 3) { //REST Request

          // guardo la accion con la que se inicia el mensaje y lo elimino
          // shift elimina la primera palabra y la devuelve
          var tipoMensaje = params.shift();

          // por ahora el unico tipo de mensaje que podemos recibir es
          // "sensores" en el futuro podrian ser mas y diferentes
          if (tipoMensaje == "actualizar_sensores") {
            // Esperamos ahora un conjunto de pares formado
            // por un string y numero, el string hace referencia
            // a la metrica y el numero al valor

						var nuevosValores = [];

            // mientras nos queden al menos 2 parametros por ver
            while (params.length >= 2){
              var sensor = params.shift();
              var valor;


              if (sensor == "luz" || sensor == "temperatura") {
                valor = parseFloat(params.shift());

                // Comprobar que el valor devuelvo no es un Nan, de serlo el
                // mensaje no estaría bien y habría que notificarlo al remitente
                if (!Number.isNaN(valor)){
                  console.log("Actualizado sensor " + sensor);

									var nuevoValor = {tipo: sensor, valor: valor, time: new Date()};
									nuevosValores.push(nuevoValor);

                  collection_sensores.insertOne(nuevoValor, {safe:true}, function(err, result) {

										// si hubo algun error
										if (err) {

											// notiifcamos error y eliminamos ultimo añadido
											console.log("No se ha podido añadir en la base de datos");
											nuevosValores.pop();
										}
                  });
                }
              }


              // Para mas tarde hacer el numero de sensores interactivo
              // listaSensores = [];
              // listaSensores.push({nombre: "luz", valor: null});
              // listaSensores.push({nombre: "temperatura", valor: null});
              //
              // var encontrado = false;
              // for (var i = 0; i < this.sensores.length && !encontrado; i++) {
              //   if (sensor == listaSensores[i].nombre) encontrado = true;
              // }
            }

						// pase lo que pase notificamos a todos los clientes los nuevos valores
						io.sockets.emit('notify-all', nuevosValores);

            // comproboar que todos los argumentos pasados fueron usados correctamente
            // si no fue asi se notiia que algunos faltaron
            if (params.length > 0) {
              response.writeHead(400, {"Content-Type": "text/html"});
              response.write("Algunos parametros no eran correctos <" + params[0] + ">");
              response.end();
            }
            else {

              // en otro caso todo fue correcto
              response.writeHead(200, {"Content-Type": "text/html"});
              response.write("Valores de sensores recibidos y actualizados correctamente");
              response.end();
            }


          }
          else {
            console.log("peticion invalida: " + uri);
            response.writeHead(404, {"Content-Type": "text/html"});
            response.write('No se reconocio la accion\n');
            response.end();
          }


        }
        else {
          console.log("Peticion invalida: "+uri);
          response.writeHead(200, {"Content-Type": "text/plain"});
          response.write('404 Not Found\n');
          response.end();
        }
			}
		});
	}
);



// Aqui se encuentra la parte relacionada con la base de datos
var collection_sensores;
var collection_actuadores;

MongoClient.connect("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true },

	// funcion que se ejecutara al hacer la conexion
	function(err, db) {


		// No tengo claro si es una creacion de base de datos o si
		// solamente consiste en usar la base de datos indicada
		var dbo = db.db("domohouse_bd");

		// se crea una coleccion en la base de datos especificada
		dbo.createCollection("sensores", function(err, collection){

  		// si obtenemos algun error al crear la coleccion
  		// es que ya estaba creada, entonces pdoemos obtenerla
  		if (err) var collection = dbo.collection("sensores");
      collection_sensores = collection;

		});

		 // Crear u obtener la coleccion de actuadores
		 dbo.createCollection("actuadores", function(err, collection){
			 if (err) var collection = dbo.collection("actuadores");
			 collection_actuadores = collection;
		 });
	}
);

httpServer.listen(8080);
var io = socketio(httpServer);

var allClients = new Array();

// connection: cuando se realiza una conexion al socket
// en nuestro caso el socket escucha al servicio httpServer
// por lo que este evento se emitirá cuando algun cliente
// se conecte a nuestro servicio http (puerto 8080)
io.on('connection',

	// definimos el comportamiento al recibir una conexion
	function(client) {

		// Notificar por pantalla (consola) que tenemos un nuevo cliente
		console.log('Nueva conexion entrante '
			+ client.request.connection.remoteAddress
			+ ':' +
			client.request.connection.remotePort);


    // definir comportamiento del cliente al recibir evento actualizar-sensores
    client.on('actualizar-sensores', function(){

      // consulta la coleccion para buscar los ultimos sensores
      collection_sensores.find().sort({_id: -1}).limit(2).toArray(function(err, results){

        // Si no hubo errores los envia al cliente
        if (!err) client.emit('actualizar-sensores', results);
      });
    });

		// definir comportamiento del cliente al recibir evento actualizar actuadores
		client.on('actualizar-actuadores', function(){

			console.log("Hemos recibido actualizar actuadores, vamos a consultar bd");

			collection_actuadores.find().sort({_id: -1}).limit(2).toArray(function(err, results){

        // Si no hubo errores los envia al cliente
        if (!err) client.emit('actualizar-actuadores', results);
				console.log(results);
			});
		});

		// defino comportamiento ante el evento aniadir actuadores
		// este eventos es generado cuando el cliente intenta cambiar el
		// valor de los actuadores. Lo que hacemos es insertar los Valores
		// obtenidos en la collection correspondiente (la de actuadores)
		client.on('modificar-actuadores', function(nuevoValor){
			console.log("He recibido un actualizar actuadores, me dispongo a ello");

			collection_actuadores.insertMany(nuevoValor, function(err, result) {
				if (!err) {
					console.log("datos añadidos correctamente");

					// hemos recibido un mensaje en donde teniamos que actualizar
					// los actuadores, entonces una vez hemos añadido a la base de datos dicho
					// valor de manera correcta, vamos a notificarlo a todos los clientes
					// que se encuentren suscritos a nuestro servicio
					// esto deberia ser un notify all
					console.log(nuevoValor);
					io.sockets.emit('modificar-actuadores', nuevoValor);
				} else {
					console.log("Algo ha falldo no se pudo añadir nada");
				}
			});
		});

});


// Definir comportamiento al recibir un evento actualizar-actuadores
// Vamos a almacenar en la base de datos dicho valor y a propagarlo a todos los posbles clientes
// io.on('actualizar-actuadores', function(data){
// 	console.log("He recibido un actualizar actuadores, me dispongo a ello");
// 	console.log(data);
//
// 	collection_actuadores.insertOne(nuevoValor, {safe:true}, function(err, result) {
// 		if (!err) {
// 			console.log("datos añadidos correctamente");
//
// 			// hemos recibido un mensaje en donde teniamos que actualizar
// 			// los actuadores, entonces una vez hemos añadido a la base de datos dicho
// 			// valor de manera correcta, vamos a notificarlo a todos los clientes
// 			// que se encuentren suscritos a nuestro servicio
// 			io.sockets.emit('actualizar-actuadores', result);
// 		}
//
// 	});
// });


console.log("Servicio Socket.io iniciado");
