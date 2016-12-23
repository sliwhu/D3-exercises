

//Width and height of map
var width=960;
var height=500;

//D3 Projection
var projection=d3.geo.albersUsa()
	.translate([width/2, height/2]) 
	.scale([1000]);

//Define path  generator
var path=d3.geo.path()
	.projection(projection);

//Define linear scale for output
var color=d3.scale.linear()
	.range(["rgb(213, 222, 217)", "rgb(69, 173, 168)", "rgb(84, 36, 55)", "rgb(217, 91, 67"]);


//Create SVG element and append the map to the SVG
var svg=d3.select("body")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

//Append Div for tooltip to SVG
var div=d3.select("body")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

//Load in the states data
d3.json("us-states.json", function(json) {
	console.log(json);
	color.domain([0, 1]);

	d3.csv("us-cities.csv", function(data) {
		console.log("CSV2:" + data);
		var i, j;
		for (i=0; i<json.features.length; i++) {
			var stateName=json.features[i].properties.name;
			for (j=0; j<data.length; j++) {
				if (data[j].state === stateName) {
					json.features[i].properties.hasTopCity = true;
				}
			}
		}
	


//bind the data to the SVG and create one path per GeoJSON feature
	svg.selectAll("path")
		.data(json.features)
		.enter()
		.append("path")
		.attr("d", path)
		.style('stroke', "#fff")
		.style("stroke-width", "1")
		.style("fill", function(d) {
			var value=d.properties.hasTopCity;
			if (value) {
				return color(value);
			} else {
				return "rgb(213, 222, 217)";
			}
		});

	svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function(d) {
			return projection([d.lon, d.lat])[0];
		})
		.attr("cy", function (d) {
			return projection([d.lon, d.lat])[1];
		})
		.attr("r", function(d) {
			var r=parseInt(d.population)/500000;
			console.log(r);
			return Math.ceil(r);
		})
			.style("fill", "rgb(217, 91, 67)")
			.style("opacity", 0.85)

		.on("mouseover", function(d) {
			div.transition()
			   .duration(200)
			   .style("opacity", .9);
			div.text(d.city)
			   .style("left", (d3.event.pageX) + "px")
			   .style("top", (d3.event.pageY-28) + "px");
		})

		.on("mouseout", function(d) {
			div.transition()
			   .duration(500)
			   .style("opacity", 0);
		});
});
});
