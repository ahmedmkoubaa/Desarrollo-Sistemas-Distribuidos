var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var mimeTypes = { "html": "text/html", "jpeg": "image/jpeg", "jpg": "image/jpeg", "png": "image/png", "js": "text/javascript", "css": "text/css", "swf": "application/x-shockwave-flash"};

function calcular(operacion, val1, val2) {
	if (operacion=="sumar") return val1+val2;
	else if (operacion == "restar") return val1-val2;
	else if (operacion == "producto") return val1*val2;
	else if (operacion == "dividir") return val1/val2;
	else return "Error: Par&aacute;metros no v&aacute;lidos";
}

// crear servicio
var httpServer = http.createServer(
	
	// le pasamos la funcion que hara el servicio
	function(request, response) {
	
		// conseguimos una URL en string
		var uri = url.parse(request.url).pathname;
		
		// modificamos la url para que se refiera a un fichero html
		if (uri=="/") uri = "/calc.html";
		
		// process.cwd() devuelve el nombre del directorio desde el que se ejecutó
		// este fichero, no donde reside el source, sino donde se ejecuto
		// __dirname si devuelve el nombre del fichero fuente, tal vez sería 
		// mejor usar eso, al menos en este caso
		var fname = path.join(process.cwd(), uri);
		
		console.log(fname);
		
		// vamos a ver si existe o no, este archivo que buscamos
		// para eso usamos el filesystem y le decimos el criterio que
		// queremos que use para ver si existe o no
		fs.exists(fname, 
			function(exists) {
			
				if (exists) {
					fs.readFile(fname, 
					
					function(err, data){
						if (!err) {
							var extension = path.extname(fname).split(".")[1];
							var mimeType = mimeTypes[extension];
							response.writeHead(200, mimeType);
							response.write(data);
							response.end();
						}
						else {
							response.writeHead(500, {"Content-Type": "text/plain"});
							response.write('Error de lectura en el fichero: '+uri);
							response.end();
						}
					});
				}
				else{
					while (uri.indexOf('/') == 0) uri = uri.slice(1);
					var params = uri.split("/");
					if (params.length >= 3) { //REST Request
						console.log("Peticion REST: "+uri);
						var val1 = parseFloat(params[1]);
						var val2 = parseFloat(params[2]);
						var result = calcular(params[0], val1, val2);
						response.writeHead(200, {"Content-Type": "text/html"});
						response.write(result.toString());
						response.end();
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


httpServer.listen(8080);
console.log("Servicio HTTP iniciado");
