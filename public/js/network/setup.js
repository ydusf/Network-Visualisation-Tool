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
    .enter().append("line")
    .attr('class', 'link');

  const node = svg
    .append('g')
    .selectAll('circle')
    .data(graph.nodes)
    .enter().append("circle")
    .attr("r", 5)
    .attr('class', 'node');

  const texts = svg
    .append('g')
    .selectAll('text')
    .data(graph.nodes)
    .enter().append('text')
    .attr('class', 'texts')
    .style("pointer-events", "none")
    .text(d => d.label);

  return { link, node, texts };
}

function ticked(link, node, texts) {
  texts
    .attr('x', d => d.x)
    .attr('y', d => d.y-7);

  link
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);

  node.attr('cx', d => d.x).attr('cy', d => d.y);
}

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
}

export { drag, createLinksAndNodes, ticked, handleResize };