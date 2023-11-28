export function handleResize(simulation, svg) {
  console.log(window.innerWidth);
  simulation
    .force("charge", d3.forceManyBody().strength(-(window.innerWidth * 0.25)))
    .force(
      "center",
      d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2)
    );
  simulation.restart();

  svg.attr("width", window.innerWidth).attr("height", window.innerHeight);
}
