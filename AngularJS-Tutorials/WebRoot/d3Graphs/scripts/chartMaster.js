var FIVE_MINUTES = 1000 * 60 * 5;
var aryColorData = [ /* Brown - {"dark":"#a73f05", "light":"#d08f6b"}, Brown - {"dark":"#c55204", "light":"#e57b33"}, 
					Yellow - {"dark":"#837704", "light":"#ead61e"}, GREEN - {"dark":"#3d7200", "light":"#89c346"}, */ 
				{"dark":"#104a8d", "light":"#7aa1ce"}, {"dark":"#aa6c42", "light":"#e5d3c6"},
				{"dark":"#7b3e80", "light":"#d7c5d9"}, {"dark":"#E56361", "light":"#EED2D1"} 
				];	

// draws chart inside panel 
function drawChartPanel(joGraphOptions, aryChartData) {
	var joPanelOptions = joGraphOptions.panelOptions;
	var joChartOptions = joGraphOptions.chartOptions;
	var panelId = 'chartpanel_'+joPanelOptions.id, svgChartId = panelId+'_graph';
	
	var myPanel = new Ext.Panel({
		width: 620,
		height: 280,
		id: panelId,
		layout: 'fit',
		renderTo: joPanelOptions.renderTo,
		html: '<div id="'+svgChartId+'" style="height:100%; width:100%;"></div>',
		title: joPanelOptions.title,
		listeners : {
			afterrender: function (panel) {
				if ( joChartOptions.chartType === 'BAR' ) {	// bar chart 
					drawBarChart(panel, svgChartId, joChartOptions, aryChartData);
				} if ( joChartOptions.chartType === 'HORIZONTAL_BAR' ) {	// Horizontal bar chart 
					drawHorizontalBarChart(panel, svgChartId, joChartOptions, aryChartData);
				} else if ( joChartOptions.chartType === 'AREA') {	// area chart 
					drawAreaChart(panel, svgChartId, joChartOptions, aryChartData);
				}
			}
		}
	});
}

