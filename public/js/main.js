import { createLinksAndNodes, ticked, drag } from './network/utils.min.js';
import { handleResize } from './network/responsive.min.js';

const networkData = JSON.parse(
  document.getElementById('network-data').textContent
);

console.log(networkData);

const networkLinkColours = {
  'graph-0': ['white', '#12E1B9'],
  'graph-1': ['#4285F4', '#9C27B0'],
};

function visualiseNetwork(networkData) {
  networkData.forEach((graph, idx) => {
    const height = window.innerHeight;
    const width = window.innerWidth;
    const svg = d3.selectAll('svg');

    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 5])
      .duration(100)
      .on('zoom', zoomed);

    const container = svg.append('g');

    const { link, node } = createLinksAndNodes(container, graph);

    link.style('stroke', networkLinkColours[`graph-${idx}`][0]);
    node.style('fill', networkLinkColours[`graph-${idx}`][1]);

    const simulation = d3
      .forceSimulation(graph.nodes)
      .force('link', d3.forceLink().links(graph.links))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .on('tick', () => ticked(link, node));

    // Assigns parent, children, height, depth, etc..
    const root = d3.hierarchy(graph);
    const nodesCHECK = root.descendants();

    console.log(root);
    console.log(nodesCHECK);

    // console.log(nodesCHECK);
    // console.log(root);
    // console.log(linksCHECK);

    svg.attr('width', width).attr('height', height).call(zoom);
    // .on('click', function (event) {
    //   const [zoomX, zoomY] = d3
    //     .zoomTransform(svg.node())
    //     .invert([event.offsetX, event.offsetY]);
    //   graph.nodes.push({ x: zoomX, y: zoomY });
    //   const newNode = svg
    //     .select('g')
    //     .selectAll('.node')
    //     .data(graph.nodes)
    //     .enter()
    //     .append('circle')
    //     .attr('class', 'node')
    //     .attr('r', 6)
    //     .attr('cx', d => d.x)
    //     .attr('cy', d => d.y);
    //   node.merge(newNode);
    //   simulation.nodes(graph.nodes);
    //   simulation.alpha(1).restart();
    // });

    node.call(drag(simulation));
    // handleResize(simulation, svg);
    window.addEventListener('resize', () => handleResize(simulation, svg));

    function zoomed(event) {
      container.attr('transform', event.transform);
      ticked(link, node);
    }
  });
}

visualiseNetwork(networkData);
