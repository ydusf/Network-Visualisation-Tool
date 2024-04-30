const math = require('mathjs');

function createAdjacencyMatrix(graph) {
  const { nodes, links } = graph;
  const numNodes = nodes.length;
  const matrix = math.zeros(numNodes, numNodes);
  
  // Fill the matrix based on links
  links.forEach(link => {
    const sourceIndex = nodes.findIndex(node => node.data === link.source);
    const targetIndex = nodes.findIndex(node => node.data === link.target);
    
    if (sourceIndex !== -1 && targetIndex !== -1) {
      matrix.subset(math.index(sourceIndex, targetIndex), 1);
      matrix.subset(math.index(targetIndex, sourceIndex), 1);
    }
  });
  
  return matrix;
}
function padMatrix(matrix, rows, cols) {
  let paddedMatrix = math.zeros(rows, cols);
  for (let i = 0; i < matrix.size()[0]; i++) {
    for (let j = 0; j < matrix.size()[1]; j++) {
      paddedMatrix.set([i, j], matrix.get([i, j]));
    }
  }
  return paddedMatrix;
}
function graphEditDistance(graph1, graph2) {
  let adj1 = createAdjacencyMatrix(graph1);
  let adj2 = createAdjacencyMatrix(graph2);

  if (adj1.size()[0] < adj2.size()[0] || adj1.size()[1] < adj2.size()[1]) {
    adj1 = padMatrix(adj1, adj2.size()[0], adj2.size()[1]);
  } else if (adj1.size()[0] > adj2.size()[0] || adj1.size()[1] > adj2.size()[1]) {
    adj2 = padMatrix(adj2, adj1.size()[0], adj1.size()[1]);
  }

  let diff = math.abs(math.subtract(adj1, adj2));
  let distance = math.sum(diff);
  return distance;
};
function graphToVector(graph) {
  let nodes = graph.nodes;
  let links = graph.links;
  let vec = [];
  let degree = 0;

  for(const nd of nodes) {
    for(const lk of links) {
      if(lk.source === nd.data || lk.target === nd.data) {
        degree++;
      }
    };
    vec.push(degree);
    degree = 0;
  }
  return vec;
};
function cosineSimilarity(graph1, graph2) {
  const vector1 = graphToVector(graph1);
  const vector2 = graphToVector(graph2);
  const maxLength = Math.max(vector1.length, vector2.length);

  while(vector1.length < maxLength) {
    vector1.push(0);
  }

  while(vector2.length < maxLength) {
    vector2.push(0);
  }
  
  let dotProduct = 0;
  for(let i = 0; i < vector1.length; i++) {
    dotProduct += vector1[i] * vector2[i];
  }

  let mag1 = 0;
  let mag2 = 0;
  for(let i = 0; i < vector1.length; i++) {
    mag1 += Math.pow(vector1[i], 2);
    mag2 += Math.pow(vector2[i], 2);
  }
  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);

  return dotProduct / (mag1 * mag2);
};
function clusteringCoefficient(graph) {
  const { nodes, links } = graph;
  const numNodes = nodes.length;

  let totalClusteringCoefficient = 0;

  nodes.forEach(node => {
    const neighbors = links
      .filter(link => link.source === node.data || link.target === node.data)
      .map(link => (link.source === node.data ? link.target : link.source));

    const numNeighbors = neighbors.length;
    let numConnectedPairs = 0;

    if (numNeighbors < 2) {
      return;
    }

    for (let i = 0; i < numNeighbors - 1; i++) {
      for (let j = i + 1; j < numNeighbors; j++) {
        if (links.some(link => (link.source === neighbors[i] && link.target === neighbors[j]) || (link.source === neighbors[j] && link.target === neighbors[i]))) {
          numConnectedPairs++;
        }
      }
    }

    const clusteringCoefficient = numConnectedPairs / (numNeighbors * (numNeighbors - 1) / 2);
    totalClusteringCoefficient += clusteringCoefficient;
  });

  const overallClusteringCoefficient = totalClusteringCoefficient / numNodes;

  return overallClusteringCoefficient;
}

module.exports = { graphEditDistance, cosineSimilarity, clusteringCoefficient };