// bar chart 
function drawBarChart(panel, eleId, joOptions, data) {
	var margins = { top: 15, right: 20, bottom: 70, left: 65 };
	var width = panel.width, height = panel.height - 25 /* title bar's height */;
	
	var DEFAULT_BAR_WIDTH = 5;
	var nBarWidth = (joOptions.barWidth || DEFAULT_BAR_WIDTH);
	
	var timeFormat = d3.time.format('%d %b %H:%M'), tooltipTimeFormat = d3.time.format("%Y-%b-%d %H:%M:%S");
	
	// Note: default_highlight_color is respective to the `color(0)`, if `color(0)` changes `color(<ANY_NUMBER>)`, respective colors highlight to set 
	var color = d3.scale.category10(), DEFAULT_COLOR = color(0), DEFAULT_BAR_HIGHLIGHT_COLOR = '#0000FF' ;
	//var barColor = joOptions.barColor || DEFAULT_COLOR;
	var barHighlightColor = joOptions.barHighlightColor || DEFAULT_BAR_HIGHLIGHT_COLOR;
	
	// Bar Color
	var barColor;
	if ( joOptions.barColor !== undefined ) {	// From options
		barColor = joOptions.barColor;
	} else {	// from default's random color
		var nIdxRandomColor = Math.floor(Math.random() * aryColorData.length);
		barColor = aryColorData[nIdxRandomColor].dark;
	}

	var bisectDate = d3.bisector(function(d) { return d.T; }).left; //d3.bisect works only on sorted data, if d.T is text then it should be sorted inside the array.
	var x, xAxis, xMin, xMax;
	
	if(joOptions.xAxisValue == 'TIME'){
		xMin = data[0].T - FIVE_MINUTES;
		xMax = data[data.length - 1].T + FIVE_MINUTES;

		x = d3.time.scale()
				//.domain([new Date(xMin), d3.time.day.offset(new Date(xMax), 1)])
				//.domain([new Date(xMin), d3.time.minute.offset(new Date(xMax), 5)])
				.domain([new Date(xMin), new Date(xMax)])
				.range([0, width - margins.left - margins.right]);
		
		xAxis = d3.svg.axis()
				.scale(x)
				.orient('bottom')
				.ticks(5)
				.tickPadding(8)
				.tickFormat(timeFormat);
	
	} else if(joOptions.xAxisValue == 'TEXT'){
		xMin = data[0].T;
		xMax = data[data.length - 1].T;
		
		x = d3.scale.ordinal()
				.domain(data.map(function(d) { return d.T; }))
				.rangeRoundBands([0, width - margins.left - margins.right], .8, .8); // .rangeRoundBands([0, elementWidth], barPad, barOuterPad)
		
		xAxis = d3.svg.axis()
					.scale(x)
					.orient('bottom')
					.ticks(5);
	}
	
	var y, yAxis, yMin, yMax;
	
	yMin = d3.min(data, function(d) { return d.V; });
	yMax = d3.max(data, function(d) { return d.V; });
	
	y = d3.scale.linear()
				//.domain([yMin, yMax])
				.domain([0, yMax])
				.range([height - margins.top - margins.bottom, 0]);
	
	yAxis = d3.svg.axis()
				.scale(y)
				.orient('left')
				.tickPadding(8);
	
	var svg = d3.select('#'+eleId)
				.append('svg')
				.attr('width', width)
				.attr('height', height)
				.append("g")
				.attr('transform', 'translate('+margins.left+', '+margins.top+')');
	
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (height - margins.top - margins.bottom) + ")")
		.call(xAxis);
	
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis);
	
	// x-axis label
	svg.append("text")
		.attr("class", "axisLabel")
		.attr("x", ((width - margins.left - margins.right)))
		.attr("y", (height - 55 )) // `-20` Font Height + Text margin
		.style("text-anchor", "middle")
		.text(joOptions.xAxisLabel );
	
	// y-axis label 
	svg.append("text")
		.attr("class", "axisLabel")
		.attr("transform", "rotate(-90)")
		.attr("x", (0 - (height / 2)))
		.attr("y", (0 - margins.left))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.text( joOptions.yAxisLabel);
	
	// legend
	svg.append("text")
		.attr("class", "legend11")
		.attr("x", ((width - margins.left - margins.right) / 2))
		.attr("y", (height - 30 )) // `-30` Font Height + Text margin
		.style("text-anchor", "middle")
		.text(joOptions.xAxisLabel);

	svg.append('rect')
		.attr("x", ((width - margins.left - margins.right) / 2) - 50)
		.attr("y", (height - 40 )) // `-40` Font Height + Text margin
		.attr('width', 12)
		.attr('height', 10)
		.style("stroke", "black")
		.style("stroke-width", "0.5px")
		.style('fill', barColor);
	
	var legendName = ['yAxisLabel'];
	
	legendName[0] = joOptions.yAxisLabel;
	
	var legend = svg.selectAll(".legend")
    .data(legendName.slice())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate("+-height+"," + (height - margins.top - 25) + ")"; });

	legend.append("rect")
	    .attr("x", (width - margins.left - margins.right) - 70)
		.attr('width', 12)
		.attr('height', 10)
		.style("stroke", "black")
		.style("stroke-width", "0.5px")
	    .style("fill", barColor);
	
	legend.append("text")
	    .attr("x", (width - margins.left - margins.right) + 10)
	    .attr("y", 9)
	    .attr("dy", ".35em")
	    .style("text-anchor", "end")
	    .text(function(d) { return d; });
	
	// ToolTip
	var tooltip = d3.select("body")
					.append("div")
					.attr("class", "chart-tooltip bar-tooltip")
					.style("opacity", 1e-6);
	
	var bar = svg.append("g")
				.attr("class", "gBar")
				.selectAll(".bar")
				.data(data)
				.enter()
				.append("rect")
				.attr("class", "bar")
				/*.attr("width", nBarWidth)*/
				.attr("width", (joOptions.xAxisValue == 'TEXT') ? x.rangeBand() : nBarWidth)
				/* respective rect's/bar's mouseover tooltip ignored, instead on mousemove chart, tooltip for nearest point 
				.on("mouseover", function(d) {
					// formats, tooltip text
					var toolTipText = 'Time: '+tooltipTimeFormat(new Date(d.T))+'<BR>'+(joOptions.tooltipValueText || 'Value')+': '+d.V;
					
					// for highlight
					d3.select(this)
						.style("opacity", 0.65);
					
					// tooltip shown 
					// after `transition`, attribute `style` or `...tween` only works, if `.html(toolTipText)` presents error throws; thinks 
					tooltip	.html(toolTipText)
							.style("top", (d3.event.pageY - 10)+"px")
							.style("left", (d3.event.pageX + 10)+"px")
							.transition()
							.duration(200)
							/* after transistion, position added `div` moves as animation
							.style("top", (d3.event.pageY - 10)+"px")
							.style("left", (d3.event.pageX + 10)+"px")* /
							.style("opacity", 0.8);
				})
				.on("mouseout", function(d) {
					// reset highlight
					d3.select(this)
						.style("opacity", 1);
					
					// hides tooltip 
					tooltip	.transition()
							.duration(200)
							.style("opacity", 1e-6);
				})*/
				.attr("x", function(d) { return x(d.T); })
				.attr("y", function(d) { return y(d.V); })
				.attr("height", function(d) { return (height - margins.top - margins.bottom) - y(d.V); })
				//.style("opacity", 0.5)
				/* different bar colors .style("fill", function(d, i) { return color(i); }) */
				.style("fill", barColor);
	
	// plots circle, respective point in mousemove 
	var rectTooltipPoint = svg//.append('g')
								.append('rect')
								.attr('class', 'rectTooltipPoint')
								.attr("width", nBarWidth)
								.attr('x', 0)
								.attr('y', 0)
								.style('opacity', 0)
								.attr('fill', barHighlightColor);
	
	// tooltip to have mouseover chart, 
	svg.append("rect")
		.attr("class", "overlay")
		.style("fill", "none")
		.style("pointer-events", "all")
		.attr("width", width - margins.left)
		.attr("height", height - margins.bottom)
		.on("mouseover", function() {
			// circle shown
			rectTooltipPoint.style('opacity', 1);
			
			// tooltip shown
			tooltip	.transition()
					.duration(200)
					.style("opacity", 0.80);
		})
		.on("mouseout", function() {
			// circle hide 
			rectTooltipPoint.style('opacity', 0);
			
			// tooltip hide
			tooltip	.transition()
					.duration(200)
					.style("opacity", 1e-6);
		})
		.on("mousemove", mousemove);
	
	function mousemove() {
		var x0 = x.invert(d3.mouse(this)[0]), 
			i = bisectDate(data, x0, 1),
			d0 = data[i - 1],
			d1 = data[i],
			d = ((d0 === undefined || d1 === undefined) ? d0 || d1 : (x0 - d0.T > d1.T - x0 ? d1 : d0));
		
		var toolTipText = 'Time: '+tooltipTimeFormat(new Date(d.T))+'<BR>'+(joOptions.tooltipValueText || 'Value')+': '+d.V;
		
		// moves circle, to the mouse pointer's nearest point 
		rectTooltipPoint.attr('x', x(d.T))
						.attr('y', y(d.V))
						.attr("height", (height - margins.top - margins.bottom) - y(d.V));
		
		// tooltip text shown, 
		tooltip	.html(toolTipText)
				.style("top", (d3.event.pageY - 10)+"px")
				.style("left", (d3.event.pageX + 10)+"px");
	}
}



