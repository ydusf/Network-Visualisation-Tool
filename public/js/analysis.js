function graphEditDistance(graph1, graph2) {
  const costMatrix = calculateCostMatrix(graph1, graph2);

  const m = graph1.nodes.length;
  const n = graph2.nodes.length;
  const dp = [];
  for (let i = 0; i <= m; i++) {
    dp[i] = [];
    for (let j = 0; j <= n; j++) {
      dp[i][j] = 0;
    }
  }

  for (let i = 1; i <= m; i++) {
    dp[i][0] = dp[i - 1][0] + costMatrix.nodes[i - 1].deleteCost;
  }
  for (let j = 1; j <= n; j++) {
    dp[0][j] = dp[0][j - 1] + costMatrix.nodes[j - 1].insertCost;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + costMatrix.nodes[i - 1].deleteCost,
        dp[i][j - 1] + costMatrix.nodes[j - 1].insertCost,
        dp[i - 1][j - 1] + costMatrix.links[i - 1][j - 1].editCost
      );
    }
  }

  return dp[m][n];
}

function calculateCostMatrix(graph1, graph2) {
  const costMatrix = {
    nodes: [],
    links: []
  };

  for (const node1 of graph1.nodes) {
    let deleteCost = 1;
    let insertCost = 1;
    for (const node2 of graph2.nodes) {
      if (node1 === node2) {
        deleteCost = 0;
        insertCost = 0;
        break;
      }
    }
    costMatrix.nodes.push({ deleteCost, insertCost });
  }

  for (const node2 of graph2.nodes) {
    let insertCost = 1;
    for (const node1 of graph1.nodes) {
      if (node1 === node2) {
        insertCost = 0;
        break;
      }
    }
    if (insertCost === 1) {
      costMatrix.nodes.push({ deleteCost: 1, insertCost });
    }
  }

  for (const link1 of graph1.links) {
    const row = [];
    for (const link2 of graph2.links) {
      let editCost = 1;
      if (link1.source === link2.source && link1.target === link2.target) {
        editCost = 0;
      }
      row.push({ editCost });
    }
    costMatrix.links.push(row);
  }

  return costMatrix;
}

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

export { graphEditDistance, cosineSimilarity };