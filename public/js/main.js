function handleResize(networkData, simulation) {
  networkData.forEach((graph, idx) => {
    const svg = d3.select(`#svg-${idx}`);
    const width = svg.node().getBoundingClientRect().width / 2;
    const height = svg.node().getBoundingClientRect().height / 2;

    simulation
      .force('center', d3.forceCenter(width, height))
      .force('charge', d3.forceManyBody().strength(-0.25 * width))
      .alpha(0.5)
      .restart();
  });
}

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
}

function createLinksAndNodes(svg, graph) {

  const link = svg
    .append('g')
    .selectAll('line')
    .data(graph.links)
    .join('line')
    .attr('class', 'link');

  const node = svg
    .append('g')
    .selectAll('circle')
    .data(graph.nodes)
    .join('circle')
    .attr('class', 'node')
    .attr('r', 6);

  return { link, node };
}

function ticked(link, node) {
  link
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);

  node.attr('cx', d => d.x).attr('cy', d => d.y);
}

async function depthFirstTraversal(start, end, graph, link, node) {
  let visited = {};
  let stack = [];
  let prevNode = null;

  stack.push(start);

  console.log(start);
  console.log(end);

  while (stack.length > 0) {

    const curNode = stack.pop();
    const curNodeId = curNode._id;


    if (!visited[curNodeId]) {
      await new Promise(resolve => setTimeout(resolve, 250));
      visited[curNodeId] = true;

      node
        .filter(d => d === curNode && d !== start && d !== end)
        .style('fill', 'black');
      link
        .filter(d => d.source === curNode || d.target === curNode)
        .style('stroke', 'yellow');
      
      if (prevNode) {
        link
          .filter(d => (d.source === prevNode && d.target === curNode) || (d.source === curNode && d.target === prevNode))
          .style('stroke', 'red');
      }

      if (curNodeId === end._id) {
        console.log('FOUND');
        return true;
      }

      const neighbors = graph.links
        .filter(d => d.source === curNode || d.target === curNode)
        .map(d => (d.source === curNode ? d.target : d.source));

      neighbors.forEach(neighbor => {
        if (!visited[neighbor._id]) {
          stack.push(neighbor);
        }
      });

      prevNode = curNode;
    }
  }

  return false;
}

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

    const svg = d3
      .select('.network-container')
      .append('svg')
      .attr('id', `svg-${idx}`)
      .attr('width', width)
      .attr('height', height);

    const container = svg.append('g');

    function zoomed(event) {
      // let transform = event.transform;
      // node.attr("r", 6 / transform.k);
      // link.style("stroke-width", 1 / transform.k);
      container.attr('transform', event.transform);
      ticked(link, node);
    }
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 5])
      .duration(100)
      .on('zoom', zoomed);
    svg.call(zoom);

    const { link, node } = createLinksAndNodes(container, graph);
    
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
      .on('tick', () => ticked(link, node));

    node.call(drag(simulation));

    window.addEventListener('resize', () =>
      handleResize(networkData, simulation)
    );

    window.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' && startNode !== null && endNode !== null) {
        depthFirstTraversal(startNode, endNode, graph, link, node);
      }
    });
  });
}

// function filterNodesByOrder(nodes) {
//   console.log("filterNodesByOrder function called."); // Add this line
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
//     console.error("Filter button not found!");
//   }
// });

document.addEventListener('DOMContentLoaded', function() {
  const networkData = JSON.parse(document.getElementById('network-data').textContent);
  console.log(networkData);
  visualiseNetwork(networkData);
});