var margin = {top: 20, right: 160, bottom: 35, left: 30};

var width = 760 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


/* Data in strings like it would be if imported from a csv */
// http://bl.ocks.org/mstanaland/6100713

function drawBarChart(data, types){

    var parse = d3.time.format("%Y").parse;

    // Transpose the data into layers
    var dataset = d3.layout.stack()(types.map(function(type) {
      return data.map(function(d) {
        return {x: parse(d.year), y: +d[type], type:type};
      });
    }));


    // Set x, y and colors
    var x = d3.scale.ordinal()
      .domain(dataset[0].map(function(d) { return d.x; }))
      .rangeRoundBands([10, width-10], 0.02);

    var y = d3.scale.linear()
      .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
      .range([height, 0]);

    //var colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3'];
    //var colors = ["#32964d", "#76dd78", "#334d37", "#34daea", "#366da5", "#83acf3", "#7771ff", "#724073", "#e775cc", "#432ab7", "#ef3df3", "#9d0d6c", "#b9cf84", "#768a60", "#f8cca6", "#744822", "#f79302", "#9f2114", "#f88d89", "#fd5917", "#ead624", "#34f50e"]


    var colors = ['#e31a1c','#ff7f00','#fb9a99','#a6cee3','#1f78b4','#b2df8a','#33a02c','#fdbf6f','#cab2d6','#6a3d9a','#ffff99', '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3']
    var color2 = [];

    colors.forEach(function(item, index){
      color2.push('#'+new Values(item).tint(50).hex);
    });

    colors = color2;
    //colors = shuffle(color2);


    colors = colors.slice(0, types.length);


    // Define and draw axes
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(5)
      .tickSize(-width, 0, 0)
      .tickFormat( function(d) { return d } );

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(d3.time.format("%Y"));

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);


    // Create groups for each series, rects for each segment
    var groups = svg.selectAll("g.cost")
      .data(dataset)
      .enter().append("g")
      .attr("class", "cost")
      .style("fill", function(d, i) {

        var type = 'unknown'
        if(typeof d[0] === 'undefined'){
          //console.log("unknown");
        } else {
          type = d[0].type;
        }

        return type == 'Run' ? '#'+new Values(color_per_type["Run"] ).tint(50).hex:
            type == 'Ride' ? '#'+new Values(color_per_type["Ride"] ).tint(50).hex:
            type == 'Hike' ? '#'+new Values(color_per_type["Hike"] ).tint(50).hex:
            type == 'BackcountrySki' ? '#'+new Values(color_per_type["BackcountrySki"] ).tint(50).hex:
            type == 'Walk' ? '#'+new Values(color_per_type["Walk"] ).tint(50).hex:
            type == 'AlpineSki' ? '#'+new Values(color_per_type["AlpineSki"] ).tint(50).hex:
            type == 'Swim' ? '#'+new Values(color_per_type["Swim"] ).tint(50).hex:
            type == 'NordicSki' ? '#'+new Values(color_per_type["NordicSki"] ).tint(50).hex:
            type == 'Snowshoe' ? '#'+new Values(color_per_type["Snowshoe"] ).tint(50).hex:
            type == 'Kayaking' ? '#'+new Values(color_per_type["Kayaking"] ).tint(50).hex:
            type == 'Windsurf' ? '#'+new Values(color_per_type["Windsurf"] ).tint(50).hex:
            type == 'Workout' ? '#'+new Values(color_per_type["Workout"] ).tint(50).hex:
            type == 'Canoe' ? '#'+new Values(color_per_type["Canoe"] ).tint(50).hex:
            type == 'RockClimbing' ? '#'+new Values(color_per_type["RockClimbing"] ).tint(50).hex:
            type == 'InlineSkate' ? '#'+new Values(color_per_type["InlineSkate"] ).tint(50).hex:
            type == 'Kitesurf' ? '#'+new Values(color_per_type["Kitesurf"] ).tint(50).hex:
            type == 'Snowboard' ? '#'+new Values(color_per_type["Snowboard"] ).tint(50).hex:
            type == 'IceSkate' ? '#'+new Values(color_per_type["IceSkate"] ).tint(50).hex:
            type == 'StandUpPaddle' ? '#'+new Values(color_per_type["StandUpPaddle"] ).tint(50).hex:
            type == 'Crossfit' ? '#'+new Values(color_per_type["Crossfit"] ).tint(50).hex:
            type == 'E-BikeRide' ? '#'+new Values(color_per_type["E-BikeRide"] ).tint(50).hex:
            type == 'RollerSki' ? '#'+new Values(color_per_type["RollerSki"] ).tint(50).hex:
            type == 'Row' ? '#'+new Values(color_per_type["Row"] ).tint(50).hex:
            '#CCEDFF';
      });

    var rect = groups.selectAll("rect")
      .data(function(d) { return d; })
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y0 + d.y); })
      .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
      .attr("width", x.rangeBand())
      .on("mouseover", function() { tooltip.style("display", null); })
      .on("mouseout", function() { tooltip.style("display", "none"); })
      .on("mousemove", function(d) {
        var xPosition = d3.mouse(this)[0] - 15;
        var yPosition = d3.mouse(this)[1] - 25;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(d.y);
      });

    // Draw legend
    var legend = svg.selectAll(".legend")
      //.data(colors)
      .data(dataset)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });

    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d, i) {

        var type = 'unknown'
        if(typeof d[0] === 'undefined'){
          //console.log("unknown");
        } else {
          type = d[0].type;
        }

        return type == 'Run' ? '#'+new Values(color_per_type["Run"] ).tint(50).hex:
            type == 'Ride' ? '#'+new Values(color_per_type["Ride"] ).tint(50).hex:
            type == 'Hike' ? '#'+new Values(color_per_type["Hike"] ).tint(50).hex:
            type == 'BackcountrySki' ? '#'+new Values(color_per_type["BackcountrySki"] ).tint(50).hex:
            type == 'Walk' ? '#'+new Values(color_per_type["Walk"] ).tint(50).hex:
            type == 'AlpineSki' ? '#'+new Values(color_per_type["AlpineSki"] ).tint(50).hex:
            type == 'Swim' ? '#'+new Values(color_per_type["Swim"] ).tint(50).hex:
            type == 'NordicSki' ? '#'+new Values(color_per_type["NordicSki"] ).tint(50).hex:
            type == 'Snowshoe' ? '#'+new Values(color_per_type["Snowshoe"] ).tint(50).hex:
            type == 'Kayaking' ? '#'+new Values(color_per_type["Kayaking"] ).tint(50).hex:
            type == 'Windsurf' ? '#'+new Values(color_per_type["Windsurf"] ).tint(50).hex:
            type == 'Workout' ? '#'+new Values(color_per_type["Workout"] ).tint(50).hex:
            type == 'Canoe' ? '#'+new Values(color_per_type["Canoe"] ).tint(50).hex:
            type == 'RockClimbing' ? '#'+new Values(color_per_type["RockClimbing"] ).tint(50).hex:
            type == 'InlineSkate' ? '#'+new Values(color_per_type["InlineSkate"] ).tint(50).hex:
            type == 'Kitesurf' ? '#'+new Values(color_per_type["Kitesurf"] ).tint(50).hex:
            type == 'Snowboard' ? '#'+new Values(color_per_type["Snowboard"] ).tint(50).hex:
            type == 'IceSkate' ? '#'+new Values(color_per_type["IceSkate"] ).tint(50).hex:
            type == 'StandUpPaddle' ? '#'+new Values(color_per_type["StandUpPaddle"] ).tint(50).hex:
            type == 'Crossfit' ? '#'+new Values(color_per_type["Crossfit"] ).tint(50).hex:
            type == 'E-BikeRide' ? '#'+new Values(color_per_type["E-BikeRide"] ).tint(50).hex:
            type == 'RollerSki' ? '#'+new Values(color_per_type["RollerSki"] ).tint(50).hex:
            type == 'Row' ? '#'+new Values(color_per_type["Row"] ).tint(50).hex:
            '#CCEDFF';

        //return colors.slice()[i];

      });

    legend.append("text")
      .attr("x", width + 5)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d, i) {
        var type = 'unknown'
        if(typeof d[0] === 'undefined'){
          //console.log("unknown");
        } else {
          type = d[0].type;
        }
        return splitCamelCase(type)
        //return splitCamelCase(types[i]);
      });


    // Prep the tooltip bits, initial display is hidden
    var tooltip = svg.append("g")
      .attr("class", "tooltip")
      .style("display", "none");

    tooltip.append("rect")
      .attr("width", 30)
      .attr("height", 20)
      .attr("fill", "white")
      .style("opacity", 0.5);

    tooltip.append("text")
      .attr("x", 15)
      .attr("dy", "1.2em")
      .style("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold");

}
