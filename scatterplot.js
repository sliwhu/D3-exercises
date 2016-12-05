$(document).ready(function() {
    var file_name = "a5_data2_shali.tsv"
    console.log(file_name)

    // Convert the numeric properties in the data set
    // from strings to numbers.
    function convertFields(d) {
        d.retail_price = +d.retail_price;
        d.engine_size = +d.engine_size;
        d.hp = +d.hp;
        d.mpg_city = +d.mpg_city;
        d.mpg_hwy = +d.mpg_hwy;
        d.weight = +d.weight;
        return d;
    }

    // Binding data
    d3.tsv(file_name, convertFields, function(error, data) {
        // If no data
        if (error) {
            throw error;
        }
        console.log('data:', data)

        // Call the extent method to get the minimum and maximum values for
        // each numeric field in the data set.
        var range = {};
            range.retail_price = d3.extent(data, function(d) { return d.retail_price; });
            range.engine_size = d3.extent(data, function(d) { return d.engine_size; });
            range.hp = d3.extent(data, function(d) { return d.hp; });
            range.mpg_city = d3.extent(data, function(d) { return d.mpg_city; });
            range.mpg_hwy = d3.extent(data, function(d) { return d.mpg_hwy; });
            range.weight = d3.extent(data, function(d) { return d.weight; });
        range.type = d3.set(data.map(function(d) {
            return d.type;
        })).values();
        console.log('range:', range);
    
        var width = 800;
        var height = 550;  
        var svg = d3.select('.vis')      
           .append('svg')      
           .attr('width', width)      
           .attr('height', height); 

        var margins = {
            top: 20,      
            right: 20,      
            bottom: 50,      
            left: 30 
        };

        var graphWidth = width - margins.right - margins.left; 
        var graphHeight = height - margins.top - margins.bottom; 
        var chart = svg.append('g')     
          .attr('transform','translate(' + margins.left + ',' + margins.top + ')'); 

        var y = d3.scale.linear()          
            .range([graphHeight, 0])          
            .domain([0, range.engine_size[1]]); 
        var x = d3.scale.linear()         
            .range([0, graphWidth])         
            .domain([0, range.mpg_city[1]]); 

        var yAxis=d3.svg.axis()
            .scale(y)
            .orient("left");
        var xAxis=d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxisG=chart.append("g")
            .classed("y axis", true)
            .call(yAxis);

        var xAxisG=chart.append("g")
            .attr("transform", "translate(0," +graphHeight+")")
            .classed("x axis", true)
            .call (xAxis);

        xAxisG.append("text")
            .attr("class", "label")
            .attr("x", graphWidth)
            .attr("y", -5)
            .style("text-anchor", "end")
            .text("City MPG");
        yAxisG.append("text")
            .attr("class", "label")
            .attr("y", 6)
            .attr("x", 6)
            .attr("dy", ".5em")
            .text("Engine Size");

        var color=d3.scale.category20();
        var dots=chart.selectAll(".dot")
            .data(data);
        dots.enter()
            .append("circle")
            .attr("class", "dot")
            .append("title");
        dots.exit().remove();

        dots.attr("r", function(d) {return 5;})
            .attr("cy", function(d) {
                return y(d.engine_size);
            })
            .attr("cx", function(d){
                return x(d.mpg_city);
            })
            .style("fill", function(d){
                return color(d.type);
            });


    });
});
