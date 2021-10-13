var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var socketio = require("socket.io");
var mimeTypes = { "html": "text/html", "jpeg": "image/jpeg", "jpg": "image/jpeg", "png": "image/png", "js": "text/javascript", "css": "text/css", "swf": "application/x-shockwave-flash"};

// Creacion del servicio 
var httpServer = http.createServer(
	
	// funcion que hace el servicio
	function(request, response) {
	
		
		var uri = url.parse(request.url).pathname;
		if (uri=="/") uri = "/connections.html";
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
			
			// en otro caso se responde con un error por parte del cliente
			else{
				console.log("Peticion invalida: "+uri);
				response.writeHead(200, {"Content-Type": "text/plain"});
				response.write('404 Not Found\n');
				response.end();
			}
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
io.sockets.on('connection',

	// definimos el comportamiento al recibir una conexion
	function(client) {
	
		// al vector de todos los clientes le aniadimos un nuevo usuario
		// que consiste en una tupla ip , por
		allClients.push({
			address:client.request.connection.remoteAddress, 
			port:client.request.connection.remotePort
		});
		
		// Notificar por pantalla (consola) que tenemos un nuevo cliente
		console.log('New connection from ' 
			+ client.request.connection.remoteAddress 
			+ ':' + 
			client.request.connection.remotePort);
		
		// emite a todas las conexiones, es decir, clientes
		// el vector allClientes, es decir, esta difundiendo
		// el vector a todos los clientes
		io.sockets.emit('all-connections', allClients);
		
		// Se define el comportamiento del client para el evento output-evt
		// en este caso se emite un mensaje a output-evt diciendo "hola cliente"
		client.on('output-evt', function () {
			client.emit('output-evt', 'Hola Cliente!');
		});
		
		// Definir comportamiento cuando se de el evento disconnect
		client.on('disconnect', function() {
			
			// informar por linea de comandos que se ha desconectado un cliente 
			console.log("El cliente "+ client.request.connection.remoteAddress +" se va a desconectar");
			
			// listar todos los clientes nuevamente
			console.log(allClients);

			// Se va a recorrer todo el vector de clientes buscando al cliente que
			// se desconectó, si se encuentra se guarda su indice en i
			var index = -1;
			for(var i = 0; i < allClients.length;i++){
				//console.log("Hay "+allClients[i].port);
				if(allClients[i].address == client.request.connection.remoteAddress
					&& allClients[i].port == client.request.connection.remotePort){
					index = i;
				}			
			}

			// si encontramos el indice, entonces
			if (index != -1) {
				// Elimina el elemento en indice
				// splice(a, b) elimina los b elementos 
				// posteriores a a incluyendo a como inicial
				allClients.splice(index, 1);
				io.sockets.emit('all-connections', allClients);
			}else{
				console.log("EL USUARIO NO SE HA ENCONTRADO!")
			}
			console.log('El usuario '+client.request.connection.remoteAddress+' se ha desconectado');
		});
	}
);

console.log("Servicio Socket.io iniciado");

