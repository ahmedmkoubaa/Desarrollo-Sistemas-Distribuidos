var nivelTemperatura = 0;
var nivelLuz = 0;

// funcion que muestra por pantalla una lista de sensores con sus
// tipos (lo que mide el sensor) y su valor (la intensidad que percibe)
function actualizarSensores(sensores){

  console.log("Iterando para actualizar sensores");

  for (var i = 0; i < sensores.length; i++)
    document.getElementById(sensores[i].tipo).innerHTML = sensores[i].valor;

    comprobarSensores();
}

function comprobarSensores(){
  var mensaje = "";
  mensaje += ("Comprobando sensores ...");

  nivelLuz = parseFloat(document.getElementById("luz").innerHTML);
  nivelTemperatura = parseFloat(document.getElementById("temperatura").innerHTML);
  humo = parseFloat(document.getElementById("humo").innerHTML);

  const maxLuz = 80;
  const maxTemperatura = 40;

  if (nivelLuz > maxLuz) mensaje += "<br>" + ("Luz no esta bien");
  else mensaje += "<br>" + ("Luz esta bien");

  if (nivelTemperatura > maxTemperatura) mensaje += "<br>" + ("Temperatura demasiado alta");
  else mensaje += "<br>" + ("Temperatura esta bien");

  if (nivelTemperatura >= maxTemperatura && nivelLuz >= maxLuz) {
    mensaje += "<br>" + ("ALARMA: demasiadas cosas estan mal");
    // debemos notificar al servidor que hubo alarma,
    // a continuacion modificar los valores de los actuadores
    // socket.emit('alarma');
    var nuevosValores = [
      {tipo: "persiana", valor: 12},
      {tipo: "aire_acondicionado", valor: 17}
    ];

    socket.emit('agente-alarma-temperatura', nuevosValores);
    mensaje += "<br>" + ("Hemos modificado los actuadores porque las condiciones lo requieren");
  }

  if (humo != 0 && !isNaN(humo)) {
    socket.emit('agente-alarma-humo');
    mensaje += "<br>" + ("FUEGO EN CASA!!");
  }

  document.getElementById("msg_agente").innerHTML = mensaje;
}

var nivelPersiana = 0;
var nivelAire = 0;

function actualizarActuadores(actuadores) {

  for (var i = 0; i < actuadores.length; i++)
    if (actuadores[i].tipo == "persiana") nivelPersiana = actuadores[i].valor;
    else if (actuadores[i].tipo == "aire_acondicionado") nivelAire = actuadores[i].valor;
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
  actualizarActuadores(data);
});

// Cuando recibimos una notificacion general debemos actualizarSensores
socket.on('notify-all', function(data){
  console.log("Estamos recibiendo una notificacion general");
  actualizarSensores(data);
});

// Cuando recibo disconnect muestro mensaje de desconexion
socket.on('disconnect', function() {
  console.log("Hasta luego lucas");
});
