const data = [{
    date: new Date("Jan 01, 2015"),
    data: 12
}, {
    date: new Date("Jan 02, 2015"),
    data: 17
}, {
    date: new Date("Jan 03, 2015"),
    data: 5
}, {
    date: new Date("Jan 04, 2015"),
    data: 22.5
}, {
    date: new Date("Jan 05, 2015"),
    data: 6
}, {
    date: new Date("Jan 06, 2015"),
    data: 17
}];

// set the dimensions and margins of the graph
const margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// scale the range of the data
console.log(d3.extent(data, d => d.date))
const x = d3.scaleTime().domain(d3.extent(data, d => d.date)).rangeRound([0, width]);
const y = d3.scaleLinear().domain([0, d3.max(data, d => d.data)]).rangeRound([height,0]);
//End set env
//*******

// add the X Axis
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
        .ticks(d3.timeDay)
        .tickPadding(0))
// add the Y Axis
svg.append("g")
    .call(d3.axisLeft(y));
// End set axis
//***** DATA

// add the data fill area
svg.append("path")
    .data([data])
    .attr("class", "area")
    .attr("d", d3.area()
        .x(d => x(d.date))
        .y0(height)
        .y1(d => y(d.data))
    );

// add the data line.
svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", d3.line()
        .x(d => x(d.date))
        .y(d => y(d.data))
    );

// END data
//**************
// add brush
const brush = d3.brushX(x);

svg.append("g")
    .call(brush)
    .selectAll("rect")
    .attr("height", height)
    .style({
        "fill": "#69f",
        "fill-opacity": "0.3"
    });
brush.on('end', function (d) {
    if (!d3.event.sourceEvent) return; // Only transition after input.
    if (!d3.event.selection) return; // Ignore empty selections.
    const d0 = d3.event.selection.map(x.invert);
    const d1 = d0.map(d3.timeDay.round);// If empty when rounded, use floor & ceil instead.

    if (d1[0] >= d1[1]) {
        d1[0] = d3.timeDay.floor(d0[0]);
        d1[1] = d3.timeDay.offset(d1[0]);
    }

    const j = data.filter(function (d) {
        return d1[0] <= d.date && d1[1] >= d.date;
    });
    console.log(d0, d1)
    console.log(d)
    console.log(j)
    //reposition brush
    d3.select(this).transition().call(d3.event.target.move, d1.map(x));
});
