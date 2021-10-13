let ipinfo = {};
let weather = {};

// para comenzar una simulacion de la tempratura
let simulacion = false;

// Hace una llamada a una api para obtener las coordenadas
// geográficas mediante la IP. Luego consulta otra api de tiempo
// meteorologico para ver la predicción del tiempo
async function obtenerTemperatura() {

  // llamada a api para obtener nuestra ip (y más informacion geografica)
  requestIP();

  // usamos timeout porque la peticion a la api podría retrasarse
  // bastante con 3 segundos es más que de sobra para la api
  await new Promise(r => setTimeout(r, 3000));

  // LLamada a otra api para que nos de la prediccion de nuestra zona
  requestWeather();

  console.log("Hemos obtenido el clima");
}

async function requestIP(){
  // Hacemos peticion a una api externa para obtener informacion
  // sobre nuestra ip, entre otros datos, longitud, latitud, codigo postal
  // con estos datos haremos peticiones a otras APIs
  var url ="https://freegeoip.app/json/";

  // creo una nueva peticion http
  var httpRequest = new XMLHttpRequest();

  // Definimos la funcion que lanzar cuando cambie el estado
  // de la peticion que hemos definido
  httpRequest.onreadystatechange = function() {

    // Cuando el estado de la peticion sea HECHOs
      if (httpRequest.readyState === XMLHttpRequest.DONE){

          // Le asignamos el valor de respuesta al elemento "resul"
          ipinfo = JSON.parse(httpRequest.responseText);
        }
    };

   // Definimos datos de la peticion, GET, una URL a la
   // que hacer la peticion y asincrono a true
   // Este true indica que la peticion es asincrona por lo que no hay que esperar conexion simultanea
  httpRequest.open("GET", url, true);

  // Mandamos la peticion e indicamos que el body es null (al ser un get es null)
  httpRequest.send(null);
}

function submit() {
  // var form = document.getElementById('form');
  document.forms["myform"].submit();
  // document.myform.submit();
  // form.submit();

  console.log("Se me ha llamado desde la submit funcion");
}

function requestWeather() {

  var url =
        "https://www.7timer.info/bin/astro.php?lon="
        + ipinfo.longitude
        + "&lat=" + ipinfo.latitude
        + "&ac=0&unit=metric&output=json";

  console.log(url);

  // creo una nueva peticion http
  var httpRequest = new XMLHttpRequest();


   // Definimos datos de la peticion, GET, una URL a la
   // que hacer la peticion y asincrono a true
   // Este true indica que la peticion es asincrona por lo que no hay que esperar conexion simultanea
  httpRequest.open("GET", url, true);

  // Mandamos la peticion e indicamos que el body es null (al ser un get es null)
  httpRequest.send(null);

  // Definimos la funcion que lanzar cuando cambie el estado
  // de la peticion que hemos definido
  httpRequest.onreadystatechange = function() {

    // Cuando el estado de la peticion sea HECHOs
      if (httpRequest.readyState === XMLHttpRequest.DONE){

          // Le asignamos el valor de respuesta al elemento "resul"
          weather = JSON.parse(httpRequest.responseText);

          // una vez obtenido el clima
          simularClima();

        }
  };

  return weather;
}

async function simularClima() {

  // invierto la simulacion, es decir, si me vuelven a llamar
  // la simulacion estara desactivada si antes estaba activada
  // y viceversa
  simulacion = !simulacion;


  // calcular intervalo de espera en millisencods
  const millisecondsPorSegundo = 1000;
  const segundos = 1 * millisecondsPorSegundo;
  const minuto = 60 * segundos;

  const intervalo = 2 * minuto;

  var resul = document.getElementById("resul");
  var elementoTemperatura = document.getElementById("temperatura");

  resul.innerHTML = "Simulacion desactivada";

  while (simulacion) {

    console.log("Despertando, vamos a trabajar");

    // 7timer.info nos devuelve un conjunto de dataseries
    // cada dataseries cubre la prediccion del tiempo de
    // una franja horaria concreta, el primer dataseries
    // se corresponde con la franja horaria actual, es
    // decir, nuestra hora, por eso indicamos el 1 como indice
    var franja  = 1;

    // nos qudamos con las mediciones de nuestra franja horaria actual
    var temperatura = JSON.stringify(weather.dataseries[franja].temp2m);

    // representar el dato en pantalla
    resul.innerHTML = "Simulacion activa: " + temperatura +  " ºC";
    elementoTemperatura.value = temperatura;

    // enviar al servidor
    enviar();

    // Dormir hasta la siguiente medición
    await new Promise(r => setTimeout(r, intervalo));
  }
}
