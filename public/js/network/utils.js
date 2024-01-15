export function dragstart(e, d, simulation) {
  if (!e.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

export function dragged(e, d) {
  d.fx = e.x;
  d.fy = e.y;
}

export function dragend(e, d, simulation) {
  if (!e.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

export function createLinksAndNodes(svg, graph, subset) {
  const link = svg
    .append("g")
    .attr("class", "link")
    .selectAll("line")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("marker-end", "url(#arrowhead)");
  const node = svg
    .append("g")
    .selectAll("circle")
    .data(graph.nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 6)
    .style("fill", (d) => (subset.includes(d.id) ? "red" : null));
  return { link: link, node: node };
}

export function ticked(link, node) {
  link
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);
  node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
}