//Step 0. Define global variables
var file_name = "a5_data3_shali.tsv";
var carData;

//Step 1. Once every information is loaded to the browser
$(document).ready(function(){

	//Step 2. Load tsv file
	d3.tsv(file_name, function(error, data) {
		//If no data found: throw error
		if (error) throw error;
		//If the data is loaded successfully, now we are ready to draw things with D3.
		else{
			
			//Step 3. convert tsv (math round)
			for (var i=0; i < data.length; i++){
				data[i].avg_net_income=Math.round(+data[i].avg_net_income);
				data[i].avg_profit_percentage=Math.round(+data[i].avg_profit_percentage*10)/10;
				data[i].retail_price=Math.round(+data[i].retail_price);
				data[i].dealer_cost=Math.round(+data[i].dealer_cost);
				data[i].mpg_city=Math.round(+data[i].mpg_city*10)/10;
				data[i].mpg_hwy=Math.round(+data[i].mpg_hwy*10)/10;
			}
			carData=data;
			console.log(data);

			//Step 4. Add event listner
			$("#radio").on("change", function(){
				var criteria= $('input[name="criteria"]:checked').val();
				
				drawBar(criteria);
			});
		}
	});
});

//Step 5. code drawBar
function drawBar(criteria){
	$(".vis").empty();

	var data = [];
	if (criteria == 1){
		for (var i=0; i<carData.length; i++){
			temp = {}
			temp.manufacturer=carData[i].manufacturer;
			temp.amount=carData[i].avg_net_income;
			data.push(temp);
		}
	}
	else if (criteria == 2){
		for (var i=0; i<carData.length; i++){
			temp = {}
			temp.manufacturer=carData[i].manufacturer;
			temp.amount=carData[i].avg_profit_percentage;
			data.push(temp);
		}
	}
	else if (criteria == 3){
		for (var i=0; i<carData.length; i++){
			temp = {}
			temp.manufacturer=carData[i].manufacturer;
			temp.amount=carData[i].retail_price;
			data.push(temp);
		}
	}
	else if (criteria == 4){
		for (var i=0; i<carData.length; i++){
			temp = {}
			temp.manufacturer=carData[i].manufacturer;
			temp.amount=carData[i].dealer_cost;
			data.push(temp);
		}
	}
	else if (criteria == 5){
		for (var i=0; i<carData.length; i++){
			temp = {}
			temp.manufacturer=carData[i].manufacturer;
			temp.amount=carData[i].mpg_city;
			data.push(temp);
		}
	}else if (criteria == 6){
		for (var i=0; i<carData.length; i++){
			temp = {}
			temp.manufacturer=carData[i].manufacturer;
			temp.amount=carData[i].mpg_hwy;
			data.push(temp);
		}
	}
	var margin = {top:20, right: 20, bottom: 55, left: 60};
	var vis_width = $('.vis').width() - margin.left - margin.right;
	var vis_height = $('.vis').height() - margin.top - margin.bottom;

	var x_scale = d3.scale.ordinal().rangeBands([0,vis_width]);
	var y_scale = d3.scale.linear().range([vis_height,0]);

	var x_axis = d3.svg.axis().scale(x_scale).orient("bottom");
	var y_axis = d3.svg.axis().scale(y_scale).orient("left").ticks(10);

	var svg=d3.select('.vis')
	.append('svg').attr('width', $('.vis').width()).attr('height',$('.vis').height())
	.append('g').attr("transform", "translate("+margin.left+","+margin.top+")");
	x_scale.domain(data.map(function(d){return d.manufacturer;}));
	y_scale.domain([0, d3.max(data, function(d){return d.amount;})]);

	svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0,"+vis_height+")")
	.call(x_axis)
	.selectAll("text")
	.attr("y", 0).attr("x", 9)
	.attr("dy","1em")
	.attr("transform", "rotate(45)")
	.style("text-anchor", "start");


	svg.append("g")
	.attr("class", "y axis")
	.call(y_axis)
	.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", -55)
	.attr("dy","71em")
	.style("text-anchor", "end")
	.text(function(){
		if(criteria==1){return "average net income ($)";}
		else if(criteria==2){return "Profit percentage (%)";}
		else if(criteria==3){return "Retail price ($)";}
		else if(criteria==4){return "Dealer cost ($)";}
		else if(criteria==5){return "MPG(city)";}
		else {return "MPG(highway)";}
	});

	svg.selectAll(".bar")
	.data(data)
	.enter().append("rect")
	.attr("class","bar")
	.attr("x", function(d){return x_scale(d.manufacturer)+2;})
	.attr("width", x_scale.rangeBand()-2)
	.attr("y",function(d){return y_scale(d.amount);})
	.attr("height", function(d){return vis_height - y_scale(d.amount);})
	.on("mouseover",function(d){})
	.on("mouseout", function(d){});



}
	
