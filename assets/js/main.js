function initMap() {
    var map = new google.maps.Map(document.getElementById("map"),{
        zoom: 10,
        center: {lat: -33.4724728, lng: -70.9100251},
        mapTypeControl: false,
        zoomControl: false,
        streetViewControl:false
    });

    var inputOrigen = document.getElementById('origen');
    var autocompleteOrigen = new google.maps.places.Autocomplete(inputOrigen);
    autocompleteOrigen.bindTo('bounds', map);
    var detalleUbicacionOrigen = new google.maps.InfoWindow();
    var markerOrigen = crearMarcador();

    crearListener(autocompleteOrigen, detalleUbicacionOrigen, markerOrigen);

    var inputDestino = document.getElementById('destino');
    var autocompleteDestino = new google.maps.places.Autocomplete(inputDestino);
    autocompleteDestino.bindTo('bounds', map);
    var detalleUbicacionDestino = new google.maps.InfoWindow();
    var markerDestino = crearMarcador();

    crearListener(autocompleteDestino, detalleUbicacionDestino, markerDestino);

    /* Mi ubicación actual */
    window.onload = function() {
       buscarMiUbicacion();
    };
    /* Ruta */
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    document.getElementById("ruta").addEventListener("click", function(){dibujarRuta(directionsService, directionsDisplay)});

    directionsDisplay.setMap(map);

    function crearListener(autocomplete, detalleUbicacion, marker) {
        autocomplete.addListener('place_changed', function() {
            detalleUbicacion.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            marcarUbicacion(place, detalleUbicacion, marker);
        });
    }

    function buscarMiUbicacion() {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(marcarUbicacionAutomatica,funcionError);
        }
    }

    var funcionError = function(error) {
        alert("Tenemos un problema para encontrar tu ubicación");
    }

    var marcarUbicacionAutomatica = function(posicion) {
        var latitud,longitud;
        latitud = posicion.coords.latitude;
        longitud = posicion.coords.longitude;

        markerOrigen.setPosition(new google.maps.LatLng(latitud,longitud));
        map.setCenter({lat:latitud,lng:longitud});
        map.setZoom(17);

        //inputOrigen.value = new google.maps.LatLng(latitud,longitud); //CON ESTO LOGRO QUE EN EL INPUT ORIGEN SALGA LAS COORDENADAS DE MI UBICACION

        markerOrigen.setVisible(true);

        detalleUbicacionOrigen.setContent('<div><strong>Mi ubicación actual</strong><br>');
        detalleUbicacionOrigen.open(map, markerOrigen);
    }

    var marcarUbicacion = function(place, detalleUbicacion, marker) {
        if (!place.geometry) {
            // Error si no encuentra el lugar indicado
            window.alert("No encontramos el lugar que indicaste: '" + place.name + "'");
            return;
        }
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        detalleUbicacion.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        detalleUbicacion.open(map, marker);
    }

    function crearMarcador() {
        var icono = {
            url: 'http://icons.iconarchive.com/icons/sonya/swarm/128/Bike-icon.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        };

        var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            icon: icono,
            anchorPoint: new google.maps.Point(0, -29)
        });

        return marker;
    }

    function dibujarRuta(directionsService, directionsDisplay) {
        var origin = document.getElementById("origen").value;
        var destination = document.getElementById('destino').value;

        if(destination != "" && destination != "") {
            directionsService.route({
                origin: origin,
                destination: destination,
                travelMode: "DRIVING"
            },
            function(response, status) {
                if (status === "OK") {
                    directionsDisplay.setDirections(response);
                } else {
                    funcionErrorRuta();
                }
            });
        }
    }

    function funcionErrorRuta() {
        alert("No ingresaste un origen y un destino validos");
    }

}