const color = d3.scaleOrdinal(d3.schemeSet1);

const width = 1000
const height = 500

function drawWordCloud(selector, data) {
  const max = Math.max.apply(Math, data.map(o => o.size))

  const scale = d3.scaleLinear()
    .domain([0, max])
    .range([0, height]);

  const cloud = d3.layout.cloud();

  const layout = cloud
    .size([width, height])
    .words(data)
    .padding(5)
    .rotate(() => ~~(Math.random() * 2) * 90)
    .font('Impact')
    .fontSize(d => scale(d.size))
    .on('end', draw);

  layout.start();

  function draw(words) {
    d3.select(selector)
      .attr('viewBox', [0, 0, width, height])
      .append('g')
      .attr('transform', 'translate(' + [0.5 * width, 0.5 * height] + ')')
      .selectAll('text')
      .data(words).enter()
        .append('text')
        .style('font-size', d => d.size + 'px' )
        .style('fill', (d, i) => color(i) )
        .style('font-family', 'Impact')
        .attr('text-anchor', 'middle')
        .attr('transform', d => 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')' )
        .text(d => d.text );
  }
}

d3.json('data/genre-word-cloud.json').then(data => {
  drawWordCloud('.genres-word-cloud', data)
});

d3.json('data/keywords-word-cloud.json').then(data => {
  drawWordCloud('.keywords-word-cloud', data)
});

d3.json('data/community.json').then(data => {
  const svg = d3.select('.community')
    .attr('viewBox', [0, 0, width, width]);
  
  const simulation = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links).id(d => d.id))
    .force('charge', d3.forceManyBody().strength(-2500))
    .force('center', d3.forceCenter(0.5 * width, 0.5 * width));

  const link = svg.append('g')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .selectAll('line')
    .data(data.links)
    .enter().append('line')
      .attr('stroke-width', d => d.value);

  const node = svg.append('g')
    .selectAll('g')
    .data(data.nodes)
    .enter().append('g')
  
  node.append('circle')
    .attr('stroke', '#000')
    .attr('stroke-width', 2)
    .attr('r', 10)
    .attr('fill', d => color(d.group))
    .call(drag(simulation));

  node.append('text')
    .attr('font-size', '14px')
    .attr('x', 10)
    .attr('y', -5)
    .text(d => d.id);

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node
      .attr('transform', d => 'translate(' + [d.x, d.y] + ')')
  });

  function drag(simulation) {
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    
    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }
});

function drawBubblePlot(selector, data) {
  data = {children: data}

  var bubble = d3.pack(data)
    .size([width, width])
    .padding(1.5);

  var svg = d3.select(selector)
    .attr('viewBox', [0, 0, width, width]);

  var nodes = d3.hierarchy(data)
    .sum(d => d.size);

  var node = svg.selectAll('g')
    .data(bubble(nodes).descendants())
    .enter().filter(d => !d.children).append('g')
      .attr('transform', d => 'translate(' + [d.x, d.y] + ')');

  node.append('clipPath')
    .attr('id', 'clipCircle')
    .append('circle')
    .attr('r', d => d.r)
    .style('fill-opacity', '0');
  
  node.append('svg:image')
    .attr('xlink:href', d => d.data.poster_url )
    .attr('x', d => -1.5*d.r)
    .attr('y', d => -1.5*d.r)
    .attr('width', d => 3*d.r)
    .attr('height', d => 3*d.r)
    .attr('clip-path', 'url(#clipCircle)');
}

d3.json('data/movies-with-most-women-actors.json').then(data => {
  drawBubblePlot('.movies-with-most-women-actors', data)
});

d3.json('data/movies-with-most-man-actors.json').then(data => {
  drawBubblePlot('.movies-with-most-man-actors', data)
});
