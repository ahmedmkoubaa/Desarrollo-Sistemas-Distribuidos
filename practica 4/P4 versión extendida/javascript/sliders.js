function actualizarSliders(){
  actualizarSliderAireAcondicionado();
  actualizarSliderPersiana();
}

function actualizarSliderPersiana(){
  var valor =  document.getElementById("persiana").innerHTML;
  document.getElementById("slider_persiana").value = valor;
}

function actualizarSliderAireAcondicionado(){
  var valor = document.getElementById("aire_acondicionado").innerHTML;
  document.getElementById("slider_aire_acondicionado").value = valor;
}
