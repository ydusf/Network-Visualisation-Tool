export function drag(simulation) {
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

export function createLinksAndNodes(svg, graph) {
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

export function ticked(link, node) {
  link
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);

  node.attr('cx', d => d.x).attr('cy', d => d.y);
}
