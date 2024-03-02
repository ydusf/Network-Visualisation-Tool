function handleResize(networkData, simulation) {
  networkData.forEach((graph, idx) => {
    const svg = d3.select(`#svg-${idx}`);
    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    simulation
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('charge', d3.forceManyBody().strength(-0.25 * width));

    simulation.alpha(0.5).restart();
  });
}

function drag(simulation) {
  function dragstart(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragend(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3
    .drag()
    .on('start', dragstart)
    .on('drag', dragged)
    .on('end', dragend);
}

function createLinksAndNodes(svg, graph) {
  const link = svg
    .append('g')
    .selectAll('line')
    .data(graph.links)
    .join('line')
    .attr('class', 'link');

  const node = svg
    .append('g')
    .selectAll('circle')
    .data(graph.nodes)
    .join('circle')
    .attr('class', 'node')
    .attr('r', 6);

  return { link, node };
}

function ticked(link, node) {
  link
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);

  node.attr('cx', d => d.x).attr('cy', d => d.y);
}

const networkLinkColours = {
  'graph-0': ['white', '#12E1B9'],
  'graph-1': ['#4285F4', '#9C27B0'],
};

function visualiseNetwork(networkData) {
  networkData.forEach((graph, idx) => {
    const height = window.innerHeight;
    const width = window.innerWidth / networkData.length;
    const svg = d3
      .select('.network-container')
      .append('svg')
      .attr('id', `svg-${idx}`)
      .attr('width', width)
      .attr('height', height);

    const container = svg.append('g');

    function zoomed(event) {
      container.attr('transform', event.transform);
      ticked(link, node);
    }
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 5])
      .duration(100)
      .on('zoom', zoomed);
    svg.call(zoom);

    const { link, node } = createLinksAndNodes(container, graph);

    link.style('stroke', networkLinkColours[`graph-${idx}`][0]);
    node.style('fill', networkLinkColours[`graph-${idx}`][1]);

    const simulation = d3
      .forceSimulation(graph.nodes)
      .force('link', d3.forceLink().links(graph.links))
      .force('charge', d3.forceManyBody().strength(-0.25 * width))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .on('tick', () => ticked(link, node));

    node.call(drag(simulation));

    window.addEventListener('resize', () =>
      handleResize(networkData, simulation)
    );
  });
}

const networkData = JSON.parse(
  document.getElementById('network-data').textContent
);

visualiseNetwork(networkData);
