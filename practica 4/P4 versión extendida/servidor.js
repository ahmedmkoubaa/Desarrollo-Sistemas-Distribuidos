var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var socketio = require("socket.io");
var mimeTypes = { "html": "text/html", "jpeg": "image/jpeg", "jpg": "image/jpeg", "png": "image/png", "js": "text/javascript", "css": "text/css", "swf": "application/x-shockwave-flash"};

var MongoClient = require('mongodb').MongoClient;
var MongoServer = require('mongodb').Server;


let sensores = new Array();
sensores["luz"] = sensores["temperatura"] = sensores["humo"] = undefined;

// let sensores = ["luz", "temperatura", "humo"];

let actuadores = new Array();
actuadores["persiana"] = actuadores['aire_acondicionado'] = undefined;

function esSensorValido(sensor) {
	var encontrado = false;

	for (var tipo in sensores) {
		if (tipo === sensor)
			return (encontrado = true);
	}

	return encontrado;
}

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

        if (params.length >= 3) { // REST Request

          // guardo la accion con la que se inicia el mensaje y lo elimino
          // shift elimina la primera palabra y la devuelve
          var tipoMensaje = params.shift();

          // por ahora el unico tipo de mensaje que podemos recibir es
          // "sensores" en el futuro podrian ser mas y diferentes
          if (tipoMensaje == "modificar_sensores") {
            // Esperamos ahora un conjunto de pares formado
            // por un string y numero, el string hace referencia
            // a la metrica y el numero al valor

						var nuevosValores = [];

            // mientras nos queden al menos 2 parametros por ver
            while (params.length >= 2){
              var sensor = params.shift();
              var valor;


							// comprobar que los sensores que se quieren actualizar son correctos
              if (esSensorValido(sensor)) {
                valor = parseFloat(params.shift());

                // Comprobar que el valor devuelvo no es un Nan, de serlo el
                // mensaje no estaría bien y habría que notificarlo al remitente
                if (!Number.isNaN(valor)){
                  console.log("Actualizado sensor " + sensor);

									var nuevoValor = {tipo: sensor, valor: valor, time: new Date()};
									nuevosValores.push(nuevoValor);


                }
              } else {
								// Notificar que sensor no fue reconocido
								console.log("ERROR: sensor " + sensor + " no reconocido");
							}
            }

						collection_sensores.insertMany(nuevosValores, {safe:true}, function(err, result) {

							// si hubo algun error
							if (err)
								// notiifcamos error y eliminamos ultimo añadido
								console.log("No se ha podido añadir en la base de datos");

						});

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

var collection_telegram;

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


		 // Crear u obtener la coleccion de actuadores
		 dbo.createCollection("telegram", function(err, collection){
			 if (err) var collection = dbo.collection("telegram");

			 // guardar coleccion y añadir nuevo indice unico
			 collection_telegram = collection;
			 collection_telegram.createIndex({ idChat: 1 }, { unique:true });
		 });

		 console.log("Conexión base de datos --> success");
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


    // Definir comportamiento del cliente al recibir evento actualizar-sensores
    client.on('actualizar-sensores', async function(){

			var mediciones = [];

			for (sensor in sensores) {
				collection_sensores.find({tipo: sensor}).sort({time: -1}).limit(1).toArray(function(err, results){
					if (!err) {
						sensores[results[0].tipo] = results[0].valor;
						console.log("Este es el resultado " + JSON.stringify(results[0]));
						mediciones.push(results[0]);
					}

				})
			}


			console.log("Los sensores son " + JSON.stringify(sensores));


			// time out de 25 milliseconds para que esperemos a la consulta de arriba
			await new Promise(r => setTimeout(r, 25));
			console.log(mediciones);

			// Enviamos al cliente un mensaje con las mediciones
			client.emit('actualizar-sensores', mediciones);
    });

		// definir comportamiento del cliente al recibir evento actualizar actuadores
		client.on('actualizar-actuadores', function(){

			collection_actuadores.find().sort({_id: -1}).limit( Object.keys(actuadores).length ).toArray(function(err, results){

        // Si no hubo errores los envia al cliente
        if (!err) {
					client.emit('actualizar-actuadores', results);
					// actualizar variable de actuadores

					results.forEach((actuador, i) => {
						console.log(actuador);
						actuadores[actuador.tipo] = actuador.valor;
					});
				}
			});
		});


		// Definimos comportamiento ante el evento modificar actuadores
		// este eventos es generado cuando el cliente intenta cambiar el
		// valor de los actuadores. Lo que hacemos es insertar los Valores
		// obtenidos en la collection correspondiente (la de actuadores)
		client.on('modificar-actuadores', function( nuevosValores ){
			console.log("He recibido un modificar actuadores, me dispongo a ello");
			modificarActuadores(nuevosValores);
		});

		// Definimos el comportamiento ante el evento agente-alarma
		// Este evento es enviado por el agente cuando detecta una
		// situación de alarma, lo que nos manda es el nuevo valor
		// de los actuadores
		client.on('agente-alarma-temperatura', async function( nuevosActuadores ) {
			console.log("Hemos recibido alarma por temperatura");
			var mensaje = "Temperatura demasiado alta, subiendo persiana y encendiendo aire acondicionado";

			modificarActuadores( nuevosActuadores );
			broadcastTelegram(mensaje);
		});

		// comportamiento cuando recibimos evento agente-alarma-humo
		client.on('agente-alarma-humo', function() {
			console.log("Hemos recibido alarma por humo");
			var mensaje = "Humo detectado en casa!! FUEGO, FUEGO!! Llama al 112";

			broadcastTelegram(mensaje);
		});


});

