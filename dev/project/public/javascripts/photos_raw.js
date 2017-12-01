console.log('here');
var $ = require('jQuery');
$(document).ready(function(){

	var $overlay = $('<div id = "overlay"></div>');	//overlay will be used for galleries
	$("#maingallery").append($overlay);		//appended to the 'maingallery' section i.e. body of index.html
	var $xButton = $('<span class="xbutton">x</span>'); //xbutton for top right corner of overlay





	//2d array holds the cities of photos (where markers are on map) + their info (cover photo + root of their gallery)
	//6th element of each city's array holds the root of its photo gallery
	var cities = [

		['Amsterdam', 52.3747158,4.8986166, 5, "https://s3.amazonaws.com/europe.photos/AMSTERDAM/AMSTERDAM6.JPG", "amsterdam_gallery"],
		//['Arcos', 36.7515369,-5.8080383, 6, "https://s3.amazonaws.com/europe.photos/ARCOS/ARCOS4.JPG", "arcos_gallery"],
		['Axpe', 43.1159537,-2.5985256, 7, "https://s3.amazonaws.com/europe.photos/AXPE/AXPE4.JPG", "axpe_gallery"],
		['Barcelona', 41.39479,2.1487679, 8, "https://s3.amazonaws.com/europe.photos/BARCELONA/BARCELONA3.JPG", "barcelona_gallery"],
		['Berlin', 52.5075419,13.4261419, 20, "https://s3.amazonaws.com/europe.photos/BERLIN/BERLIN7.JPG", "berlin_gallery"],
		//['Carmona', 37.4711885,-5.6475426, 9, "https://s3.amazonaws.com/europe.photos/CARMONA/CARMONA10.JPG", "carmona_gallery"],
		['Córdoba', 37.891586,-4.784485, 10, "https://s3.amazonaws.com/europe.photos/CORDOBA/CORDOBA8.JPG", "cordoba_gallery"],
		['Gijon', 43.5314284,-5.6684545, 11, "https://s3.amazonaws.com/europe.photos/GIJON/GIJON5.JPG", "gijon_gallery"],
		['Granada', 37.1809462,-3.5922032, 12, "https://s3.amazonaws.com/europe.photos/GRANADA/GRANADA6.JPG", "granada_gallery"],
		['Istanbul', 41.0053215,29.0121795, 13, "https://s3.amazonaws.com/europe.photos/ISTANBUL/ISTANBUL10.JPG", "istanbul_gallery"],
		//['Jerez & Arcos', 36.6876057,-6.1229853, 14, "https://s3.amazonaws.com/europe.photos/JEREZ/JEREZ4.JPG", "jerez_gallery"],
		['Lisbon', 38.7436266,-9.1602037, 15, "https://s3.amazonaws.com/europe.photos/LISBON/LISBON6.JPG", "lisbon_gallery"],
		['Madrid', 40.4378271,-3.6795367, 16, "https://s3.amazonaws.com/europe.photos/MADRID/MADRID5.JPG", "madrid_gallery"],
		['Mallorca', 39.6134979,2.911652, 17, "https://s3.amazonaws.com/europe.photos/MALLORCA/MALLORCA8.JPG", "mallorca_gallery"],
		['Marrakesh', 31.6342561,-8.0072952, 4, "https://s3.amazonaws.com/europe.photos/MOROCCO/MOROCCO9.JPG", "morocco_gallery"],
		['Paris', 48.8588589,2.3470599, 2, "https://s3.amazonaws.com/europe.photos/PARIS/PARIS12.JPG", "paris_gallery"],
		['Ronda', 36.7406348,-5.1581592, 18, "https://s3.amazonaws.com/europe.photos/RONDA/RONDA8.JPG", "ronda_gallery"],
		['Rome', 41.8769022,12.4812781, 3, "https://s3.amazonaws.com/europe.photos/ROME/ROME8.JPG", "rome_gallery"],
		['San Sebastián', 43.3072927,-1.973883, 19, "https://s3.amazonaws.com/europe.photos/SANSEBASTIAN/SANSEBASTIAN4.JPG", "sansebastian_gallery"],
		['Sevilla & more', 37.3876812,-5.9787046, 1, "https://s3.amazonaws.com/europe.photos/SEVILLA/SEVILLA41.JPG", "sevilla_gallery"],


	]

	//initializes the info window (specific info will be placed later, once a certain marker is clicked)
	var infowindow = new google.maps.InfoWindow({
		content : '',
		maxWidth: 200
	});


	//function that initializes map + calls setMarkers to place markers
	function initialize() {

		//stylizes map
		var styles =
		[
		  {
		    "featureType": "landscape",
		    "stylers": [
		      { "lightness": -51 },
		      { "saturation": -53 },
		      { "hue": "#005eff" }
		    ]
		  },{
		    "featureType": "administrative",
		    "elementType": "geometry",
		    "stylers": [
		      { "lightness": -35 }
		    ]
		  },{
		    "featureType": "poi",
		    "stylers": [
		      { "hue": "#ffbb00" },
		      { "visibility": "off" }
		    ]
		  },{
		    "featureType": "water",
		    "stylers": [
		      { "saturation": -60 },
		      { "lightness": -1 },
		      { "hue": "#00ff88" }
		    ]
		  },
		  {
		    "featureType": "road.arterial",
		    "stylers": [
		      { "visibility": "off" }
		    ]
		  },
		  {
		    "featureType": "road",
		    "elementType": "geometry",
		    "stylers": [
		      { "lightness": -3 },
		      { "saturation": -70 }
		    ]
		  },{
		    "featureType": "road",
		    "elementType": "labels",
		    "stylers": [
		      { "saturation": -52 }
		    ]
		  }
		]

		var styledMap = new google.maps.StyledMapType(styles,
    		{name: "Styled Map"});

		var mapOptions = {	//sets up initial map view
				center: new google.maps.LatLng(40.75, 11.3),
				zoom: 4,
				panControl: false,
				zoomControl: false,
				mapTypeControl: false,
				streetViewControl: false,
				overviewMapControl: false,
				mapTypeControlOptions: {
      				mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    			}
		};

		var map = new google.maps.Map(document.getElementById("map"),
			mapOptions);	//establishes map in 'map' div

		map.mapTypes.set('map_style', styledMap);
  		map.setMapTypeId('map_style');

		setMarkers(map, cities);	//function that creates markers + info windows

	}


	//functions sets up markers + info windows + galleries on the cities held in cities array
	function setMarkers(map, locations){
		var markerImage = {
			url: 'https://s3.amazonaws.com/europe.photos/orangeflag.png',
		}

		var markerShape = {
			coords: [16, 1, 16, 20, 30, 20, 30 , 1],
			type: 'poly'
		};

		$.get('/markers', function (response){
			debugger;
		});

		for (var i = 0; i < locations.length; i++) {	//goes through all the cities
		    var city = locations[i];	//current city array held in 'city' variable
		    var myLatLng = new google.maps.LatLng(city[1], city[2]);
		    var marker = new google.maps.Marker({	//establishes marker w/ info provided by array
		        position: myLatLng,
		        animation: google.maps.Animation.DROP,
		        icon: markerImage,
		        shape: markerShape,
		        image: city[4],
		        gallery: city[5],
		        map: map,
		        title: city[0],
		        zIndex: city[3],
		   	});


		    //event listener for when user clicks on the marker just built--fills the info window with content
		    //corresponding to that city
			google.maps.event.addListener(marker, 'click', function() {
				if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
					infowindow.setContent("<a id=\"infowindowlink\" href=\"" + this.gallery + "\">" + this.title + "</a>");

				}
				else{
				infowindow.setContent("<a id=\"infowindowlink\" href=\"" + this.gallery + "\"> <img src=\""+ this.image + "\" alt=\" \" >" + this.title + "</a>");
				}

				infowindow.open (map, this);


				//event listener for once the info window is loaded--prevents the default action of the
				//anchor in the infowindow and instead loads the gallery html into the overlay
				google.maps.event.addListenerOnce(infowindow, 'domready', function () {
					console.log("outside");
					$("a").click(function(event){
						event.preventDefault();
						var url = "galleries/" + $(this).attr('href');



						//puts gallery html into the overlay divide, and shows the overlay
						$.get(url, function (response){
							console.log(infowindow.content);
							$overlay.append($xButton);
							$overlay.append(response);
							$overlay.show();
							$overlay.animate({scrollTop:0},0);


							$overlay.click(function(event){		//closes + clears overlay when it is clicked
								$overlay.empty();
								$overlay.hide();

							});

							$(document).keydown(function(e){
								if (e.which == 27){
									$overlay.empty();
									$overlay.hide();
								}
							});

						}, "html");
					});
				});

			});

		}
	}

	google.maps.event.addDomListener(window, 'load', initialize);

});
