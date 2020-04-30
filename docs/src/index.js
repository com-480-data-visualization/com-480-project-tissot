const color = d3.scaleOrdinal(d3.schemeSet1);

const width = 1000
const height = 500

const release_year = 2020

d3.json('data/timeline.json').then(data => {
  data = data[release_year];

  const mx = 100;
  const my = 100;

  const svg = d3.select('.svg-timeline')
    .attr('viewBox', [-mx, -my, width + 2*mx, height + 2*my]);
  
  const max_budget = Math.max.apply(Math, data.map(o => o.budget))
  const max_revenue = Math.max.apply(Math, data.map(o => o.revenue))
  const max_popularity = Math.max.apply(Math, data.map(o => o.popularity))

  var x = d3.scaleLinear()
    .domain([0, max_budget])
    .range([0, width]);
  svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

  var y = d3.scaleLinear()
    .domain([0, max_revenue])
    .range([height, 0]);
  svg.append('g')
    .call(d3.axisLeft(y));

  var r = d3.scaleLinear()
    .domain([0, max_popularity])
    .range([2, 16]);

  svg.append('g')
    .selectAll('dot')
    .data(data).enter()
      .append('circle')
      .attr('cx', d => x(d.budget))
      .attr('cy', d => y(d.revenue))
      .attr('r', d => r(d.popularity))
      .style('fill', d => d.gender_lead == 'Male' ? '#00f' : '#f00')
});

function drawWordCloud(selector, data) {
  data = data[release_year];

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

d3.json('data/male-lead-role.json').then(data => {
  drawWordCloud('.svg-male-lead-role', data)
});

d3.json('data/female-lead-role.json').then(data => {
  drawWordCloud('.svg-female-lead-role', data)
});

d3.json('data/community.json').then(data => {
  data = data[release_year];

  const max = Math.max.apply(Math, data.links.map(o => o.value))

  const scale = d3.scaleLinear()
    .domain([0, max])
    .range([0, 10]);

  const svg = d3.select('.svg-community')
    .attr('viewBox', [0, 0, width, width]);
  
  const simulation = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links).id(d => d.id))
    .force('charge', d3.forceManyBody().strength(-10))
    .force('center', d3.forceCenter(0.5 * width, 0.5 * width));

  const link = svg.append('g')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .selectAll('line')
    .data(data.links)
    .enter().append('line')
      .attr('stroke-width', d => scale(d.value));

  const node = svg.append('g')
    .selectAll('g')
    .data(data.nodes)
    .enter().append('g')
  
  node.append('circle')
    .attr('stroke', '#000')
    .attr('stroke-width', 2)
    .attr('r', 10)
    .attr('fill', d => d.gender == 'Male' ? '#00f' : '#f00')
    .attr('stroke', d => d.director == true ? 'black' : 'white')
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