// Horizontal bar chart. 
function drawHorizontalBarChart(panel, eleId, joOptions, data) {
	
	var width = panel.width, height = panel.height - 25 /* title bar's height */;

	var DEFAULT_BAR_WIDTH = 5;
	var nBarWidth = (joOptions.barWidth || DEFAULT_BAR_WIDTH);
	
	var timeFormat = d3.time.format('%d %b %H:%M'), tooltipTimeFormat = d3.time.format("%Y-%b-%d %H:%M:%S");
	
	// Note: default_highlight_color is respective to the `color(0)`, if `color(0)` changes `color(<ANY_NUMBER>)`, respective colors highlight to set 
	var color = d3.scale.category10(), DEFAULT_COLOR = color(0), DEFAULT_BAR_HIGHLIGHT_COLOR = '#0000FF' ;
	var barColor = joOptions.barColor || DEFAULT_COLOR, barHighlightColor = joOptions.barHighlightColor || DEFAULT_BAR_HIGHLIGHT_COLOR;

	var bisectDate = d3.bisector(function(d) { return d.T; }).left;
	
	// tooltip
    var toolTip = d3.select("body")
    				.append("div")
    				.attr("class", "toolTip");
    
    var marginBottom = 20,
            margin = 30,
            valueMargin = 4,
            
            barHeight = (height-marginBottom-margin*2)* 0.4/data.length,
            barPadding = (height-marginBottom-margin*2)*0.6/data.length,
            bar, svg, scale, xAxis, labelWidth = 0;

    max = d3.max(data, function(d) { return d.V; });

    svg = d3.select('#'+eleId)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

    bar = svg.selectAll("g")
            .data(data)
            .enter()
            .append("g");

    bar.attr("class", "bar")
            .attr("cx",0)
            .attr("transform", function(d, i) {
                return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
            });

	// x-axis label
	svg.append("text")
		.attr("class", "axisLabel")
		.attr("x", ((width - margin) / 2))
		.attr("y", (height - 20 )) // `-20` Font Height + Text margin
		.style("text-anchor", "middle")
		.text(joOptions.xAxisLabel );
    
	// y-axis values - text
    bar.append("text")
            .attr("class", "label")
            .attr("y", barHeight / 2)
            .attr("dy", ".35em") //vertical align middle
            .attr("x", "-5") //x
            .text(function(d){
                return d.T;
            }).each(function() {
        	//labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
        	labelWidth = 48;
    });

    scale = d3.scale.linear()
            .domain([0, max])
            .range([0, width - margin*2 - labelWidth]);

    xAxis = d3.svg.axis()
            .scale(scale)
            .tickSize(5)
            .orient("bottom");

    bar.append("rect")
            .attr("transform", "translate("+labelWidth+", 0)")
            .style("fill", barColor)
            .attr("height", barHeight)
            .attr("width", function(d){
                return scale(d.V);
            });
    
    // Value text in the horizontal bar 
    bar.append("text")
            .attr("class", "value")
            .attr("y", barHeight / 2)
            .attr("dx", -valueMargin + labelWidth) //margin right
            .attr("dy", ".35em") //vertical align middle
            .attr("text-anchor", "end")
            .style('fill', 'white')
            
            .text(function(d){
                return (d.V);
            })
            .attr("x", function(d){
               // var width = this.getBBox().width;
            	var width = 18;
                return Math.max(width + valueMargin, scale(d.V));
            });
    
    bar.on("mousemove", function(d){
    	
    	toolTip	.style("left", d3.event.pageX+10+"px")
		    	.style("top", d3.event.pageY-25+"px")
		    	.style("display", "inline-block")
		    	.attr("class", "chart-tooltip")
		    	.html((d.T)+" - "+(d.V));
    	});
    
    bar.on("mouseout", function(d){
    	toolTip.style("display", "none");
    	});

/*     svg.insert("g",":first-child")
            .attr("class", "axisHorizontal")
            .attr("transform", "translate(" + (margin + labelWidth) + ","+ (height - marginBottom - margin)+")")
            .call(xAxis); */
    
    // x-axis line.
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + (margin + labelWidth) + ","+ (height - marginBottom - margin)+")")
    .call(xAxis);
    
}

