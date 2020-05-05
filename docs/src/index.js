let yearStart = 2000
let yearEnd = 2021
let releaseYears = Array(yearEnd - yearStart + 1)
    .fill()
    .map(() => yearStart++)

function getRandomReleaseYear() {
    const releaseYear = releaseYears[Math.floor(Math.random() * releaseYears.length)]
    console.log(releaseYear)
    return releaseYear
}

const releaseYear = 2019 // getRandomReleaseYear()

const fill = gender => gender == "Male" ? "#377eb8" : (gender == "Female" ? "#e41a1c" : "#000000")

d3.json("data/gender-representation.json").then(dataset => {
    const datasetYear = dataset[releaseYear]

    const idAccessor = d => d.id
    const xAccessor = d => d.budget
    const yAccessor = d => d.revenue
    const rAccessor = d => d.popularity
    const cAccessor = d => d.genderLead
    const pAccessor = d => {
        const dist = d.genderDistributionCast
        return `<table style="width:100%">
        <tr>
            <th>Gender</th>
            <th>Frequency</th>
        </tr>
        <tr>
            <td align="center">Male</td>
            <td align="center">${dist.male}</td>
        </tr>
        <tr>
            <td align="center">Female</td>
            <td align="center">${dist.female}</td>
        </tr>
        <tr>
            <td align="center">Not specified</td>
            <td align="center">${dist.notSpecified}</td>
        </tr>
        </table>`
    }

    const dim = d3.min([
        window.innerWidth * 0.9,
        window.innerHeight * 0.9,
    ])
    let dimensions = {
        width: dim,
        height: dim,
        margin: {
            top: 10,
            right: 10,
            bottom: 75,
            left: 75,
        },
    }
    dimensions.boundedWidth = dimensions.width - dimensions.margin.left
        - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top
        - dimensions.margin.bottom

    const wrapper = d3.select("#wrapper-gender-representation")
        .append("svg")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)
    const bounds = wrapper
        .append("g")
            .style("transform", `translate(${
                dimensions.margin.left
            }px, ${
                dimensions.margin.top
            }px)`)
    
    const xScale = d3.scaleLinear()
        .domain(d3.extent(datasetYear, xAccessor))
        .range([0, dimensions.boundedWidth])
        .nice()
    const yScale = d3.scaleLinear()
        .domain(d3.extent(datasetYear, yAccessor))
        .range([dimensions.boundedHeight, 0])
        .nice()
    const rScale = d3.scaleLinear()
        .domain(d3.extent(datasetYear, rAccessor))
        .range([1, 10])

    const yAxisGenerator = d3.axisLeft()
        .scale(yScale)
        .tickFormat(x => x / Math.pow(10, 6))
    const yAxis = bounds.append("g")
        .call(yAxisGenerator)
    const yAxisLabel = yAxis.append("text")
        .attr("x", -dimensions.boundedHeight * 0.5)
        .attr("y", -dimensions.margin.left + 10)
        .attr("fill", "black")
        .style("font-size", "1.4em")
        .style("transform", "rotate(-90deg)")
        .style("text-anchor", "middle")
        .text("Revenue (in million $)")
    
    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)
        .tickFormat(x => x / Math.pow(10, 6))
    const xAxis = bounds.append("g")
        .call(xAxisGenerator)
            .style("transform", `translateY(${
                dimensions.boundedHeight
            }px)`)
    const xAxisLabel = xAxis.append("text")
        .attr("x", dimensions.boundedWidth * 0.5)
        .attr("y", dimensions.margin.bottom - 10)
        .attr("fill", "black")
        .style("font-size", "1.4em")
        .text("Budget (in million $)")
    
    const tooltip = d3.select("#collaborations")
        .append("div")
        .style("position", "absolute")
        .style("opacity", 0)
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
    const mouseover = function(d) {
        tooltip
            .style("opacity", 1)
    }
    const mousemove = function(d) {
        tooltip
            .html(pAccessor(d))
            .style("left", `${d3.mouse(this)[0] + 90}px`)
            .style("top", `${d3.mouse(this)[1]}px`)
    }
    const mouseleave = function(d) {
        tooltip
            .transition()
            .duration(100)
            .style("opacity", 0)
    }
        
    bounds.selectAll("circle")
        .data(datasetYear)
    .enter().append("circle")
        .attr("cx", d => xScale(xAccessor(d)))
        .attr("cy", d => yScale(yAccessor(d)))
        .attr("r", d => rScale(rAccessor(d)))
        .attr("fill", d => fill(cAccessor(d)))
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
    
    function update() {
        const t = d3.transition().duration(1000)

        const releaseYear = getRandomReleaseYear()
        const datasetYear = dataset[releaseYear]

        xScale.domain(d3.extent(datasetYear, xAccessor)).nice()
        yScale.domain(d3.extent(datasetYear, yAccessor)).nice()
        rScale.domain(d3.extent(datasetYear, rAccessor))

        xAxis.transition(t).call(xAxisGenerator)
        yAxis.transition(t).call(yAxisGenerator)

        const dots = bounds.selectAll("circle")
            .data(datasetYear)
        dots.exit()
            .transition(t)
            .attr("r", 0)
            .remove()
        dots
            .transition(t)
            .attr("cx", d => xScale(xAccessor(d)))
            .attr("cy", d => yScale(yAccessor(d)))
            .attr("r", d => rScale(rAccessor(d)))
            .attr("fill", d => fill(cAccessor(d)))
        dots.enter().append("circle")
            .attr("cx", d => xScale(xAccessor(d)))
            .attr("cy", d => yScale(yAccessor(d)))
            .attr("r", 0)
            .attr("fill", d => fill(cAccessor(d)))
            .transition(t)
            .attr("r", d => rScale(rAccessor(d)))
    }
})

