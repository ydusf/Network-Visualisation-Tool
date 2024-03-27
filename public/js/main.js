import { breadthFirstTraversal, depthFirstTraversal, aStarTraversal } from "./search.min.js";
import { initialiseConstants, setup, handleResize } from "./setup.min.js";

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
    .text('Nodes Visited: 0; Shortest Path Found: 0; Average Degree: 0')
    .attr('fill', 'rgb(18, 225, 185)');

  return [timerText, maxNodeText, avgDegreeText];
};

function visualiseNetwork(networkData) {
  d3.selectAll('svg').remove();
  const numGraphs = networkData.length;

  networkData.forEach((graph, idx) => {
    let startNode = null, endNode = null;
    const [nodes, links, width, height] = initialiseConstants(graph, numGraphs);
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
        depthFirstTraversal(startNode, endNode, links, nodes, link, node, timerText);
      } else if(event.key === 'b' && startNode !== null && endNode !== null) {
        breadthFirstTraversal(startNode, endNode, links, nodes, link, node, timerText);
      } else if(event.key === 'a' && startNode !== null && endNode !== null) {
        aStarTraversal(startNode, endNode, links, nodes, link, node, timerText);
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