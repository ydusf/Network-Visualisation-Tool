async function breadthFirstTraversal(start, end, graph, link, node) {
  let visited = {};
  let queue = [];
  let prevNode = {};

  queue.push(start);

  console.log(start);
  console.log(end);

  while (queue.length > 0) {

    const curNode = queue.shift();
    const curNodeId = curNode._id;


    if (!visited[curNodeId]) {
      // await new Promise(resolve => setTimeout(resolve, 75));
      visited[curNodeId] = true;

      node
        .filter(d => d === curNode && d !== start && d !== end)
        .style('fill', 'black');
      // link
      //   .filter(d => d.source === curNode || d.target === curNode)
      //   .style('stroke', 'yellow');
      
      if (prevNode[curNodeId]) {
        link
          .filter(d => (d.source === prevNode[curNodeId] && d.target === curNode) || (d.source === curNode && d.target === prevNode[curNodeId]))
          .style('stroke', 'green')
          .style('stroke-opacity', '1');
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
          queue.push(neighbor);
          prevNode[neighbor._id] = curNode;
        }
      });
    }
  }

  return false;
}

async function depthFirstTraversal(start, end, graph, link, node) {
  let visited = {};
  let stack = [];
  let prevNode = {};

  stack.push(start);

  console.log(start);
  console.log(end);

  while (stack.length > 0) {

    const curNode = stack.pop();
    const curNodeId = curNode._id;


    if (!visited[curNodeId]) {
      // await new Promise(resolve => setTimeout(resolve, 75));
      visited[curNodeId] = true;

      node
        .filter(d => d === curNode && d !== start && d !== end)
        .style('fill', 'black');
      // link
      //   .filter(d => d.source === curNode || d.target === curNode)
      //   .style('stroke', 'yellow');
      
      if (prevNode[curNodeId]) {
        link
          .filter(d => (d.source === prevNode[curNodeId] && d.target === curNode) || (d.source === curNode && d.target === prevNode[curNodeId]))
          .style('stroke', 'red')
          .style('stroke-opacity', '1');
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
          prevNode[neighbor._id] = curNode;
        }
      });
    }
  }

  return false;
}

export { depthFirstTraversal, breadthFirstTraversal };