import {
  createLinksAndNodes,
  ticked,
  dragstart,
  dragged,
  dragend,
} from './network/utils.min.js';
import { handleResize } from './network/responsive.min.js';

const networkData = JSON.parse(
  document.getElementById('network-data').textContent
);

function visualiseNetwork(graph) {
  const svg = d3.select('svg');

  const zoom = d3.zoom().scaleExtent([0.1, 5]).duration(100).on('zoom', zoomed);

  const container = svg.append('g');

  const { link, node } = createLinksAndNodes(container, graph);

  const simulation = d3
    .forceSimulation(graph.nodes)
    .force('link', d3.forceLink().links(graph.links))
    .force('charge', d3.forceManyBody().strength(-300))
    .force(
      'center',
      d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2)
    )
    .on('tick', () => ticked(link, node));

  handleResize(simulation, svg);

  svg.call(zoom);

  node.call(
    d3
      .drag()
      .on('start', (e, d) => dragstart(e, d, simulation))
      .on('drag', dragged)
      .on('end', (e, d) => dragend(e, d, simulation))
  );

  window.addEventListener('resize', () => handleResize(simulation, svg));

  function zoomed(event) {
    container.attr('transform', event.transform);
    ticked(link, node);
  }
}

visualiseNetwork(networkData);
