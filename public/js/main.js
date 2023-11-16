import { loadData } from "./network/dataLoader.js";
import {
  createLinksAndNodes,
  ticked,
  dragstart,
  dragged,
  dragend,
} from "./network/utils.js";
import { handleResize } from "./network/responsive.js";
const dataFilePath = "/data/data.json";
function visualiseNetwork(graph, subset) {
  const svg = d3.select("svg");
  const { link, node } = createLinksAndNodes(svg, graph, subset);
  const simulation = d3
    .forceSimulation(graph.nodes)
    .force("link", d3.forceLink().links(graph.links))
    .force("charge", d3.forceManyBody().strength(-300))
    .force(
      "center",
      d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2)
    )
    .on("tick", () => ticked(link, node));
  handleResize(simulation, svg);
  node.call(
    d3
      .drag()
      .on("start", (e, d) => dragstart(e, d, simulation))
      .on("drag", dragged)
      .on("end", (e, d) => dragend(e, d, simulation))
  );
  window.addEventListener("resize", () => handleResize(simulation, svg));
}
loadData(dataFilePath)
  .then(function (data) {
    const popular = ["ANAKIN"];
    visualiseNetwork(data, popular);
  })
  .catch((error) => {
    console.error("Error fetching or converting the file:", error);
  });
