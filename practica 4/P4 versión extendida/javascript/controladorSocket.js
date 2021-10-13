// funcion que muestra por pantalla una lista de sensores con sus
// tipos (lo que mide el sensor) y su valor (la intensidad que percibe)
function actualizarSensores(sensores){
  for (var i = 0; i < sensores.length; i++)
    document.getElementById(sensores[i].tipo).innerHTML = sensores[i].valor;
}

function enviar(){
  var persiana = document.getElementById("val1").value;
  var aire 		 = document.getElementById("val2").value;

  var nuevosValores = [
    {tipo: "persiana", 					 valor: persiana},
    {tipo: "aire_acondicionado", valor:aire}
  ];

  console.log("Vamos a envair un mensaje al socket");
  console.log(nuevosValores);

  socket.emit('modificar-actuadores', nuevosValores);
}

 // ESTA ES LA PARTE DE SOCKET.IO visto desde el cliente

// obtener nuestra URL
var serviceURL = document.URL;

// formar url correcta para conectarnos a nuestro servidor
// para ello debemos extraer el protocolo, la ip y el puerto

var urlParams = serviceURL.split('/');											// Obtener palabras separadas por /
serviceURL = urlParams[0] + "//" + urlParams[2] + "/";			// formar direccion con protocolo, ip, port, etc

var socket = io.connect(serviceURL);

// DEFINIR COMPORTAMIENTOS AL DETECTAR EVENTOS DE SOCKET

// Cuando recibo un connect, entonces actualizo todos mis datos
socket.on('connect', function(){
  socket.emit('actualizar-sensores');
  socket.emit('actualizar-actuadores');
});



// cuando recibimps actualizarSensores actualizamo nuestra lista de sensores
socket.on('actualizar-sensores', function(data){
  actualizarSensores(data);
});

socket.on('actualizar-actuadores', function (data) {
  console.log("Hemos recbido actualizar actuadores");
  console.log(data);
  actualizarSensores(data);
});

socket.on('modificar-actuadores', function(data){
  actualizarSensores(data);
  console.log("Recibido mensaje de añadir nuevos valores actuadores");
});

// Cuando recibimos una notificacion general debemos actualizarSensores
socket.on('notify-all', function(data){
  actualizarSensores(data);
});

// Cuando recibo disconnect muestro mensaje de desconexion
socket.on('disconnect', function() {
  console.log("Hasta luego lucas");
});
