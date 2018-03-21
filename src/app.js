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

const chartd3 = new ChartD3();
chartd3.init()
chartd3.loadData(data)
chartd3.build(data)
chartd3.addPlugin()
