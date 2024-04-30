import netClustering from "netclustering";

function createSimulation(nodes, links, width, height) {
  const numberOfNodes = nodes.length;
  const maxForceStrength = (8500 / numberOfNodes);
  const forceStrength = -maxForceStrength;

  return d3
    .forceSimulation(nodes)
    .force("link", d3.forceLink(links))
    .force('charge', d3.forceManyBody().strength(forceStrength))
    .force('center', d3.forceCenter(width / 2, height / 2));
};
function createSvg(numGraphs, idx) {
  const networkContainer = d3.select('.network-container');

  const rect = networkContainer.node().getBoundingClientRect();
  const width = rect.width / numGraphs;
  const height = rect.height;

  const svg = networkContainer
    .append('svg')
    .attr('class', 'export-svg')
    .attr('id', `svg-${idx}`)
    .attr("width", width)
    .attr("height", height);

  return svg;
};
function createLinksAndNodes(container, links, nodes) {

  const link = container
    .append('g')
    .selectAll('line')
    .data(links)
    .join("line")
    .attr('class', 'link')
    .attr("marker-end", "url(#arrow)");

  const node = container
    .append('g')
    .selectAll('circle')
    .data(nodes)
    .join("circle")
    .attr("r", 5)
    .attr('class', 'node')
    .attr('fill', 'rgb(18, 225, 185)');

  return { link, node };
};
function ticked(link, node) {
  d3.selectAll('.texts')
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
function createZoom(link, node, container) {
  function zoomed(event) {
    const transform = event.transform;
    node.style('stroke-width', 2 / transform.k);
    node.style('r', 5 / transform.k);
    link.style('stroke-width', 1 / transform.k);
    d3.selectAll('.texts').style('font-size', 18 / transform.k);
    d3.selectAll('.arrows')
    .style('stroke-width', 12 / transform.k)
    .style('width', 12 / transform.k);
    container.attr('transform', transform);
    ticked(link, node);
  }

  return d3
    .zoom()
    .scaleExtent([0.1, 10])
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
function groupArrays(nodes, links, maxDepth) {
  const groups = netClustering.cluster(nodes, links);
  const hashMap = {};
  let index = 0;

  function traverseArray(groups, depth) {
    groups.forEach((elem) => {
      if (Array.isArray(elem) && depth < maxDepth) {
        traverseArray(elem, depth + 1);
      } else {
        if (!hashMap[index]) {
          hashMap[index] = [];
        }
        hashMap[index].push(elem);
      }
    });
    index++;
  }

  traverseArray(groups, 0);

  for (const key in hashMap) {
    if (Object.hasOwnProperty.call(hashMap, key)) {
      const group = hashMap[key].flat(Infinity);
      for(const idx in group) {
        const curElem = group[idx];
        const nodeIdx = Number(curElem);
        nodes[nodeIdx].cluster = key;
      };
    }
  }
}
function addAttributes(nodes, links) {
  groupArrays(nodes, links, 1);

  nodes.forEach(node => {
    node.links = links.filter(link => link.source._id === node._id || link.target._id === node._id);
    const nodeDegree = node.links.length;

    if (nodeDegree < 10) {
      node.group = 0;
    } else {
      node.group = Math.floor((nodeDegree - 1) / 10) + 1;
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
  const { link, node } = createLinksAndNodes(container, links, nodes);
  svg.call(createZoom(link, node, container));
  simulation.on('tick', () => ticked(link, node));
  node.call(drag(simulation));

  return [simulation, svg, container, link, node];
};

export { initialiseConstants, setup, handleResize };