// Difunde el mensaje pasado como parametro a todos los chats
function broadcastTelegram(mensaje){
	// Consultamos la coleccion para obtener todos los idChat
	collection_telegram.find({}).toArray(async function(err, results){
		if (!err) {

			// Recorremos el resultado
			results.forEach((chat, i) => {
				// console.log("Buscando usuarios");

				// Enviamos un mensaje al idChat notificando la alarma
				bot.sendMessage( chat.idChat, mensaje )
				.catch(error => console.log("Promise rejected"));
			});
		}
	});
}


// Modifica el ultimo valor de los actuadores
function modificarActuadores(nuevosValores) {
	collection_actuadores.insertMany(nuevosValores, function(err, result) {
		if (!err) {

			// hemos recibido un mensaje en donde teniamos que actualizar
			// los actuadores, entonces una vez hemos añadido a la base de datos dicho
			// valor de manera correcta, vamos a notificarlo a todos los clientes
			// que se encuentren suscritos a nuestro servicio
			console.log(nuevosValores);
			io.sockets.emit('actualizar-actuadores', nuevosValores);

			// actualizar variable de actuadores
			nuevosValores.forEach((actuador, i) => {
				console.log(actuador);
				actuadores[actuador.tipo] = parseFloat(actuador.valor);
			});

			console.log(actuadores);


		} else {
			console.log("Error: modificar actuadores");
		}
	});
}



console.log("Socket.IO iniciado --> success");


// Vamos a conectarnos con el bot de telegram de nuestro sistema
const TeleBot = require('telebot');
const token = '1876987021:AAFF4jsCxWbAZHw4BVaenNDCwvN-hLkp408';


// token es un identificador de bot que se nos
// da al crear un bot en telegram. Es secreto
// no se debería poner en el codigo dicho token,
// nosotros lo hacemos con fines didácticos
const bot = new TeleBot({ token: token });

// comportamiento cunado se arranca el bot
bot.on('start', () => {
	console.log("Conexión telegram bot --> success");
});

// comportamiento al recibir un mensaje desde el chat
bot.on('text', (msg) => {
	if (msg.text[0] != '/') {

		// Respondemos un mensaje amistoso cuando nos llega un mensaje que no es un comando
		bot.sendMessage(msg.from.id,
		 `Hola, ${ msg.from.first_name }! Estamos cuidando de tu casa, descansa :)`);
	}

});


