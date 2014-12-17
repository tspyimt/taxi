'use strict';


angular.module('SudaTaxi')
    .factory('gmaps', ['$rootScope', '$timeout' , '$filter',
        function ($rootScope, $timeout, $filter) {
        	var gMaps = {
        		LatLng: null,
                lat: null,
                lng: null,
                map: null,
                lastPosition: null,
                currentPoint: null,
                geocoder: null,
                placeService: null,

                setLatLng: function (position) {
                    this.LatLng = new L.LatLng(position.coords.latitude, position.coords.longitude);
                    this.setLat(position);
                    this.setLng(position);
                },
                setLat: function (position) {
                    this.lat = position.coords.latitude;
                },
                setLng: function (position) {
                    this.lng = position.coords.longitude;
                },
                mapOptions: function () {
                    return {
                        zoom: 17,
                        disableDefaultUI: true,
                        styles: [
                            {
                                featureType: "poi", /*poi.business*/
                                elementType: "labels",
                                stylers: [
                                    {
                                        visibility: "off"
                                    }
                                ]
                            }
                        ]
                    };
                },
                init: function () {

                	var me = this;

                    gMaps.map = L.map('map').setView([21.029771, 105.801811], 15);

                    /*L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                     {    maxZoom: 18  }).addTo(gMaps.map);*/

                    L.tileLayer('http://{s}.tiles.mapbox.com/v3/taipham.i6k2o57c/{z}/{x}/{y}.png',
                        { maxZoom: 18  }).addTo(gMaps.map); // Link maps layer

                    gMaps.placeService = new google.maps.places.AutocompleteService();

                    // get current geolocation 

                    navigator.geolocation.getCurrentPosition(me.getPositionSuccess, me.getPositionError, {
                        enableHighAccuracy: true,
                        maximumAge: 5000
                    });
                },

                getPositionSuccess: function (position) {

                    gMaps.lastPosition = position;
                    gMaps.setLatLng(position);

                    gMaps.map.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));

                    gMaps.setCurrentPoint(new L.LatLng(position.coords.latitude, position.coords.longitude));

                    gMaps.map.on('move', function (){
                    	gMaps.setCurrentPoint(gMaps.map.getCenter());
                    })

                    gMaps.map.on('moveend', function (){
                    	// Get Address Info From LatLng
                        var GLatLng = new google.maps.LatLng(gMaps.map.getCenter().lat, gMaps.map.getCenter().lng);
                    	gMaps.geocoder.geocode({'latLng': GLatLng}, function (results, status) { 
	                        if (status === 'OK') {

                             	gMaps.currentPoint.bindPopup(results[0].formatted_address).openPopup()
	                        }
                    	});
                    })

                    gMaps.geocoder = new google.maps.Geocoder();

                    /*gMaps.infoBox = new google.maps.InfoWindow();*/

                },
                getPositionError: function (error) {
                    console.log('Load map:', error);
                },
                setCurrentPoint: function (position) {
                    var me = this;

                    if (me.currentPoint) {
                        me.map.removeLayer(me.currentPoint);
                    }

                    me.currentPoint = L.marker(position, {
                        /*icon: L.icon({
                            iconUrl: './images/me.png',
                            iconSize: [40, 62]
                        })*/
                    }).addTo(me.map);

                    me.currentPoint.on('click', function () { // Bắt sự kiện của người dùng trên bản đồ
                        me.map.panTo(me.currentPoint.getLatLng());
                    });

                },
                getDirectionByGeoCode: function (start, address, cb) {
                    var me = this;
                    
                    me.geocoder.geocode({address: address}, function (results, status) {

                        if (status == google.maps.GeocoderStatus.OK) {
                            me.directionsService = new google.maps.DirectionsService();
                            //me.map.panTo(results[0].geometry.location);

                            

                            var request = {
                                origin: start, // Start Position
                                destination: address, // END Position
                                travelMode: google.maps.TravelMode.DRIVING, // Phương tiện : đi bộ , oto , xe bus....
                                unitSystem: google.maps.UnitSystem.METRIC
                            };

                            me.directionsService.route(request, function (result, status) {
                                
                                if (status == google.maps.DirectionsStatus.OK) {

                                    var routes = result.routes[0]; // Contain all property about direction read more : https://developers.google.com/maps/documentation/javascript/referenceDirectionsResult
                                    me.directionInfo = routes;

                                    
                                    $rootScope.infoRouter = 'Ước lượng: ' + routes.legs[0].distance.text + ' - ' + $filter('toCurrency')(Math.round(routes.legs[0].distance.value / 1000) * 12000) + ' VNĐ';
                                    console.log($rootScope.infoRouter);
                                    

                                    
                                    var point, route, points = [];

                                    var decodePath = google.maps.geometry.encoding.decodePath(result.routes[0].overview_polyline);


                                    for (var i = 0; i < decodePath.length; i++) { // Generate route on map
                                        if (decodePath[i]) {
                                            point = new L.LatLng(decodePath[i].lat(), decodePath[i].lng());
                                            points.push(point);

                                            if (i == 0) { // Create new marker at Start Point
                                                if (gMaps.startPointMarker) {
                                                    gMaps.map.removeLayer(gMaps.startPointMarker);
                                                }

                                                gMaps.startPointMarker = L.marker(new L.LatLng(decodePath[i].lat(), decodePath[i].lng()), {
                                                    riseOnHover: true,
                                                    alt: 'Điểm đi',
                                                    /*icon: L.icon({
                                                        iconUrl: './images/pin_blue.png',
                                                        iconSize: [48, 48],
                                                        popupAnchor: [0, -20]
                                                    })*/
                                                }).addTo(me.map).bindPopup('Điểm đi :' + routes.legs[0].start_address);

                                                gMaps.map.panTo(new L.LatLng(decodePath[i].lat(), decodePath[i].lng()));
                                            }

                                            if (i == decodePath.length - 1) { // Create new marker at end point

                                                if (gMaps.endPointMarker) {
                                                    gMaps.map.removeLayer(gMaps.endPointMarker);
                                                }

                                                gMaps.endPointMarker = L.marker(new L.LatLng(decodePath[i].lat(), decodePath[i].lng()), {
                                                    riseOnHover: true,
                                                    alt: 'Điểm đi',
                                                    /*icon: L.icon({
                                                        iconUrl: './images/pinIconPink.png',
                                                        iconSize: [48, 48],
                                                        popupAnchor: [0, -20]
                                                    })*/
                                                }).addTo(me.map).bindPopup('Điểm đến :' + routes.legs[0].end_address);
                                            }
                                        }
                                    }

                                    if (me.RoutePolyline) {
                                        me.map.removeLayer(me.RoutePolyline);
                                    }

                                    me.RoutePolyline = new L.Polyline(points, {
                                        weight: 3,
                                        opacity: 0.5,
                                        smoothFactor: 1
                                    }).addTo(gMaps.map);

                                    me.RoutePolyline.bringToFront();


                                   

                                    /*$rootScope.$apply(function () {

                                        if (Math.round(routes.legs[0].distance.value / 1000) * 12000 > 0) {

                                            $rootScope.distanceCheck = routes.legs[0].distance.value;
                                            if (!$rootScope.status.hasRouter) {
                                                $rootScope.pageTitleCalu = 'Ước lượng: ' + routes.legs[0].distance.text + ' - ' + $filter('toCurrency')(Math.round(routes.legs[0].distance.value / 1000) * 12000) + ' VNĐ';
                                            }

                                            $rootScope.stepDirection = routes.legs[0].steps;
                                        } else {
                                        }
                                    });*/

                                    /*(cb && angular.isFunction(cb)) ? cb(null, routes) : null;*/
                                }

                            });

                        } else {
                            (cb && angular.isFunction(cb)) ? cb(status, null) : null;

                            alert('Geocode was not successful for the following reason: ' + status);
                        }
                    })
                }




        	}// End gMaps Service

        	return gMaps;
        }])
