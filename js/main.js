
document.addEventListener('DOMContentLoaded', () => {
    var words = [
        { text: 'Drama', size: 2297 },
        { text: 'Comedy', size: 1722 },
        { text: 'Thriller', size: 1274 },
        { text: 'Action', size: 1154 },
        { text: 'Romance', size: 894 },
        { text: 'Adventure', size: 790 },
        { text: 'Crime', size: 696 },
        { text: 'Science Fiction', size: 535 },
        { text: 'Horror', size: 519 },
        { text: 'Family', size: 513 },
        { text: 'Fantasy', size: 424 },
        { text: 'Mystery', size: 348 },
        { text: 'Animation', size: 234 },
        { text: 'History', size: 197 },
        { text: 'Music', size: 185 },
        { text: 'War', size: 144 },
        { text: 'Documentary', size: 110 },
        { text: 'Western', size: 82 },
        { text: 'Foreign', size: 34 },
        { text: 'TV Movie', size: 8 }
    ]

    words = words.map(v => { return { text: v.text, size: 10 * Math.log(v.size) } })

    var fill = d3.scaleOrdinal(d3.schemeAccent);

    var cloud = d3.layout.cloud()

    var layout = cloud
        .size([500, 500])
        .words(words)
        .padding(5)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", draw);

    layout.start();

    function draw(words) {
        d3
        .select(".container")
        .append("svg")
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
        .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("fill", function(d, i) { return fill(i); })
        .style("font-family", "Impact")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
    }
})
