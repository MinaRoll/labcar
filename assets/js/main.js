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

var funcionExito = function(posicion){
  latitud = posicion.coords.latitude;
  longitud = posicion.coords.longitude;
   var image = 'http://www.adktrailmap.com/webmap/images/biking.png';
  var miUbicacion = new google.maps.Marker({
    position: {lat: latitud, lng: longitud},
    animacion: google.maps.Animation.DROP,
    map: map,
    icon: image
  });
  map.setZoom(17);
  map.setCenter({lat: latitud, lng: longitud});  
}
var funcionError = function(error){
  alert("tenemos problemas para encontrar ubicación");
}
  var map = new google.maps.Map(document.getElementById('map'), {
    mapTypeControl: false,
    center: {lat: -33.5191427, lng: -71.0349046},
    zoom: 6
  });

  new AutocompleteDirectionsHandler(map);

}

/* Constructor */
function AutocompleteDirectionsHandler(map) {
  this.map = map;
  this.originPlaceId = null;
  this.destinationPlaceId = null;
  this.travelMode = 'CAMINANDO';
  var originInput = document.getElementById('origen-input');
  var destinationInput = document.getElementById('destino-input');
  var modeSelector = document.getElementById('modo-seleccion');
  this.directionsService = new google.maps.DirectionsService;
  this.directionsDisplay = new google.maps.DirectionsRenderer;
  this.directionsDisplay.setMap(map);

  var originAutocomplete = new google.maps.places.Autocomplete(
      originInput, {placeIdOnly: true});
  var destinationAutocomplete = new google.maps.places.Autocomplete(
      destinationInput, {placeIdOnly: true});

  this.setupClickListener('buscar-caminando', 'CAMINANDO');
  this.setupClickListener('buscar-transporte', 'TRANSPORTE');
  this.setupClickListener('buscar-conduciendo', 'CONDUCIENDO');

  this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
  this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
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
      window.alert("Please select an option from the dropdown list.");
      return;
    }
    if (mode === 'ORIG') {
      me.originPlaceId = place.place_id;
    } else {
      me.destinationPlaceId = place.place_id;
    }
    me.route();
  });

};


AutocompleteDirectionsHandler.prototype.route = function() {
  if (!this.originPlaceId || !this.destinationPlaceId) {
    return;
  }
  var me = this;
     
  this.directionsService.route({
    origin: {'placeId': this.originPlaceId},
    destination: {'placeId': this.destinationPlaceId},
    travelMode: this.travelMode
  }, function(response, status) {
    if (status === 'OK') {
      document.getElementById("ruta").addEventListener("click", function(){
      me.directionsDisplay.setDirections(response);
      });
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });

  
};