// draws area graph
function drawAreaChart(panel, eleId, joOptions, data) {
	var margins = { top: 10, right: 20, bottom: 40, left: 65 };
	var width = panel.getWidth(), height = panel.getHeight() - 25 /* title bar's height */;
	
	var timeFormat = d3.time.format('%d %b %H:%M'), tooltipTimeFormat = d3.time.format("%Y-%b-%d %H:%M:%S");
	
	var DEFAULT_LINE_WIDTH = 2, DEFAULT_DOT_SIZE = 3;
	var nLineWidth = joOptions.lineWidth || DEFAULT_LINE_WIDTH, nDotSize = joOptions.dotSize || DEFAULT_DOT_SIZE;
	
	// graph color 
	var joGraphColor = {};
	if ( joOptions.color !== undefined ) {	// from options
		joGraphColor = joOptions.color;
	} else {	// from default's random color
		var nIdxRandomColor = Math.floor(Math.random() * aryColorData.length);
		joGraphColor = aryColorData[nIdxRandomColor];
	}
	
	
	var xMin = data[0].T - FIVE_MINUTES;
	var xMax = data[data.length - 1].T + FIVE_MINUTES;
	
	var aryYminYmax = getYminYmaxAsObject(data);
	
	// Adjust the min & max with a 5% value, to avoid the data-point on chart's top-bottom borders
	aryYminYmax[1] = Math.ceil( aryYminYmax[1] + aryYminYmax[1] * 5 / 100); // adding 5% of max value to ensure graph is within boundry
	aryYminYmax[0] = aryYminYmax[0] - Math.ceil( aryYminYmax[0] * 5 / 100); // min value is reduced by 5% of min graph value to ensure boundry is intact
	
	var bisectDate = d3.bisector(function(d) { return d.T; }).left;
	
	var x = d3.time.scale()
				.range([0, width - margins.left - margins.right])
				.domain([xMin, xMax]);
	
	var y = d3.scale.linear()
				.range([height - margins.top - margins.bottom, 0])
				.domain(aryYminYmax);
	
	var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom")
					.ticks(5)
					.tickFormat(timeFormat);
	
	var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left")
					.ticks(5);
	
	var area = d3.svg.area()
					.interpolate("linear")
					.x(function(d) { return x(d.T); })
					.y0(height - margins.top - margins.bottom)
					.y1(function(d) { return y(d.V); });
	
	var line = d3.svg.line()
				.interpolate("linear")
				.x(function(d) {return x(d.T);})
				.y(function(d){return y(d.V);});
	
	var svg = d3.select('#'+eleId)
				.append('svg')
				.attr('width', width)
				.attr('height', height)
				.append("g")
				.attr('transform', 'translate('+margins.left+', '+margins.top+')');
	
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (height - margins.top - margins.bottom) + ")")
		.call(xAxis);
	
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis);
	
	// x-axis label
	svg.append("text")
		.attr("class", "axisLabel")
		.attr("x", ((width - margins.right) / 2))
		.attr("y", (height - 20 )) // `-20` Font Height + Text margin
		.style("text-anchor", "middle")
		.text(joOptions.xAxisLabel);
	
	// y-axis label 
	svg.append("text")
		.attr("class", "axisLabel")
		.attr("transform", "rotate(-90)")
		.attr("x", (0 - (height / 2)))
		.attr("y", (0 - margins.left))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.text(joOptions.yAxisLabel);
	
	// 
	// Data in format `[{T: , V: }, {T: , V: }, {T: , V: }]`
	svg.append("path")
		.datum(data)
		.style("fill", joGraphColor.light)
		.attr("d", area);
		//.attr("transform", "translate("+(height - margins.top - margins.bottom)+", 0)");
		//.attr("transform", "translate("+(height - margins.top - margins.bottom)+", "+(width - margins.left - margins.right)+")");
	
	svg.append("path")
		.attr("class", "line")
		.attr("d", line(data))
		//.attr("transform", "translate(0," + (height - margins.top - margins.bottom) + ")")
		.attr("stroke", function(d) {return joGraphColor.dark;})
		.style("stroke-width", nLineWidth);
	
	// plots circle, if given from attribure OR data has only one point
	svg	.append('g')
		.attr("class", "dot")
		.selectAll('circle')
		.data(data)
		.enter().append('circle')
		//.style("cursor", "pointer")
		.attr("cx", function(d) {return x(d.T);})
		.attr("cy", function(d){return y(d.V);})
		//.style("opacity", 0.7)
		.attr("r", nDotSize)
		.attr("fill",function(d) {return joGraphColor.dark;});/*
		.append("title")
		.text(getCircleTooltipText);*/

	// div tooltip
	var tooltip = d3.select("body")
					.append("div")
					.attr("class", "chart-tooltip line-tooltip")
					.style("opacity", 1e-6);
	
	// plots circle, respective point in mousemove 
	var circleTooltipPoint = svg//.append('g')
								.append('circle')
								.attr('class', 'circleTooltipPoint')
								.attr('cx', 0)
								.attr('cy', 0)
								.attr('opacity', 0)
								.attr('r', 7)
								.attr('fill', joGraphColor.dark);
								//.attr("transform", "translate("+MARGINS.left*3/2+", "+(0+5)+")");
	
	// tooltip to have mouseover chart, 
	svg.append("rect")
		.attr("class", "overlay")
		.style("fill", "none")
		.style("pointer-events", "all")
		.attr("width", width - margins.left)
		.attr("height", height - margins.bottom)
		.on("mouseover", function() {
			// circle shown
			circleTooltipPoint.attr('opacity', 0.5);
			
			// tooltip shown
			tooltip	.transition()
					.duration(200)
					.style("opacity", 0.80);
		})
		.on("mouseout", function() {
			// circle hide 
			circleTooltipPoint.attr('opacity', 0);
			
			// tooltip hide
			tooltip	.transition()
					.duration(200)
					.style("opacity", 1e-6);
		})
		.on("mousemove", mousemove);
	
	function mousemove() {
		var x0 = x.invert(d3.mouse(this)[0]), 
				i = bisectDate(data, x0, 1),
				d0 = data[i - 1],
				d1 = data[i],
				d = ((d0 === undefined || d1 === undefined) ? d0 || d1 : (x0 - d0.T > d1.T - x0 ? d1 : d0));
		
		var toolTipText = 'Time: '+tooltipTimeFormat(new Date(d.T))+'<BR>'+(joOptions.tooltipValueText || 'Value')+': '+d.V;
		
		/* working
		circleTooltipPoint.data([d] /* nearest graph point * /)
					.attr('cx', function(d) { 
						return x(d.T);
					})
					.attr('cy', function(d) { 
						return y(d.V);
					});*/
		
		// moves circle, to the mouse pointer's nearest point 
		circleTooltipPoint.attr('cx', x(d.T))
						.attr('cy', y(d.V));
		
		// tooltip text shown, 
		tooltip	.html(toolTipText)
				.style("top", (d3.event.pageY - 10)+"px")
				.style("left", (d3.event.pageX + 10)+"px");
		
		// TODO: thinks, div to come nearby respective point; thinks, adjust x's y's cooridataes to screen position 
	}
}


function getYminYmaxAsObject(aryChartData) {
	// gets yMin, yMax from data Array In JSON, (i.e. format `[{T: 1462511914244, V: 0}, ..., {T: 1462515488947, V: 0}]` );
	var yMin = d3.min(aryChartData, function(joDatum) { return joDatum.V; });
	var yMax = d3.max(aryChartData, function(joDatum) { return joDatum.V; });
	return [yMin, yMax];
}