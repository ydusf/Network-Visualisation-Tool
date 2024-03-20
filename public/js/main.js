import { depthFirstTraversal, breadthFirstTraversal } from './analytics/searching.js';
import { drag, createLinksAndNodes, ticked, handleResize } from './network/setup.js';

const networkLinkColor = {
  'graph-0': ['white', '#12E1B9'],
  'graph-1': ['#4285F4', '#9C27B0'],
};

function visualiseNetwork(networkData) {
  d3.selectAll('svg').remove();

  networkData.forEach((graph, idx) => {
    const height = window.innerHeight;
    const width = window.innerWidth / networkData.length;
    let startNode = null;
    let endNode = null;

    graph.nodes.forEach(node => {
      node.links = graph.links.filter(link => link.source === node || link.target === node);
    });

    console.log(graph.nodes);
    console.log(graph.links);

    const avgDegree = d3.mean(graph.nodes, d => d.links.length);
    // var numComponents = calculateComponents(nodes); // You'll need to implement this
    const maxDegreeNode = graph.nodes.reduce((a, b) => a.links.length > b.links.length ? a : b);

    const svg = d3
      .select('.network-container')
      .append('svg')
      .attr('id', `svg-${idx}`)
      .attr('width', width)
      .attr('height', height);

    const container = svg.append('g');
    const { link, node, texts } = createLinksAndNodes(container, graph);

    svg.append('text')
      .attr('x', 90)
      .attr('y', 20)
      .text('Average Degree: ' + avgDegree.toFixed(2))
      .attr('fill', 'rgb(18, 225, 185)');
  
    // svg.append('text')
    //     .attr('x', 10)
    //     .attr('y', 40)
    //     .text('Number of Connected Components: ' + numComponents);

    function zoomed(event) {
      let transform = event.transform;
      node
        .attr('r', 5 / transform.k)
        .style('stroke-width', 2 / transform.k);
      link.style('stroke-width', 2 / transform.k);
      texts.style('font-size', 12 / transform.k);
      container.attr('transform', transform);
      ticked(link, node, texts);
    }

    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 5])
      .duration(100)
      .on('zoom', zoomed);
    svg.call(zoom);
    
    link.style('stroke', networkLinkColor[`graph-${idx}`][0]);
    node
      .on('click', function(event, d) {
        if (startNode === null) {
          startNode = d;
          d3.select(this).style('fill', 'green');
        } else if (endNode === null) {
          endNode = d;
          d3.select(this).style('fill', 'red');
        }
      })
      .style('fill', networkLinkColor[`graph-${idx}`][1]);

    const simulation = d3
      .forceSimulation(graph.nodes)
      .force('link', d3.forceLink().links(graph.links))
      .force('charge', d3.forceManyBody().strength(-(0.25 * width)))
      .force('center', d3.forceCenter(width / 2, height / 2))  
      .on('tick', () => ticked(link, node, texts));

    node.call(drag(simulation));

    window.addEventListener('resize', () =>
      handleResize(networkData, simulation)
    );

    window.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' && startNode !== null && endNode !== null) {
        depthFirstTraversal(startNode, endNode, graph, link, node);
      } else if(event.key === 'f' && startNode !== null && endNode !== null) {
        breadthFirstTraversal(startNode, endNode, graph, link, node);
      }
    });
  });
}

// function filterNodesByOrder(nodes) {
//   console.log('filterNodesByOrder function called.'); // Add this line
//   nodes.forEach(node => {
//     if (node.order > 3) {
//       node.color = 'red'; // Example color
//     }
//   });
// }

// document.addEventListener('DOMContentLoaded', function() {
//   const filterButton = document.getElementById('filter-button');

//   if (filterButton) {
//     filterButton.addEventListener('click', function(event) {
//       event.preventDefault();

//       networkData.forEach(graph => {
//         filterNodesByOrder(graph.nodes);
//       });

//       visualiseNetwork(networkData);
//     });
//   } else {
//     console.error('Filter button not found!');
//   }
// });

document.addEventListener('DOMContentLoaded', function() {
  const networkData = JSON.parse(document.getElementById('network-data').textContent);
  console.log(`Network data from HTML: ${networkData}`);
  console.log(networkData);
  visualiseNetwork(networkData);
});