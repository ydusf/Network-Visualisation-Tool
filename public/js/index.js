let svg = d3.select("svg");
let width = svg.attr("width");
let height = svg.attr("height");

let graph = {
  nodes: [
    { name: "Olivia" },
    { name: "Amelia" },
    { name: "Isla" },
    { name: "Ava" },
    { name: "Mia" },
    { name: "Ivy" },
    { name: "Lily" },
    { name: "Isabella" },
    { name: "Rosie" },
    { name: "Sophia" },
    { name: "Grace" },
    { name: "Willow" },
    { name: "Freya" },
    { name: "Florence" },
    { name: "Emily" },
    { name: "Ella" },
    { name: "Poppy" },
    { name: "Evie" },
    { name: "Elsie" },
    { name: "Charlotte" },
    { name: "Evelyn" },
    { name: "Sienna" },
    { name: "Sofia" },
    { name: "Daisy" },
    { name: "Phoebe" },
    { name: "Sophie" },
    { name: "Alice" },
    { name: "Harper" },
    { name: "Matilda" },
    { name: "Ruby" },
    { name: "Emilia" },
    { name: "Maya" },
    { name: "Millie" },
    { name: "Isabelle" },
    { name: "Eva" },
    { name: "Luna" },
    { name: "Jessica" },
    { name: "Ada" },
    { name: "Aria" },
    { name: "Arabella" },
    { name: "Maisie" },
    { name: "Esme" },
    { name: "Eliza" },
    { name: "Penelope" },
    { name: "Bonnie" },
    { name: "Chloe" },
    { name: "Mila" },
    { name: "Violet" },
    { name: "Hallie" },
    { name: "Scarlett" },
    { name: "Layla" },
    { name: "Imogen" },
    { name: "Eleanor" },
    { name: "Molly" },
    { name: "Harriet" },
    { name: "Elizabeth" },
    { name: "Thea" },
    { name: "Erin" },
    { name: "Lottie" },
    { name: "Emma" },
    { name: "Rose" },
    { name: "Delilah" },
    { name: "Bella" },
    { name: "Aurora" },
    { name: "Lola" },
    { name: "Nancy" },
    { name: "Ellie" },
    { name: "Mabel" },
    { name: "Lucy" },
    { name: "Maria" },
    { name: "Ayla" },
    { name: "Orla" },
    { name: "Zara" },
    { name: "Robyn" },
    { name: "Hannah" },
    { name: "Gracie" },
    { name: "Iris" },
    { name: "Jasmine" },
    { name: "Darcie" },
    { name: "Margot" },
    { name: "Holly" },
    { name: "Amelie" },
    { name: "Amber" },
    { name: "Georgia" },
    { name: "Edith" },
    { name: "Maryam" },
    { name: "Abigail" },
    { name: "Myla" },
    { name: "Anna" },
    { name: "Clara" },
    { name: "Lilly" },
    { name: "Lyra" },
    { name: "Summer" },
    { name: "Maeve" },
    { name: "Heidi" },
    { name: "Elodie" },
    { name: "Lyla" },
    { name: "Eden" },
    { name: "Olive" },
    { name: "Aisha" },
  ],
};

graph.links = generateLinks(graph.nodes);

function generateLinks(nodes) {
  let links = [];

  for (let i = 0; i < nodes.length; i += 1) {
    for (
      let j = i + 1;
      j < nodes.length;
      j += Math.trunc(Math.random() * nodes.length)
    ) {
      links.push({ source: nodes[i].name, target: nodes[j].name });
    }
  }

  return links;
}
const dataFilePath = "/js/data.json";

// d3.json(dataFilePath).then(function (graph) {
let simulation = d3
  .forceSimulation(graph.nodes)
  .force(
    "link",
    d3
      .forceLink()
      .id((d) => d.name)
      .links(graph.links)
  )

  .force("charge", d3.forceManyBody().strength(-50))
  .force("center", d3.forceCenter(width / 2, height / 2))
  .on("tick", ticked);

let link = svg
  .append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(graph.links)
  .enter()
  .append("line")
  .attr("stroke-width", (d) => 3)
  .style("stroke", "#1C2E57");

let node = svg
  .append("g")
  .selectAll("circle")
  .data(graph.nodes)
  .enter()
  .append("circle")
  .attr("r", 6)
  .attr("fill", (d) => "#68DEBB")
  .attr("stroke", "white");

function ticked() {
  link
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
}
// });
