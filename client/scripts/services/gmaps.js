'use strict';


angular.module('SudaTaxi')
    .factory('gmaps', ['$rootScope', '$timeout' ,
        function ($rootScope, $timeout) {
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
                    console.log('getPositionSuccess', 'success', true);

                    gMaps.lastPosition = position;
                    gMaps.setLatLng(position);

                    gMaps.map.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));

                    gMaps.setCurrentPoint(new L.LatLng(position.coords.latitude, position.coords.longitude));

                    gMaps.map.on('move', function (){
                    	gMaps.setCurrentPoint(gMaps.map.getCenter());
                    })

                    gMaps.map.on('moveend', function (){
                    	// Get Address Info From LatLng
                    	gMaps.geocoder.geocode({'latLng': gMaps.map.getCenter()}, function (results, status) { 
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
                        icon: L.icon({
                            iconUrl: './images/me.png',
                            iconSize: [40, 62]
                        })
                    }).addTo(me.map);

                    me.currentPoint.on('click', function () { // Bắt sự kiện của người dùng trên bản đồ
                        me.map.panTo(me.currentPoint.getLatLng());
                    });

                },




        	}// End gMaps Service

        	return gMaps;
        }])
