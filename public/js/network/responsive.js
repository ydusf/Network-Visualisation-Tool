export function handleResize(simulation, svg, width, height) {
  simulation
    .force('charge', d3.forceManyBody().strength(-(width * 0.25)))
    .force('center', d3.forceCenter(height / 2, height / 2));
  simulation.restart();

  svg.attr('width', height).attr('height', height);
}
