import * as d3 from '../node_modules/d3/build/d3.min'

export default class ChartD3 {
    constructor() {
        // set the dimensions and margins of the graph
        this.margin = {top: 20, right: 20, bottom: 30, left: 50};
        this.width = 960 - this.margin.left - this.margin.right;
        this.height = 200 - this.margin.top - this.margin.bottom;
    }

    init() {
        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        console.log(d3)
        this.svg = d3.select("body").append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")");

    }

    loadData(data) {
        this.data = data
    }

    build() {

        // scale the range of the data
        console.log(d3.extent(this.data, d => d.date))
        this.x = d3.scaleTime().domain(d3.extent(this.data, d => d.date)).rangeRound([0, this.width]);
        this.y = d3.scaleLinear().domain([0, d3.max(this.data, d => d.data)]).rangeRound([this.height, 0]);
        // add the X Axis
        this.svg.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.x)
                .ticks(d3.timeDay)
                .tickPadding(0))
        // add the Y Axis
        this.svg.append("g")
            .call(d3.axisLeft(this.y));
        // add the data fill area
        this.svg.append("path")
            .data([this.data])
            .attr("class", "area")
            .attr("d", d3.area()
                .x(d => this.x(d.date))
                .y0(this.height)
                .y1(d => this.y(d.data))
            );

        // add the data line.
        this.svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", d3.line()
                .x(d => this.x(d.date))
                .y(d => this.y(d.data))
            );
    }

    addPlugin() {
        // add brush
        const brush = d3.brushX(this.x);

        this.svg.append("g")
            .call(brush)
            .selectAll("rect")
            .attr("height", this.height)
            .style({
                "fill": "#69f",
                "fill-opacity": "0.3"
            });
        const self = this;
        brush.on('end', function () {
            if (!d3.event.sourceEvent) return; // Only transition after input.
            if (!d3.event.selection) return; // Ignore empty selections.
            const d0 = d3.event.selection.map(self.x.invert);
            const d1 = d0.map(d3.timeDay.round);// If empty when rounded, use floor & ceil instead.

            if (d1[0] >= d1[1]) {
                d1[0] = d3.timeDay.floor(d0[0]);
                d1[1] = d3.timeDay.offset(d1[0]);
            }

            const j = self.data.filter(d => d1[0] <= d.date && d1[1] >= d.date);
            //reposition brush
            d3.select(this).transition().call(d3.event.target.move, d1.map(self.x));
        });
    }
}

window['ChartD3'] = ChartD3;
