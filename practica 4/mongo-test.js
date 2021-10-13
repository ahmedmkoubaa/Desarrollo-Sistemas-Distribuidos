var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var socketio = require("socket.io");

var MongoClient = require('mongodb').MongoClient;
var MongoServer = require('mongodb').Server;

var mimeTypes = { "html": "text/html", "jpeg": "image/jpeg", "jpg": "image/jpeg", "png": "image/png", "js": "text/javascript", "css": "text/css", "swf": "application/x-shockwave-flash"};

var httpServer = http.createServer(
	function(request, response) {
		var uri = url.parse(request.url).pathname;
		if (uri=="/") uri = "/mongo-test.html";
		var fname = path.join(process.cwd(), uri);
		fs.exists(fname, function(exists) {
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
						response.writeHead(200, {"Content-Type": "text/plain"});
						response.write('Error de lectura en el fichero: '+uri);
						response.end();
					}
				});
			}
			else{
				console.log("Peticion invalida: "+uri);
				response.writeHead(200, {"Content-Type": "text/plain"});
				response.write('404 Not Found\n');
				response.end();
			}
		});
	}
);

// Esto es lo nuevo y lo que nos interesa

MongoClient.connect("mongodb://localhost:27017/", 

	// funcion que se ejecutara al hacer la conexion
	function(err, db) {
		// lanzar el servicio http
		httpServer.listen(8080);
		
		// crear el socket asociado
		var io = socketio(httpServer);

		// No tengo claro si es una creacion de base de datos o si 
		// solamente consiste en usar la base de datos indicada
		var dbo = db.db("bd1");
		
		// se crea una coleccion en la base de datos especificada
		dbo.createCollection("test", function(err, collectionCreada){
		
			if (err) var collection = dbo.collection("test");
			
			// definimos el comportamiento al recibir los socket un "connection"
		 	io.sockets.on('connection',
			 	
			 	// cuando se nos conecte un cliente
				function(client) {
				
					// cliente emitirá su direccion, tanto ip como puerto
					client.emit('my-address', {
						host:client.request.connection.remoteAddress, 
						port:client.request.connection.remotePort
					});
					
					// cliente añadirá informacion a la base 
					// de datos emitiendo el evento poner
					client.on('poner', function (data) {
						collection.insertOne(data, {safe:true}, function(err, result) {});
					});
					
					// cliente extrae informacion de la base 
					// de datos  emite para ello el metodo obtener
					client.on('obtener', function (data) {
					
						// Se hace una consulta en la base de datos
						collection.find(data).toArray(function(err, results){
							// se emite un evento obtener con los resultados
							client.emit('obtener', results);
						});
					});
				}
			);
		 });
	}
);

// notificar inicio del servicio
console.log("Servicio MongoDB iniciado");