d3.json("data/collaborations.json").then(dataset => {
    function drag(simulation) {
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
        }
        
        function dragged(d) {
            d.fx = d3.event.x
            d.fy = d3.event.y
        }
        
        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
    }

    function ticked() {
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
    
        node.attr("transform", d => `translate(${d.x}, ${d.y})`)
    }

    const datasetYear = dataset[releaseYear]
  
    const nodes = datasetYear.nodes
    const links = datasetYear.links

    const idAccessor = d => d.id
    const colorAccessor = d => d.gender
    const radiusAccessor = d => d.isDirector
    const lineWidthAccessor = d => d.value

    const radius = isDirector => isDirector == true ? 0 : 10

    const dim = d3.min([
        window.innerWidth * 0.9,
        window.innerHeight * 0.9,
    ])
    const dimensions = {
        width: dim,
        height: dim,
    }

    const wrapper = d3.select("#wrapper-collaborations")
        .append("svg")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)
            .call(d3.zoom().on("zoom", () => wrapper.attr("transform", d3.event.transform)))
        .append("g")
    
    const lineWidthScale = d3.scaleLinear()
        .domain(d3.extent(links, lineWidthAccessor))
        .range([1, 10])
    
    const simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => idAccessor(d)).distance(0).strength(0.1))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("center", d3.forceCenter(0.5 * dimensions.width, 0.5 * dimensions.height))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .alphaTarget(1)
        .on("tick", ticked)
  
    let link = wrapper.append("g")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.2)
        .selectAll("line")
    link = link.data(links)
    .enter().append("line")
        .attr("stroke-width", d => lineWidthScale(lineWidthAccessor(d)))

    let node = wrapper.append("g")
        .selectAll("rect")
    node = node.data(nodes)
    .enter().append("rect")
        .attr("x", -10).attr("y", -10)
        .attr("width", 20).attr("height", 20)
        .attr("rx", d => radius(radiusAccessor(d)) * 10)
        .attr("fill", d => fill(colorAccessor(d)))
        .call(drag(simulation))

    simulation.nodes(nodes)
    simulation.force("link").links(links)

    function update() {
        const releaseYear = getRandomReleaseYear()
        const datasetYear = dataset[releaseYear]

        const nodes = datasetYear.nodes
        const links = datasetYear.links

        lineWidthScale.domain(d3.extent(links, lineWidthAccessor))

        link = link.data(links)
        link.exit()
            .remove()
        link = link.enter().append("line")
            .merge(link)
            .attr("stroke-width", d => lineWidthScale(lineWidthAccessor(d)))
            
        node = node.data(nodes)
        node.exit()
            .remove()
        node = node.enter().append("rect")
            .attr("x", -10).attr("y", -10)
            .attr("width", 20).attr("height", 20)
            .merge(node)
            .attr("rx", d => radius(radiusAccessor(d)) * 10)
            .attr("fill", d => fill(colorAccessor(d)))
        
        simulation.nodes(nodes)
        simulation.force("link").links(links)
        simulation.alpha(1).restart()
    }
})

function drawWordCloud(selector, dataset) {  
    const tAccessor = d => d.text
    const sAccessor = d => d.size

    const dim = d3.min([
        window.innerWidth * 0.9,
        window.innerHeight * 0.9,
    ])
    const dimensions = {
        width: dim,
        height: dim,
    }
  
    const fontSizeScale = d3.scaleLinear()
        .domain(d3.extent(dataset, sAccessor))
        .range([0, dimensions.height])
    
    var colorScale = d3.scaleSequential(d3.interpolateGreys)
        .domain([0,100])
  
    const cloud = d3.layout.cloud();
  
    const layout = cloud
      .size([dimensions.width, dimensions.height])
      .words(dataset)
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 45)
      .font('Impact')
      .fontSize(d => fontSizeScale(sAccessor(d)))
      .on('end', draw)
  
    layout.start()
  
    function draw(words) {
        d3.select(selector)
            .append("svg")
                .attr("width", dimensions.width)
                .attr("height", dimensions.height)
            .append('g')
                .attr('transform', 'translate(' + [0.5 * dimensions.width, 0.5 * dimensions.height] + ')')
            .selectAll('text').data(words)
        .enter().append('text')
            .style('font-size', d => sAccessor(d) + 'px' )
            .style('fill', (d, i) => colorScale(i) )
            .attr('text-anchor', 'middle')
            .style('font-family', 'Impact')
            .attr('transform', d => 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')' )
            .text(d => tAccessor(d))
    }
  }

d3.json('data/thematic-differences-male-lead.json').then(dataset => {
  const datasetYear = dataset[releaseYear].slice(0,50)

  drawWordCloud('#wrapper-thematic-differences-male-lead', datasetYear)
})

d3.json('data/thematic-differences-female-lead.json').then(dataset => {
  const datasetYear = dataset[releaseYear].slice(0,50)

  drawWordCloud('#wrapper-thematic-differences-female-lead', datasetYear)
})