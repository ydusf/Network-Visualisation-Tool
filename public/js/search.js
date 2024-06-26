async function timedExecution(callback, timerText) {
  let elapsed = 0;

  const t = d3.timer(async () => {
    const result = await callback();
    const displayText = `Nodes Visited: ${elapsed}; Shortest Path Found: ${result.shortestPath}; Average Degree: ${result.avgDegree}`;

    if (!result.shouldContinue) {
      t.stop();
      timerText.text(displayText);
    } else {
      elapsed += 1;
      timerText.text(displayText);
    }
  }, 50);
}
function styleTraversedPath(node, link, prevNode, curNodeId, startId, endId, nodeColour, linkColour) {
  node
    .filter(d => d._id === curNodeId && d._id !== startId && d._id !== endId)
    .style('fill', nodeColour);
  
  if (prevNode[curNodeId]) {
    link
      .filter(d => (d.source._id === prevNode[curNodeId] && d.target._id === curNodeId) || (d.source._id === curNodeId && d.target._id === prevNode[curNodeId]))
      .style('stroke', linkColour)
      .style('stroke-width', 4)
      .style('stroke-opacity', '1');
  }
}
function styleShortestPath(node, link, path, idx, startId, endId, nodeColour, linkColour) {  
  node
    .filter(d => d._id === path[idx] && d._id !== startId && d._id !== endId)
    .style('fill', nodeColour);

  if (idx > 0) {
    link
      .filter(d => (d.source._id === path[idx-1] && d.target._id === path[idx]) || (d.source._id === path[idx] && d.target._id === path[idx-1]))
      .style('stroke', linkColour)
      .style('stroke-width', 4)
      .style('stroke-opacity', '1');
  }
}
function traverseShortestPath(node, link, nodes, prevNode, curNodeId, startId, endId) {
  let path = [curNodeId];
  let prev = prevNode[curNodeId];
  while (prev) {
    path.unshift(prev);
    prev = prevNode[prev];
  }

  const shortestPath = path.length;
  let avgDegree = d3.mean(nodes.filter(d => path.includes(d._id)), d => d.links.length).toFixed(2);

  resetGraph(node, link);
  
  for (let i = 0; i < shortestPath; i++) {
    setTimeout(() => {
      styleShortestPath(node, link, path, i, startId, endId, "black", "green");
    }, i * 200);
  }

  return [shortestPath, avgDegree];
}
async function breadthFirstTraversal(start, end, links, nodes, link, node, timerText) {
  let visited = {};
  let toVisit = [start];
  let prevNode = {};
  let found = false;
  let shortestPath = 0;
  let avgDegree = 0;

  await timedExecution(async () => {
    while(toVisit.length > 0 && !found) {
      const curNode = toVisit.shift();
      const curNodeId = curNode._id;

      if (!visited[curNodeId]) {
        visited[curNodeId] = true;

        styleTraversedPath(node, link, prevNode, curNodeId, start._id, end._id, '#3357FF', 'red');

        if (curNodeId === end._id) {
          found = true;
          const [shortestPath, avgDegree] = traverseShortestPath(node, link, nodes, prevNode, curNodeId, start._id, end._id);
          return {shouldContinue: !found, shortestPath, avgDegree};
        }

        const neighbors = links
          .filter(d => d.source === curNode || d.target === curNode)
          .map(d => (d.source === curNode ? d.target : d.source));

        neighbors.forEach(neighbor => {
          if (!visited[neighbor._id]) {
            toVisit.push(neighbor);
            prevNode[neighbor._id] = curNodeId;
          }
        });

        return {shouldContinue: !found, shortestPath, avgDegree};
      }
    }

    return {shouldContinue: false, shortestPath: 0};
  }, timerText);
};
async function depthFirstTraversal(start, end, links, nodes, link, node, timerText) {
  let visited = {};
  let toVisit = [start];
  let prevNode = {};
  let found = false;
  let shortestPath = 0;
  let avgDegree = 0;

  await timedExecution(async () => {
    while(toVisit.length > 0 && !found) {
      const curNode = toVisit.pop();
      const curNodeId = curNode._id;

      if (!visited[curNodeId]) {
        visited[curNodeId] = true;

        styleTraversedPath(node, link, prevNode, curNodeId, start._id, end._id, '#3357FF', 'red');

        if (curNodeId === end._id) {
          console.log('FOUND');
          found = true;
          const [shortestPath, avgDegree] = traverseShortestPath(node, link, nodes, prevNode, curNodeId, start._id, end._id);
          return {shouldContinue: !found, shortestPath, avgDegree};
        }

        const neighbors = links
          .filter(d => d.source === curNode || d.target === curNode)
          .map(d => (d.source === curNode ? d.target : d.source));

        neighbors.forEach(neighbor => {
          if (!visited[neighbor._id]) {
            toVisit.push(neighbor);
            prevNode[neighbor._id] = curNodeId;
          }
        });

        return {shouldContinue: !found, shortestPath, avgDegree};
      }
    }

    return {shouldContinue: false, shortestPath: 0};
  }, timerText);
};
async function aStarTraversal(start, end, links, nodes, link, node, textTimer) {
  let openList = [];
  let closedList = {};
  let prevNode = {};
  let gScore = {};
  let fScore = {};
  let shortestPath = 0;
  let avgDegree = 0;
  let found = false;

  gScore[start._id] = 0;
  fScore[start._id] = 1;

  openList.push(start);

  await timedExecution(async () => {
    while (openList.length > 0 && !found) {
      openList.sort((a, b) => fScore[a._id] - fScore[b._id]);
      const curNode = openList.shift();
      const curNodeId = curNode._id;

      styleTraversedPath(node, link, prevNode, curNodeId, start._id, end._id, '#3357FF', 'red');

      if (curNodeId === end._id) {
        console.log('FOUND');
        found = true;
        const [shortestPath, avgDegree] = traverseShortestPath(node, link, nodes, prevNode, curNodeId, start._id, end._id);
        return {shouldContinue: !found, shortestPath, avgDegree};
      }

      closedList[curNodeId] = true;

      const neighbors = links
        .filter(d => d.source === curNode || d.target === curNode)
        .map(d => (d.source === curNode ? d.target : d.source));

      neighbors.forEach(neighbor => {
        if (closedList[neighbor._id]) {
          return {shouldContinue: !found, shortestPath, avgDegree};
        }

        const tentativeGScore = gScore[curNodeId] + 1;

        if (!openList.includes(neighbor)) {
          openList.push(neighbor);
        } else if (tentativeGScore >= gScore[neighbor._id]) {
          return {shouldContinue: !found, shortestPath, avgDegree};
        }

        prevNode[neighbor._id] = curNodeId;
        gScore[neighbor._id] = tentativeGScore;
        fScore[neighbor._id] = gScore[neighbor._id] + 1;
      });

      return {shouldContinue: !found, shortestPath, avgDegree};
    }

    return {shouldContinue: false, shortestPath, avgDegree};
  }, textTimer);
};
function resetGraph(node, link) {
  node.style('fill', 'rgb(18, 225, 185)');
  node.attr('r', 5);
  link.style('stroke', 'white');
  link.style('stroke-width', '1px');
  link.style('stroke-opacity', 0.6);
}

export { resetGraph, breadthFirstTraversal, depthFirstTraversal, aStarTraversal };