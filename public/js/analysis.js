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

export { graphEditDistance };