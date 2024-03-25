function createSimulation(nodes, links, width, height) {
  return d3
    .forceSimulation(nodes)
    .force("link", d3.forceLink().links(links))
    .force('charge', d3.forceManyBody().strength(-(0.25 * width)))
    .force('center', d3.forceCenter(width / 2, height / 2));
};
function createSvg(numGraphs, idx) {
  const networkContainer = d3.select('.network-container');

  const rect = networkContainer.node().getBoundingClientRect();
  const width = rect.width / numGraphs;
  const height = rect.height;
  

  return networkContainer
    .append('svg')
    .attr('id', `svg-${idx}`)
    .attr("width", width)
    .attr("height", height);
};
function createLinksAndNodes(container, links, nodes) {
  const link = container
    .append('g')
    .selectAll('line')
    .data(links)
    // .enter().append("line")
    .join("line")
    .attr('class', 'link');
    
  const node = container
    .append('g')
    .selectAll('circle')
    .data(nodes)
    // .enter().append("circle")
    .join("circle")
    .attr("r", 5)
    .attr('class', 'node');

  const texts = container
    .append('g')
    .selectAll('text')
    .data(nodes)
    .enter().append('text')
    .attr('class', 'texts')
    .style("pointer-events", "none");
    // .text(d => d.label);

  return { link, node, texts };
};
function ticked(link, node, texts) {
  texts
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
function createZoom(link, node, texts, container) {
  function zoomed(event) {
    const transform = event.transform;
    node.style('stroke-width', 2 / transform.k);
    link.style('stroke-width', 2 / transform.k);
    texts.style('font-size', 18 / transform.k);
    container.attr('transform', transform);
    ticked(link, node, texts);
  }

  return d3
    .zoom()
    .scaleExtent([0.1, 5])
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
function addAttributes(nodes, links) {
  // creates array of links attribute for each node
  nodes.forEach(node => {
    node.links = links.filter(link => link.source._id === node._id || link.target._id === node._id);
  });
};
async function timedExecution(callback, delay, timerText) {
  let elapsed = 0;

  const t = d3.timer(async () => {
    const shouldContinue = await callback();

    if (!shouldContinue) {
      t.stop();
    } else {
      elapsed += 1;
      timerText.text(`Time Elapsed: ${elapsed} checks`);
    }
  }, delay);
}
async function breadthFirstTraversal(start, end, links, link, node, timerText) {
  let visited = {};
  let queue = [];
  let prevNode = {};

  queue.push(start);

  await timedExecution(async () => {
    while(queue.length > 0) {
      const curNode = queue.shift();
      const curNodeId = curNode._id;

      if (!visited[curNodeId]) {
        visited[curNodeId] = true;

        node
          .filter(d => d === curNode && d !== start && d !== end)
          .style('fill', '#3357FF');
        
        if (prevNode[curNodeId]) {
          link
            .filter(d => (d.source._id === prevNode[curNodeId] && d.target._id === curNodeId) || (d.source._id === curNodeId && d.target._id === prevNode[curNodeId]))
            .style('stroke', 'green')
            .style('stroke-width', 4)
            .style('stroke-opacity', '1');
        }

        if (curNodeId === end._id) {
          console.log('FOUND');
          return false;
        }

        const neighbors = links
          .filter(d => d.source === curNode || d.target === curNode)
          .map(d => (d.source === curNode ? d.target : d.source));

        neighbors.forEach(neighbor => {
          if (!visited[neighbor._id]) {
            queue.push(neighbor);
            prevNode[neighbor._id] = curNodeId;
          }
        });

        return true;
      }
    }

    return false;
  }, 25, timerText);
};
async function depthFirstTraversal(start, end, links, link, node, timerText) {
  let visited = {};
  let stack = [];
  let prevNode = {};

  stack.push(start);

  await timedExecution(async () => {
    while(stack.length > 0) {
      const curNode = stack.pop();
      const curNodeId = curNode._id;

      if (!visited[curNodeId]) {
        visited[curNodeId] = true;

        node
          .filter(d => d === curNode && d !== start && d !== end)
          .style('fill', '#3357FF');
        // link
        //   .filter(d => d.source._id === curNode || d.target._id === curNode)
        //   .style('stroke', 'yellow');
        
        if (prevNode[curNodeId]) {
          link
            .filter(d => (d.source._id === prevNode[curNodeId] && d.target._id === curNodeId) || (d.source._id === curNodeId && d.target._id === prevNode[curNodeId]))
            .style('stroke', 'red')
            .style('stroke-width', 4)
            .style('stroke-opacity', '1');
        }

        if (curNodeId === end._id) {
          console.log('FOUND');
          return true;
        }

        const neighbors = links
          .filter(d => d.source === curNode || d.target === curNode)
          .map(d => (d.source === curNode ? d.target : d.source));

        neighbors.forEach(neighbor => {
          if (!visited[neighbor._id]) {
            stack.push(neighbor);
            prevNode[neighbor._id] = curNodeId;
          }
        });

        return true;
      }
    }

    return false;
  }, 25, timerText);
};
async function aStarTraversal(start, end, links, link, node, textTimer) {
  let openList = [];
  let closedList = {};
  let prevNode = {};
  let gScore = {};
  let fScore = {};

  gScore[start._id] = 0;
  fScore[start._id] = 1;

  openList.push(start);

  await timedExecution(async () => {
    while (openList.length > 0) {
      openList.sort((a, b) => fScore[a._id] - fScore[b._id]);
      const curNode = openList.shift();
      const curNodeId = curNode._id;

      node
        .filter(d => d === curNode && d !== start && d !== end)
        .style('fill', '#3357FF');

      if(prevNode[curNodeId]) {
        link
          .filter(d => (d.source._id === prevNode[curNodeId] && d.target._id === curNodeId) || (d.source._id === curNodeId && d.target._id === prevNode[curNodeId]))
          .style('stroke', 'yellow')
          .style('stroke-width', 4)
          .style('stroke-opacity', '1');
      };

      if (curNodeId === end._id) {
        console.log('FOUND');
        return true;
      }

      closedList[curNodeId] = true;

      const neighbors = links
        .filter(d => d.source === curNode || d.target === curNode)
        .map(d => (d.source === curNode ? d.target : d.source));

      neighbors.forEach(neighbor => {
        if (closedList[neighbor._id]) {
          return;
        }

        const tentativeGScore = gScore[curNodeId] + 1;

        if (!openList.includes(neighbor)) {
          openList.push(neighbor);
        } else if (tentativeGScore >= gScore[neighbor._id]) {
          return;
        }

        prevNode[neighbor._id] = curNodeId;
        gScore[neighbor._id] = tentativeGScore;
        fScore[neighbor._id] = gScore[neighbor._id] + 1;
      });

      return true;
    }

    return false;
  }, 25, textTimer);
};
function initialiseConstants(graph, numGraphs) {
  const links = graph.links.map(d => ({...d}));
  const nodes = graph.nodes.map(d => ({...d}));
  const width = window.innerWidth / numGraphs;
  const height = window.innerHeight;
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  return [nodes, links, width, height, color];
};
function setup(nodes, links, width, height, numGraphs, idx) {
  const simulation = createSimulation(nodes, links, width, height);
  const svg = createSvg(numGraphs, idx);
  const container = svg.append('g');
  addAttributes(nodes, links);
  const { link, node, texts } = createLinksAndNodes(container, links, nodes);

  return [simulation, svg, container, link, node, texts];
};
function setupMetrics(svg, nodes) {
  const avgDegree = d3.mean(nodes, d => d.links.length);
  const maxNode = nodes.reduce((a, b) => a.links.length > b.links.length ? a : b);
  
  const avgDegreeText = svg.append('text')
    .attr('x', 10)
    .attr('y', 20)
    .text('Average Degree: ' + avgDegree.toFixed(2))
    .attr('fill', 'rgb(18, 225, 185)');
  const maxNodeText = svg.append('text')
    .attr('x', 10)
    .attr('y', 40)
    .text(`Max Degree Node: ${maxNode.links.length} (${maxNode.label})`)
    .attr('fill', 'rgb(18, 225, 185)');
  const timerText = svg.append('text')
    .attr('x', 10)
    .attr('y', 60)
    .text('Time Elapsed: 0')
    .attr('fill', 'rgb(18, 225, 185)');

  return [timerText, maxNodeText, avgDegreeText];
};

function visualiseNetwork(networkData) {
  d3.selectAll('svg').remove();
  const numGraphs = networkData.length;

  networkData.forEach((graph, idx) => {
    let startNode = null;
    let endNode = null;

    const [nodes, links, width, height, color] = initialiseConstants(graph, numGraphs);
    const [simulation, svg, container, link, node, texts] = setup(nodes, links, width, height, numGraphs, idx);
    const [timerText, maxNodeText, avgDegreeText] = setupMetrics(svg, nodes);

    node
      .on('click', function(event, d) {
        if (startNode === null) {
          startNode = d;
          d3.select(this).style('fill', 'green');
        } else if (endNode === null) {
          endNode = d;
          d3.select(this).style('fill', 'red');
        }
      });

    node.call(drag(simulation));
    svg.call(createZoom(link, node, texts, container));
    simulation.on('tick', () => ticked(link, node, texts));

    window.addEventListener('resize', () =>
      handleResize(networkData, simulation)
    );

    let degreeMatched = false;
    
    const colours = [
      "#FF5733",
      "#33FF57",
      "#3357FF",
      "#F3FF33",
      "#FF33DD",
      "#33FFF5"
    ];

    const colourPairs = [
      ["rgb(18, 225, 185)", "white"],
      ["#FF5733", "#33FF57"],
      ["#3357FF", "#F3FF33"],
      ["#FF33DD", "#33FFF5"]
    ];

    texts.text(d => d.links.length);

    window.addEventListener('keydown', function(event) {
      if (event.key === 'd' && startNode !== null && endNode !== null) {
        depthFirstTraversal(startNode, endNode, links, link, node, timerText);
      } else if(event.key === 'b' && startNode !== null && endNode !== null) {
        breadthFirstTraversal(startNode, endNode, links, link, node, timerText);
      } else if(event.key === 'a' && startNode !== null && endNode !== null) {
        aStarTraversal(startNode, endNode, links, link, node, timerText);
      } else if(event.key === 'm') {
        const maxNode = maxDegreeNode(nodes);
        node
          .filter(d => d._id === maxNode._id)
          .attr('r', 30)
          .style('fill', colours[Math.floor(Math.random() * colours.length)]);
      } else if(event.key === 'g') {
        degreeMatched = ~degreeMatched;
        node.each(function(d) {
          const r = degreeMatched ? d.links.length : 10;
          d3.select(this).attr('r', Math.ceil(r/2));
        }) 
      } else if(event.key === 'c') {
        const colourIdx = Math.floor(Math.random() * colourPairs.length);
        const nodeColour = colourPairs[colourIdx][0];
        const linkColour = colourPairs[colourIdx][1];
        node.style('fill', nodeColour);
        link.style('stroke', linkColour);
      }
    });
  });
};

document.addEventListener('DOMContentLoaded', function() {
  const networkData = JSON.parse(document.getElementById('network-data').textContent);
  visualiseNetwork(networkData);
});
