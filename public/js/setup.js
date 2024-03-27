function createSimulation(nodes, links, width, height) {
  return d3
    .forceSimulation(nodes)
    .force("link", d3.forceLink().links(links))
    .force('charge', d3.forceManyBody().strength(-(0.25 * width)))
    .force('center', d3.forceCenter(width / 2, height / 2));
};
function createSvg(numGraphs, idx) {
  const networkContainer = d3.select('.network-container');

  const rect = networkContainer.node().getBoundingClientRect();
  const width = rect.width / numGraphs;
  const height = rect.height;
  

  return networkContainer
    .append('svg')
    .attr('id', `svg-${idx}`)
    .attr("width", width)
    .attr("height", height);
};
function createLinksAndNodes(container, links, nodes) {
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  
  const link = container
    .append('g')
    .selectAll('line')
    .data(links)
    // .enter().append("line")
    .join("line")
    .attr('class', 'link');
    
  const node = container
    .append('g')
    .selectAll('circle')
    .data(nodes)
    // .enter().append("circle")
    .join("circle")
    .attr("r", 5)
    .attr('class', 'node')
    .attr('fill', d => color(d.group));

  const texts = container
    .append('g')
    .selectAll('text')
    .data(nodes)
    .enter().append('text')
    .attr('class', 'texts')
    .style("pointer-events", "none");
    // .text(d => d.label);

  return { link, node, texts };
};
function ticked(link, node, texts) {
  texts
    .attr('x', d => d.x)
    .attr('y', d => d.y-7);

  link
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);

  node
    .attr('cx', d => d.x)
    .attr('cy', d => d.y);
};
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
};
function createZoom(link, node, texts, container) {
  function zoomed(event) {
    const transform = event.transform;
    node.style('stroke-width', 2 / transform.k);
    link.style('stroke-width', 2 / transform.k);
    texts.style('font-size', 18 / transform.k);
    container.attr('transform', transform);
    ticked(link, node, texts);
  }

  return d3
    .zoom()
    .scaleExtent([0.1, 5])
    .duration(100)
    .on('zoom', zoomed);
};
function handleResize(networkData, simulation) {
  networkData.forEach((graph, idx) => {
    const svg = d3.select(`#svg-${idx}`);
    const rect = svg.node().getBoundingClientRect();
    const width = rect.width / 2;
    const height = rect.height / 2;

    simulation
      .force('center', d3.forceCenter(width, height))
      .force('charge', d3.forceManyBody().strength(-0.25 * width))
      .alpha(0.5)
      .restart();
  });
};
function addAttributes(nodes, links) {
  // creates array of links attribute for each node
  nodes.forEach(node => {
    node.links = links.filter(link => link.source._id === node._id || link.target._id === node._id);
    const nodeDegree = node.links.length;

    if (nodeDegree >= 10 && nodeDegree < 20) {
      node.group = 1;
    } else if (nodeDegree >= 20 && nodeDegree < 30) {
      node.group = 2;
    } else if (nodeDegree >= 30 && nodeDegree < 40) {
      node.group = 3;
    } else if (nodeDegree >= 40 && nodeDegree < 50) {
      node.group = 4;
    } else if (nodeDegree >= 50 && nodeDegree < 60) {
      node.group = 5;
    } else if (nodeDegree >= 60) {
      node.group = 6;
    } else {
      node.group = 0;
    }

  });
};
function initialiseConstants(graph, numGraphs) {
  const links = graph.links.map(d => ({...d}));
  const nodes = graph.nodes.map(d => ({...d}));
  const width = window.innerWidth / numGraphs;
  const height = window.innerHeight;

  return [nodes, links, width, height];
};
function setup(nodes, links, width, height, numGraphs, idx) {
  const simulation = createSimulation(nodes, links, width, height);
  const svg = createSvg(numGraphs, idx);
  const container = svg.append('g');
  addAttributes(nodes, links);
  const { link, node, texts } = createLinksAndNodes(container, links, nodes);
  svg.call(createZoom(link, node, texts, container));
  simulation.on('tick', () => ticked(link, node, texts));
  node.call(drag(simulation));

  return [simulation, svg, container, link, node, texts];
};

export { initialiseConstants, setup, handleResize };