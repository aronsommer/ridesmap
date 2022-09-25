

$(window).on('load', function(){
     if (Cookies.get('washere') == null) {
         $('#helloModal').modal('show');
         Cookies.set('washere', '1000');
     }
     $('#loader').hide();
     $('#loadertext').hide();
 });

// initialize the map
var map = L.map('map', {zoomControl: false, attribution: false}).setView([30, 0], 3);


var terrainMap = L.tileLayer.provider('Stamen.TerrainBackground',{
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 10}
);

var Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});

var baseMap = L.tileLayer.provider('Hydda.Base', {
       maxZoom: 16,
       detectRetina: true,
       attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var Esri_OceanBasemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
	maxZoom: 10
});

var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
});

var Stamen_Terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
});


var swisstopo_satellite_wms = L.tileLayer.wms('https://wms.geo.admin.ch/?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities', {
    format: 'image/png',
    layers: "ch.swisstopo.swissimage"
});

var swisstopo_pixmap_wms = L.tileLayer.wms('https://wms.geo.admin.ch/?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities', {
    format: 'image/png',
    layers: "ch.swisstopo.pixelkarte-farbe"
});

var swisstopo_pixmap_gray_wms = L.tileLayer.wms('https://wms.geo.admin.ch/?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities', {
    format: 'image/png',
    layers: "ch.swisstopo.pixelkarte-grau"
});

var baseMaps = {
	  'Esri': Esri_OceanBasemap,
    'Esri World Gray': Esri_WorldGrayCanvas,
    'Terrain': terrainMap,
    'Stamen Terrain': Stamen_Terrain,
    'Swisstopo Map (Switzerland)': swisstopo_pixmap_wms,
    'Swisstopo Map Gray (Switzerland)': swisstopo_pixmap_gray_wms,
    'Satellite (Swissimage, Switzerland)': swisstopo_satellite_wms,
    'OpenStreetMap': L.tileLayer.provider('OpenStreetMap.HOT', {
           maxZoom: 16,
           detectRetina: true
     })
};



Esri_OceanBasemap.addTo(map)
L.control.layers(baseMaps).addTo(map);
L.control.attribution({position: 'topleft'}).addTo(map);

// load a tile layer
/*
L.tileLayer.provider('Stamen.TerrainBackground',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
    maxZoom: 19,
    minZoom: 2
  }).addTo(map);
*/

