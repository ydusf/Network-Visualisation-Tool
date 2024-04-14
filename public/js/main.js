import { resetGraph, breadthFirstTraversal, depthFirstTraversal, aStarTraversal } from "./search.js";
import { initialiseConstants, setup, handleResize } from "./setup.js";

function setupMetrics(svg, nodes) {
  const avgDegree = d3.mean(nodes, d => d.links.length);
  const maxNode = nodes.reduce((a, b) => a.links.length > b.links.length ? a : b);
  const cosineSimilarity = 0;
  
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
  const cosineText = svg.append('text')
    .attr('x', 10)
    .attr('y', 60)
    .text(`Cosine Similarity: ${cosineSimilarity}`)
    .attr('fill', 'rgb(18, 225, 185)');
  const timerText = svg.append('text')
    .attr('x', 10)
    .attr('y', 80)
    .text('Nodes Visited: 0; Shortest Path Found: 0; Average Degree: 0')
    .attr('fill', 'rgb(18, 225, 185)');

  return [timerText, maxNodeText, avgDegreeText, cosineText];
};

function visualiseNetwork(networkData) {
  d3.selectAll('svg').remove();
  const numGraphs = networkData.length;

  networkData.forEach((graph, idx) => {
    let startNode = null, endNode = null;
    const [nodes, links, width, height] = initialiseConstants(graph, numGraphs);
    const [simulation, svg, container, link, node, texts, arrows] = setup(nodes, links, width, height, numGraphs, idx);
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
    let arrowsHidden = false;
    let textsHidden = false;
    let maxNodeVisible = false;

    const colourPairs = [
      ["rgb(18, 225, 185)", "white"],
      ["#FF5733", "#33FF57"],
      ["#3357FF", "#F3FF33"],
      ["#FF33DD", "#33FFF5"]
    ];

    const colours = [
      '#0D56D7', '#C30472', '#67B136', '#E6B7D8', '#2952F1', '#2FEC83', '#5A0646', '#378BB7', '#A62419', '#D64852',
      '#1F0BEA', '#D6', '#736014', '#F88574', '#0BAA53', '#4AAABF', '#AFFE73', '#CCC449', '#82809C', '#9CB800',
      '#EB5CF4', '#769025', '#D728A2', '#0D56D7', '#C30472', '#67B136', '#E6B7D8', '#2952F1', '#2FEC83', '#5A0646',
      '#378BB7', '#A62419', '#D64852', '#1F0BEA', '#D6', '#736014', '#F88574', '#0BAA53', '#4AAABF', '#AFFE73',
      '#CCC449', '#82809C', '#9CB800', '#EB5CF4', '#769025', '#D728A2', '#0D56D7', '#C30472', '#67B136', '#E6B7D8'];
    const color = d3.scaleOrdinal().range(colours);

    texts.text(d => d.links.length);

    window.addEventListener('keydown', function(event) {
      if (event.key === 'd' && startNode !== null && endNode !== null) {
        depthFirstTraversal(startNode, endNode, links, nodes, link, node, timerText);

      } else if(event.key === 'b' && startNode !== null && endNode !== null) {
        breadthFirstTraversal(startNode, endNode, links, nodes, link, node, timerText);

      } else if(event.key === 'a' && startNode !== null && endNode !== null) {
        aStarTraversal(startNode, endNode, links, nodes, link, node, timerText);
      
      } else if(event.key === 'h') {
        node.style('fill', d => color(d.group))

      } else if(event.key === 'j') {
        node.style('fill', d => color(d.cluster))

      } else if(event.key === 'n') {
        resetGraph(node, link);

      } else if(event.key === 'm') {
        const maxNode = nodes.reduce((a, b) => a.links.length > b.links.length ? a : b);
        const nodeObj = node.filter(d => d._id === maxNode._id);
        const colourAndRadius = maxNodeVisible 
          ? [5, 'rgb(18, 225, 185)'] 
          : [30, colours[Math.floor(Math.random() * colours.length)]];

        nodeObj
          .attr('r', colourAndRadius[0])
          .style('fill', colourAndRadius[1]);
        maxNodeVisible = !maxNodeVisible;

      } else if(event.key === 'g') {
        node.each(function(d) {
          const r = degreeMatched ? 10 : d.links.length;
          d3.select(this).attr('r', Math.ceil(r/2));
        });
        degreeMatched = !degreeMatched;
      } else if(event.key === 'c') {
        const colourIdx = Math.floor(Math.random() * colourPairs.length);
        const nodeColour = colourPairs[colourIdx][0];
        const linkColour = colourPairs[colourIdx][1];
        node.style('fill', nodeColour);
        link.style('stroke', linkColour);

      } else if(event.key === 'd') {
        d3.selectAll('.arrow').attr('visibility', arrowsHidden ? 'visible' : 'hidden');
        arrowsHidden = !arrowsHidden;
      } else if(event.key === 't') {
        d3.selectAll('.texts').attr('visibility', textsHidden ? 'visible' : 'hidden');
        textsHidden = !textsHidden;
      }
    });
  });
};

document.addEventListener('DOMContentLoaded', function() {
  const networkData = JSON.parse(document.getElementById('network-data').textContent);
  visualiseNetwork(networkData);
});