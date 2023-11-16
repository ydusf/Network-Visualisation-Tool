export function handleResize(simulation, svg) {
  console.log("Handling resize...");
  simulation.force(
    "center",
    d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2)
  );
  svg.attr("width", window.innerWidth).attr("height", window.innerHeight);
}
