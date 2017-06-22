// Función para agregar mapa
function initMap() {

    var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5,
    center: {lat: -9.1191427, lng: -77.0349046},
    mapTypeControl: false,
    zoomControl: false,
    streetViewControl: false
    });

    function buscar(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(funcionExito, funcionError);
        }
    }

    var latitud, longitud;

// Función para encontrar con éxito la localización
var funcionExito = function(posicion){
  latitud = posicion.coords.latitude;
  longitud = posicion.coords.longitude;
   var image = 'http://www.adktrailmap.com/webmap/images/marker-icon.png';
  var miUbicacion = new google.maps.Marker({
    position: {lat: latitud, lng: longitud},
    animacion: google.maps.Animation.DROP,
    map: map,
    icon: image
  });
  map.setZoom(17);
  map.setCenter({lat: latitud, lng: longitud});  
}

//Función de error (no encuentra la localización)
var funcionError = function(error){
  alert("tenemos problemas para encontrar ubicación");
}
  var map = new google.maps.Map(document.getElementById('map'), {
    mapTypeControl: false,
    center: {lat: -33.5191427, lng: -71.0349046},
    zoom: 6
  });

  new AutocompleteDirectionsHandler(map);

  buscar();

}

// Constructor
function AutocompleteDirectionsHandler(map) {
  this.map = map;
  this.origenPlaceId = null;
  this.destinoPlaceId = null;
  this.travelMode = 'CAMINANDO';
  var origenInput = document.getElementById('origen-input');
  var destinoInput = document.getElementById('destino-input');
  var modoSeleccion = document.getElementById('modo-seleccion');
  this.directionsService = new google.maps.DirectionsService;
  this.directionsDisplay = new google.maps.DirectionsRenderer;
  this.directionsDisplay.setMap(map);

  var origenAutocomplete = new google.maps.places.Autocomplete(
      origenInput, {placeIdOnly: true});
  var destinoAutocomplete = new google.maps.places.Autocomplete(
      destinoInput, {placeIdOnly: true});

  this.setupClickListener('changemode-caminando', 'CAMINANDO');
  this.setupClickListener('changemode-transporte', 'TRANSPORTE');
  this.setupClickListener('changemode-conduciendo', 'CONDUCIENDO');

  this.setupPlaceChangedListener(origenAutocomplete, 'ORIG');
  this.setupPlaceChangedListener(destinoAutocomplete, 'DEST');

  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modoSeleccion);
}

// Autocompletado
AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, mode) {
  var radioButton = document.getElementById(id);
  var me = this;
  radioButton.addEventListener('click', function() {
    me.travelMode = mode;
    me.route();
  });
};

AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
  var me = this;
  autocomplete.bindTo('bounds', this.map);
  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    if (!place.place_id) {
      window.alert("Por favor selecciona una opción");
      return;
    }
    if (mode === 'ORIG') {
      me.origenPlaceId = place.place_id;
    } else {
      me.destinoPlaceId = place.place_id;
    }
    me.route();
  });

};


AutocompleteDirectionsHandler.prototype.route = function() {
  if (!this.origenPlaceId || !this.destinoPlaceId) {
    return;
  }
  var me = this;
     
  this.directionsService.route({
    origen: {'placeId': this.origenPlaceId},
    destino: {'placeId': this.destinoPlaceId},
    travelMode: this.travelMode
  }, function(response, status) {
    if (status === 'OK') {
      document.getElementById("ruta").addEventListener("click", function(){
      me.directionsDisplay.setDirections(response);
      });
    } else {
      window.alert('Se ha producido un error ' + status);
    }
  });

  
};

