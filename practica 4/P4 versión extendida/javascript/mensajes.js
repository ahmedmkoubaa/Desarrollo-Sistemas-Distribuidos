function actualizarMensajes() {
  actualizarMensajeLuz();
  actualizarMensajetemperatura();
  actualizarMensajeHumo();
}

function actualizarMensajeHumo() {
  var humo = document.getElementById("humo");
  var valorHumo = humo.innerHTML;
  var valorHumo = parseFloat(valorHumo);
  var mensaje = "";

  if (valorHumo != 0) {
    humo.src = "imgs/fire.png";
    mensaje = "FUEGO EN CASA!! LLAMANDO AL 112";
  } else {
    humo.src = "imgs/ok.png";
    mensaje = "Todo en orden, puedes estar tranquilo :)";
  }

  document.getElementById("msg_humo").innerHTML = mensaje;
}

function actualizarMensajeLuz() {
  var nivelLuz = document.getElementById("luz").innerHTML;
  var nivelLuz = parseFloat(nivelLuz);
  var mensaje = "";

  if (nivelLuz < 30) {
    if (nivelLuz < 20) {
      mensaje = "Está bastante oscuro ahora mismo, deberíamos ir abriendo las ventanas";
    } else {
      mensaje = "Hay buena luz ahora mismo :)";
    }
  } else {
    if (nivelLuz > 50) {
      if (nivelLuz > 90 ) mensaje = "Hay demsiado luz, baja las persianas!!";
      else mensaje = "Hay buena luz, te recomiendo que salgas a dar un paseo :) ";
    } else {
      mensaje = "Hay luz suficiente como para que disfrutes leyendo aquí :)";
    }
  }

  document.getElementById("msg_luz").innerHTML = mensaje;
}


function actualizarMensajetemperatura() {
  var niveltemperatura = document.getElementById("temperatura").innerHTML;
  var niveltemperatura = parseFloat(niveltemperatura);
  var mensaje = "";

  if (niveltemperatura < 20) {
    if (niveltemperatura < 10) {
      mensaje = "Hace bastante frío, te recomiendo que actives la calefacción";
    } else {
      mensaje = "Se está fresquito ahora mismo :)";
    }
  } else {
    if (niveltemperatura > 30) {
      if (niveltemperatura > 40) mensaje = "La temperatura es demasiado elevada!!";
      else mensaje = "Hace un calorcillo rico, te recomiendo que pongas el aire  :)";
    } else {
      mensaje = "Se está muy bien ahora mismo";
    }
  }

  document.getElementById("msg_temperatura").innerHTML = mensaje;
}