/*
  var bounds = new L.LatLngBounds (
    new L.LatLng(30,-10),
    new L.LatLng(50,36));
  map.fitBounds(bounds);
*/

  map.createPane('imagebg');
  map.getPane('imagebg').style.zIndex = 50;

  // ...

  /*
  var printer = L.easyPrint({
        sizeModes: ['Current'],
        filename: 'ridesmap',
        exportOnly: true,
        hideControlContainer: true
  }).addTo(map);
  */

  function manualPrint () {
    var date = formatDate(new Date())
    printer.printMap('CurrentSize', 'ridesmap_'+date)
  }

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('');
}


    // Color for line according to activity type
    //     var colors = ['#fb9a99','#e31a1c','#a6cee3','#1f78b4','#b2df8a','#33a02c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99', '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3']

    function getColor(d) {
      return d == 'Run' ? '#'+new Values(color_per_type["Run"] ).shade(20).hex:
          d == 'Ride' ? '#'+new Values(color_per_type["Ride"] ).shade(20).hex:
          //d == 'Ride' ? '#'+new Values('#fb9a99').shade(60).hex
          d == 'Hike' ? '#'+new Values(color_per_type["Hike"] ).shade(20).hex:
          d == 'BackcountrySki' ? '#'+new Values(color_per_type["BackcountrySki"] ).shade(20).hex:
          d == 'Walk' ? '#'+new Values(color_per_type["Walk"] ).shade(20).hex:
          d == 'AlpineSki' ? '#'+new Values(color_per_type["AlpineSki"] ).shade(20).hex:
          d == 'Swim' ? '#'+new Values(color_per_type["Swim"] ).shade(20).hex:
          d == 'NordicSki' ? '#'+new Values(color_per_type["NordicSki"] ).shade(20).hex:
          d == 'Snowshoe' ? '#'+new Values(color_per_type["Snowshoe"] ).shade(20).hex:
          d == 'Kayaking' ? '#'+new Values(color_per_type["Kayaking"] ).shade(20).hex:
          d == 'Windsurf' ? '#'+new Values(color_per_type["Windsurf"] ).shade(20).hex:
          d == 'Workout' ? '#'+new Values(color_per_type["Workout"] ).shade(20).hex:
          d == 'Canoe' ? '#'+new Values(color_per_type["Canoe"] ).shade(20).hex:
          d == 'RockClimbing' ? '#'+new Values(color_per_type["RockClimbing"] ).shade(20).hex:
          d == 'InlineSkate' ? '#'+new Values(color_per_type["InlineSkate"] ).shade(20).hex:
          d == 'Kitesurf' ? '#'+new Values(color_per_type["Kitesurf"] ).shade(20).hex:
          d == 'Snowboard' ? '#'+new Values(color_per_type["Snowboard"] ).shade(20).hex:
          d == 'IceSkate' ? '#'+new Values(color_per_type["IceSkate"] ).shade(20).hex:
          d == 'StandUpPaddle' ? '#'+new Values(color_per_type["StandUpPaddle"] ).shade(20).hex:
          d == 'Crossfit' ? '#'+new Values(color_per_type["Crossfit"] ).shade(20).hex:
          d == 'E-BikeRide' ? '#'+new Values(color_per_type["E-BikeRide"] ).shade(20).hex:
          d == 'RollerSki' ? '#'+new Values(color_per_type["RollerSki"] ).shade(20).hex:
          d == 'Row' ? '#'+new Values(color_per_type["Row"] ).shade(20).hex:
          '#CCEDFF';
    }


    function styleLines(feature) {
        //console.log(feature.geometry.properties.type);
        return {
            color: '#e82610',
            //color: getColor(feature.geometry.properties.type),
            weight: 1.2,
            opacity: .7,
            lineJoin: 'round'
        };
    }

    function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }


    function getMinYear(data){
      let values  = data.map(function(v) {
        return new Date(v.properties.start_date).getFullYear();
      });
      var min = Math.min.apply( null, values );
      return min;
    }

    function getMaxYear(data){
      let values  = data.map(function(v) {
        return new Date(v.properties.start_date).getFullYear();
      });
      var min = Math.max.apply( null, values );
      return min;
    }

    function addLinesToMap(polylines, centerPoint, stdDev){
      $(".strava-button").hide();
      var lines = L.geoJSON(polylines,{
          style: styleLines,
          onEachFeature: function(feature, layer) {
              feature.properties.cur_color = start_color;
              feature.properties.cur_weight = 1.2; // replace with value from styleLines function
              feature.properties.cur_opacity = 0.7;
              layer.on('click', function(e) {
                  // Do whatever you want here, when the polygon is clicked.
                  var url = "https://www.strava.com/activities/"+feature.properties.activityID
                  //console.log(url);
                  window.open(url);
              });
              layer.on('mouseover', function(e) {
                  cur_opacity = e.target.feature.geometry.properties.cur_opacity;
                  if(cur_opacity != 0){
                      var yeartext = '';
                      if(feature.properties.start_date){
                        date = feature.properties.start_date;
                        dateobject = new Date(date);
                        if(Object.prototype.toString.call(dateobject) === '[object Date]'){
                          yeartext = dateobject.getFullYear();
                        }
                      }
                      var nametext = '';
                      if(feature.properties.name){
                        nametext = "<b>" +feature.properties.name+"</b> ("+yeartext+")<br>";
                      }
                      var elevationtext = '';
                      if(feature.properties.elevation_gain){
                        elevationtext = " | " + Math.round(feature.properties.elevation_gain)+" hm";
                      }
                      var citytext = '';
                      if(feature.properties.location_city){
                        citytext = " in " +feature.properties.location_city;
                      }
                      var current_line = e.target;
                      current_line.setStyle({
                          color: 'blue',
                          opacity: 0.9,
                          weight: 5
                      });
                      var rideinfo = nametext+" "+splitCamelCase(feature.properties.type) + citytext + " ("+Math.round(feature.properties.distance/1000)+" km"+elevationtext+")<br>Click to view on Strava"
                      //console.log(rideinfo);

                      var popup = L.popup()
                                 .setLatLng(e.latlng)
                                 .setContent(rideinfo)
                                 .openOn(map);
                  }
              });
              layer.on('mouseout', function(e) {
                  map.closePopup();
                  var current_line = e.target;
                  //console.log(e);
                  //var type = e.target.feature.geometry.properties.type;
                  var original_color = e.target.feature.geometry.properties.cur_color;
                  var original_weight = e.target.feature.geometry.properties.cur_weight;
                  var original_opacity = e.target.feature.geometry.properties.cur_opacity;
                  current_line.setStyle({
                      color: original_color,
                      weight: original_weight,
                      opacity: original_opacity
                  });
              });
          }
      }).addTo(map);
      $('#loader').hide();
      $('#loadertext').hide();
      $("#get-activities").removeClass('pulse');

      if(stdDev < 2.5){
        stdDev = stdDev * 1.6;
      }

      var zoom = Math.ceil((1/stdDev)*27);

      if(zoom > 11){
        zoom = 11;
      }

      //console.log(centerPoint);

      //map.fitBounds(lines.getBounds());
      setTimeout(function(){
        map.setView(centerPoint, zoom);
        //map.panTo(centerPoint);
        //map.setZoom(7);
      }, 500);

      return lines;

    }


    function getCenterLatLong(lines){
      var latSum = d3.nest()
        .rollup(function(v) { return d3.sum(v, function(d) { return d.properties.start_latitude; }); })
        .entries(lines);

      var lonSum = d3.nest()
          .rollup(function(v) { return d3.sum(v, function(d) { return d.properties.start_longitude; }); })
          .entries(lines);

      var numberActivities = Object.keys(lines).length;

      var centerLat = latSum/numberActivities;
      var centerLon = lonSum/numberActivities;

      return [centerLat, centerLon];
    }

    function standardDeviation(values){
        var avg = average(values);

        var squareDiffs = values.map(function(value){
          var diff = value - avg;
          var sqrDiff = diff * diff;
          return sqrDiff;
        });

        var avgSquareDiff = average(squareDiffs);

        var stdDev = Math.sqrt(avgSquareDiff);
        return stdDev;
      }

      function average(data){
          var sum = data.reduce(function(sum, value){
            return sum + value;
          }, 0);

          var avg = sum / data.length;
          return avg;
      }

    function prepareDataForChart(lines){
        // D3 nest data: SUm up per year and type
        var distance_per_year = d3.nest()
          .key(function(d) { return d.properties.type; })
          .key(function(d) { return new Date(d.properties.start_date).getFullYear(); })
          .rollup(function(v) { return d3.sum(v, function(d) { return Math.round(d.properties.distance/1000); }); })
          .entries(lines);
        //console.log(distance_per_year);

        var flatdata = []
        distance_per_year.forEach(function(type) {
          type.values.forEach(function(typeYears) {
            flatdata.push({
              type: type.key,
              year: typeYears.key,
              distance: typeYears.values
            });
          });
        });

        // Unique activity types
        var groups = Array.from(new Set(flatdata.map(({ type }) => type)));
        // Unique years with activites
        var years = Array.from(new Set(flatdata.map(({ year }) => year)));


        // make wide data with 0 where value is missing
        var activity_data_wide = years.map(function(d) {
          var item = {
            year:  d
          };
          groups.forEach(function(e) {
            var itemForGroup = flatdata.filter(function(f) {
              return f.type === e && f.year === d;
            });
            if (itemForGroup.length) {
              item[e] = Number(itemForGroup[0].distance);
            } else {
              item[e] = 0;
            }
          })
          return item;
        })

        var result = {activity_data_wide:activity_data_wide, data_long:flatdata, groups:groups, years:years};

        return result;
    } // end prepareDataForChart

    var maplines = ''

    // initialize years
    var min_year = 2000;
    var max_year = new Date().getFullYear();

    const polyLineButton = document.querySelector('.strava-button')

    // Strava Button clicked

    //$("#get-activities").hide();
    $(document).on('click','.strava-button',
      function () {
        $('#loader').show();
        $('#loadertext').show();
        $("#get-activities").removeClass('pulse');

        getStravaActivities(function (err, polylines) {
          if (err) {
            // Handle errors
            $("#error-message").html(err);
            $("#errorModal").modal('show');
            console.error(err);
            return;
          }

          // Print GeoJSON
          // document.querySelector('#strava-json').textContent = JSON.stringify(polylines, 4);

          lines = polylines;
          centerPoint = getCenterLatLong(lines);

          // Make year slider
          var min_year = getMinYear(lines);
          var max_year = getMaxYear(lines);

          $("#yearSlider").slider({
            min: min_year,
            max: max_year,
            range: true,
            tooltip: 'always',
            tooltip_split: true,
            value: [min_year, max_year]
          });
          $("#yearSlider").slider("relayout");
          $("#year1").html(min_year);
          $("#year2").html(max_year);

          // Standard Deviation of Latitudes
          var latitudes = [];
          $.each(lines, function(i, item) {
            console.log(item.properties.start_latitude);
            latitudes.push(item.properties.start_latitude);
          });
          var stdDevLat = standardDeviation(latitudes);

          //console.log(lines);

          // add the lines to the map
          maplines = addLinesToMap(lines, centerPoint, stdDevLat);


          // draw bar chart
          processedData = prepareDataForChart(lines);
          // sort
          processedData.activity_data_wide = processedData.activity_data_wide.sort(dynamicSort("year"));

          drawBarChart(processedData.activity_data_wide, processedData.groups);

          // switch activity type
          addActivityToggles(processedData.groups, "#activityToggles");

          // statistics
          makeTabularStats(processedData.data_long, lines);

        });
      },
    );

    function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            /* next line works with strings and numbers,
             * and you may want to customize it to your needs
             */
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    function makeTabularStats(longdata, data){

      var yearlyDistance = d3.nest()
        .key(function(d) { return d.year; })
        .rollup(function(v) { return d3.sum(v, function(d) { return d.distance }); })
        .entries(longdata);

        var yearlyActivities = d3.nest()
          .key(function(d) { return new Date(d.properties.start_date).getFullYear(); })
          .rollup(function(v) { return v.length })
          .entries(lines);

      var totalDistance = d3.nest()
        .rollup(function(v) { return d3.sum(v, function(d) { return d.distance }); })
        .entries(longdata);


      yearlyDistance.forEach(function(item, index){
          $("#yearlyDistance").append('<tr><td>'+item.key+'</td><td class="text-right">'+item.values+' km</td><td class="text-right">'+yearlyActivities[index].values+'</td></tr>');
      });

      $("#yearlyDistance").append('<tr class="table-success"><td>Total</td><td class="text-right">'+totalDistance+' km</td><td class="text-right">'+data.length+' </td></tr>');
    }

    // color changer
    var start_color = '#e82610';
    $(function() {
      $('#color-changer').change(function() {
        // $('#console-event').html('Toggle: ' + $(this).prop('checked'));

        setTimeout(function(){
          $("#linestyle-menu").addClass("show");
          $(".dropup").addClass("show");
        }, 10);


        // set fixed color
        if($(this).prop('checked')){
          $(".colorchooser").fadeIn();
          maplines.setStyle({color: start_color});
          maplines.eachLayer(function (layer) {
            layer.feature.geometry.properties.cur_color = start_color;
          });
        }
        // color by type
        if(!$(this).prop('checked')){
          $(".colorchooser").fadeOut();
          maplines.eachLayer(function (layer) {
            new_color = getColor(layer.feature.geometry.properties.type);
            layer.setStyle({color: new_color});
            layer.feature.geometry.properties.cur_color = new_color;
          });
        }
      })
    })



    $('#yearSlider').on('slide', function() {
        //console.log($('#yearSlider').slider("getValue"));
        setTimeout(function(){
          $("#displayOptions-menu").addClass("show");
          $(".dropup").addClass("show");
        }, 150);

        var year1 = $('#yearSlider').slider("getValue")[0];
        var year2 = $('#yearSlider').slider("getValue")[1];

        // console.log(year1 + " " + year2);

        maplines.eachLayer(function (layer) {
          if( new Date(layer.feature.geometry.properties.start_date).getFullYear() < year1
              || new Date(layer.feature.geometry.properties.start_date).getFullYear() > year2 ) {
            layer.setStyle({opacity: 0});
            layer.feature.geometry.properties.cur_opacity = 0;
          } else {
            layer.setStyle({opacity: 1});
            layer.feature.geometry.properties.cur_opacity = 1;
          }
        });

        $("#year1").text(year1);
        $("#year2").text(year2);

        if(year1 == year2){
          $("#year2").fadeOut();
          $("#yearBindeStrich").fadeOut();
        } else {
          $("#year2").fadeIn();
          $("#yearBindeStrich").fadeIn();
        }
    })

    $("#resetYears").on('click', function() {
      setTimeout(function(){
        $("#displayOptions-menu").addClass("show");
        $(".dropup").addClass("show");
      }, 3);

      $('#yearSlider').slider("refresh");
      $("#year1").text(min_year);
      $("#year2").text(max_year);

      $("#displayOptions-menu").addClass("show");
      $(".dropup").addClass("show");

      maplines.eachLayer(function (layer) {
          layer.setStyle({opacity: 1});
          layer.feature.geometry.properties.cur_opacity = 1;
      });
    })


    $(function() {
      $(document).on('input change', '#lineWidthSlider', function() {
          var linewidth = $('#lineWidthSlider').val();

          var width = parseInt(linewidth) / 10;

          maplines.eachLayer(function (layer) {
              layer.setStyle({weight: width});
              layer.feature.geometry.properties.cur_weight = width;
          });
      })
    })

    function addActivityToggles(types, destination){
      //build list spans
      types.forEach(function(value, index){
        if(index % 2 == 0){
          $(destination).append('<span class="dropdown-item" id="activityLine'+parseInt(index)+'"><span>');
        }
      });

      // build switches
      types.forEach(function(value, index){
        var line = 2 * Math.floor(index / 2);
        $('#activityLine'+line).append('<input type="checkbox" checked class="activityToggle" data-toggle="toggle" data-on="'+splitCamelCase(value)+'" data-off="'+splitCamelCase(value)+'" data-onstyle="success" data-offstyle="danger" data-size="mini" data-width="49%" value="'+value+'" data-activity-type="'+value+'" data-style="activitySwitch"  name="check'+value+'">');
      });
      $('.activityToggle').bootstrapToggle();
    }


    $(document).on('change','.activityToggle',function(){
      setTimeout(function(){
        $("#displayOptions-menu").addClass("show");
        $(".dropup").addClass("show");
      }, 20);

      var activityTypes = $(".activityToggle[data-activity-type]:checked").map(function() {
        return $(this).data('activity-type');
      }).get();

      maplines.eachLayer(function (layer) {
        if( activityTypes.includes(layer.feature.geometry.properties.type) ) {
          layer.setStyle({opacity: 1});
          layer.feature.geometry.properties.cur_opacity = 1;
        } else {
          layer.setStyle({opacity: 0});
          layer.feature.geometry.properties.cur_opacity = 0;
        }
      });
    });



    $("#inverseActivitySelection").on('click', function() {

      setTimeout(function(){
        $("#displayOptions-menu").addClass("show");
        $(".dropup").addClass("show");
      }, 3);

      $('.activityToggle').bootstrapToggle('toggle');
    })

    $("#linecolor").spectrum({
      color: "#e82610",
      replacerClassName: 'colorchooser',
      move: function(color){
            start_color = '#'+color.toHex();
            maplines.eachLayer(function (layer) {
              new_color = '#'+color.toHex();
              layer.setStyle({color: new_color});
              layer.feature.geometry.properties.cur_color = new_color;
            });
      }
    });
