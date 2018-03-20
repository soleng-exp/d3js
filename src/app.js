
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
    data: 20
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
    height = 500 - margin.top - margin.bottom;

// set the ranges
const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

// define the area
const area = d3.area()
    .x(function (d) {
        return x(d.date);
    })
    .y0(height)
    .y1(function (d) {
        return y(d.data);
    });

// define the line
const valueline = d3.line()
    .x(function (d) {
        return x(d.date);
    })
    .y(function (d) {
        return y(d.data);
    });

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
x.domain(d3.extent(data, function (d) {
    return d.date;
}));
y.domain([0, d3.max(data, function (d) {
    return d.data;
})]);

// add the area
svg.append("path")
    .data([data])
    .attr("class", "area")
    .attr("d", area);

// add the valueline path.
svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline);

// add the X Axis
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
// add the Y Axis
svg.append("g")
    .call(d3.axisLeft(y));

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
brush.on('brush', function (d) {
    k = brush.extent();
    j = data.filter(function (d) {
        return k[0] <= d.date && k[1] >= d.date;
    });
    console.log(j)
});
