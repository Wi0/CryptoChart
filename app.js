getData("btc");

// when the input changes 
d3.select("#form").on("submit", function() {
  d3.event.preventDefault();
  var input = d3.select("input");

  d3.select("svg").remove();
  d3.select("#svg").append("svg");

  getData(input.property("value"));
});

function getData (x) {

// var url = "https://api.coindesk.com/v1/bpi/historical/close.json";
var url1 = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=";
var url2 = x;
var url3 = "&tsym=USD&limit=30&api_key=ef87f4ab9c38476af4b03795100283a537e88133d52c9402d3320315283de794";
var url = url1 + url2 + url3;

d3.json(url).then(function(data) {

  console.log(data);

  var data = data.Data.Data;
  
  // data = Object.keys(data.bpi).map(date => {
  //   return {
  //     date : d3.timeParse("%Y-%m-%d")(date),
  //     price: data.bpi[date],
  //   };
  // });{

  var unixTime = 1511435475;
  var javascriptTime = new Date(unixTime*1000);
  console.log(javascriptTime.toISOString());

  data.forEach(function (d){
    var javascriptTime = new Date(d.time*1000);
    d.date = javascriptTime;
    d.price = d.close;
  });
  
    
  console.log(data);

  var height = 600;
  var width = 1200;
  var padding = 50;
  
var xScale = d3.scaleTime()
                .domain(d3.extent(data, d => d.date))
                .range([padding, width - padding]);

var yScale = d3.scaleLinear()
               .domain(d3.extent(data, d => d.price))
               .range([height - padding, padding]);

var xAxis = d3.axisBottom(xScale)
              .tickSize(- height + 2 * padding)
              .tickSizeOuter(0);

var yAxis = d3.axisLeft(yScale)
              .tickSize(- width + 2 * padding)
              .tickSizeOuter(0);

var svg = d3.select("svg")
              .attr("width", width)
              .attr("height", height);

svg.append("g")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);

svg.append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);

svg.append("text")
    .attr("x", width / 2)
    .attr("y", (height - padding))
    .attr("dy", padding / 2)
    .style("text-anchor", "middle")
    .text("Date");

svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", - height / 2)
    .attr("dy", padding / 2)
    .style("text-anchor", "middle")
    .text("Price (USD)");

    // Add the line
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x( d => xScale(d.date))
      .y( d => yScale(d.price))
      .curve(d3.curveMonotoneX)
      )

  // Define the div for the tooltip
  var div = d3.select("body").append("div")	
              .attr("class", "tooltip")				
              .style("opacity", 0);

  svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", d => xScale(d.date))
        .attr("cy", d => yScale(d.price))
        .attr("r", 5)
        .on("mouseover", function(d) {		
          div.transition()		
              .duration(200)		
              .style("opacity", .9);		
          div	.html(d.date.toLocaleDateString() + "<br/>" + "$" + Math.floor(d.price))	
              .style("left", (d3.event.pageX) + "px")		
              .style("top", (d3.event.pageY - 28) + "px");	
          })					
      .on("mouseout", function(d) {		
          div.transition()		
              .duration(500)		
              .style("opacity", 0);	
      });

// svg.append("text")
//     .attr("x", width / 2)
//     .attr("dy", "1em")
//     .attr("class", "title")
//     .style("text-anchor", "middle")
//     .style("font-size", "2em")
//     .text("Bitcoin chart");


});
}
