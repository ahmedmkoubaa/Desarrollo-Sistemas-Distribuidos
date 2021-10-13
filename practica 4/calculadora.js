var http = require("http");
var url = require("url");

// funcion que se encarga del computo
function calcular(operacion, val1, val2) {
	if (operacion=="sumar") return val1+val2;
	else if (operacion == "restar") return val1-val2;
	else if (operacion == "producto") return val1*val2;
	else if (operacion == "dividir") return val1/val2;
	else return "Error: Par&aacute;metros no v&aacute;lidos";
}

// creando un servicio o servidor (HTTP), como se le quiera llamar 
var httpServer = http.createServer(

	function(request, response) {
		var uri = url.parse(request.url).pathname;		// Extrae de la url un string posterior al dominio
		var output = "";
		
		// lo que hace slice es recortar la cadena que comienza en 1 hasta el final
		// lo que hacemos en este bucle,es quitar los "/" iniciales
		while (uri.indexOf('/') == 0) {uri = uri.slice(1); console.log(uri);} 
		
		// devuelve un vector con aquellas cadenas que se encuentren
		// entre el simbolo indicado (por ejemplo "/")
		var params = uri.split("/");
		
		
		console.log(params);
		
		// si tenemos más argumentos de los que queremos
		if (params.length >= 3) {
			// pasamos strings a doubles, es decir, extraemos el tipo de dato que nos interese
			var val1 = parseFloat(params[1]);
			var val2 = parseFloat(params[2]);
			
			// invocamos la funcion calcular con los parametros adecuados
			var result = calcular(params[0], val1, val2);
			
			// le pasamos una cadena a la salida
			output = result.toString();
		}
		else output = "Error: El n&uacute;mero de par&aacute;metros no es v&aacute;lido";
		
		// Escribir la cabecera de la respuesta http
		response.writeHead(200, {"Content-Type": "text/html"});
		
		// escribir el cuerpo de la respuesta, o sea el texto
		response.write(output);
		
		// finalizar la respuest
		response.end();
	}

);

// Escuchamos en el puerto indicado
httpServer.listen(8080);

// Notificamos correcto inicio de servicio
console.log("Servicio HTTP iniciado");






























