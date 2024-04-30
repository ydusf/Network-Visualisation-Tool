const { graphEditDistance, cosineSimilarity } = require('./analysis');

const graph1 = {
  nodes: [
    {'data': 'A'},
    {'data': 'B'},
    {'data': 'C'},
  ],
  links: [
    { source: 'A', target: 'B' },
    { source: 'B', target: 'C' }
  ],
};

const graph2 = {
  nodes: [
    {'data': 'B'},
    {'data': 'C'},
    {'data': 'D'},
    {'data': 'E'},
    {'data': 'F'},
    {'data': 'G'},
  ],
  links: [
    { source: 'B', target: 'C' },
    { source: 'C', target: 'D' },
    { source: 'F', target: 'G' },
    { source: 'G', target: 'A' },
    { source: 'A', target: 'E' }
  ],
};
// const COS = cosineSimilarity(graph1, graph2);
// console.log(COS);

// const GED = graphEditDistance(graph1, graph2);
// console.log(GED);