bot.on("/registrarse" , (msg) => {
	console.log("Me ha llegado un mensaje nuevo de ");
	console.log(msg.from.id);

	// El id que obtenemos es de un chat, no de en usuario
	var idChat = msg.from.id;

	collection_telegram.insertOne({idChat: idChat}, {safe:true}, function(err, result) {

		// if (!err)
			msg.reply.text("Registro realizado exitosamente");
		// else
		// 	msg.reply.text("Ya te tengo registrado ;)");

	});
});




// comportamieto sobre el evento info, devuelve info del sistema
bot.on("/info" , (msg) => {
	msg.reply.text(
		"Hola! soy domobot, tu bot personal encargado de cuidar " +
		"de tu casa. Estoy continuamente revisando los sensores, " +
		"si algo se pone feo me encargo de solucionarlo y te lo notifico. " +
		"Mientres yo esté aquí puedes estar tranquilo ;)"
	);
});

const incremento_persiana = 5;
const incremento_aire_acondicionado = 3;

const max_persiana = 100;
const min_persiana = 0;

const max_aire_acondicionado = 33;
const min_aire_acondicionado = 12;


// comportamieto sobre el evento subir persiana
bot.on("/subir_persiana" , (msg) => {

	if (actuadores["persiana"] < max_persiana) {
		var valor_persiana = actuadores["persiana"] + incremento_persiana;
		if (valor_persiana > max_persiana) valor_persiana = max_persiana;

		var nuevosValores = [
			{tipo: "persiana", valor: valor_persiana }
		];

		modificarActuadores(nuevosValores);

		msg.reply.text("Hemos subido la persiana, ahora está al " + valor_persiana + "%");
	} else {
		msg.reply.text("La persiana está totalmente subida :)");
	}

});

// comportamieto sobre el evento bajar persiana
bot.on("/bajar_persiana" , (msg) => {

	if (actuadores["persiana"] > min_persiana) {
		var valor_persiana = actuadores["persiana"] - incremento_persiana;
		if (valor_persiana < min_persiana) valor_persiana = min_persiana;

		var nuevosValores = [
			{tipo: "persiana", valor: valor_persiana }
		];

		modificarActuadores(nuevosValores);

		msg.reply.text("Hemos bajado la persiana, ahora está al " + valor_persiana + "%");
	} else {
		msg.reply.text("La persiana está totalmente bajada :)");
	}

});

// comportamieto sobre el evento subir aire
bot.on("/subir_aire" , (msg) => {

	if (actuadores["aire_acondicionado"] < max_aire_acondicionado) {
		var valor_aire = actuadores["aire_acondicionado"] + incremento_aire_acondicionado;
		if (valor_aire > max_aire_acondicionado) valor_aire = max_aire_acondicionado;

		var nuevosValores = [
			{ tipo: "aire_acondicionado", valor: valor_aire }
		];

		modificarActuadores(nuevosValores);

		msg.reply.text("Hemos subido la temperatura del aire, ahora está a " + valor_aire + "ºC");
	} else {
		msg.reply.text("El aire acondicionado está a tope! :)");
	}

});

// comportamieto sobre el evento bajar aire
bot.on("/bajar_aire" , (msg) => {

	if (actuadores["aire_acondicionado"] > min_aire_acondicionado) {
		var valor_aire = actuadores["aire_acondicionado"] - incremento_aire_acondicionado;
		if (valor_aire < min_aire_acondicionado) valor_aire = min_aire_acondicionado;

		var nuevosValores = [
			{ tipo: "aire_acondicionado", valor: valor_aire }
		];

		modificarActuadores(nuevosValores);

		msg.reply.text("Hemos bajado la temperatura, el aire está a " + valor_aire + "ºC");
	} else {
		msg.reply.text("El aire está al mínmo!! :)");
	}

});



// comportamieto sobre el evento bajar aire
bot.on("/estado" , (msg) => {
	var mensaje =
		"Te haré un resumen, la luz está al " + sensores["luz"] + "% " +
		"en cuanto a la temperatura, tenemos unos " + sensores["temperatura"] +
		" ºC. ";

	if (sensores["humo"] == 0) mensaje += "El detector de humo no ha saltado y está todo bien";
	else mensaje += " El detector de humo ha saltado, HAY FUEGO!!";

	msg.reply.text(mensaje);
});

// arrancar el bot
bot.start();
