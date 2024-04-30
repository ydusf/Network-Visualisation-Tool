const { graphEditDistance, cosineSimilarity } = require('../public/js/analysis');

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

const graph3 = {
  nodes: [
    {'data': 'A'},
    {'data': 'B'},
    {'data': 'C'},
    {'data': 'D'},
    {'data': 'E'},
    {'data': 'F'},
    {'data': 'G'},
    {'data': 'H'},
    {'data': 'I'},
    {'data': 'K'},
    {'data': 'Z'},
  ],
  links: [
    { source: 'B', target: 'C' },
    { source: 'C', target: 'D' },
    { source: 'F', target: 'G' },
    { source: 'G', target: 'A' },
    { source: 'A', target: 'E' },
    { source: 'H', target: 'I' },
    { source: 'H', target: 'A' },
    { source: 'M', target: 'I' },
    { source: 'K', target: 'F' },
    { source: 'Z', target: 'E' }
  ],
}

describe('graphEditDistance', () => {
  it('calculate graph edit distance between two graphs', () => {
    expect(graphEditDistance(graph1, graph1)).toBeCloseTo(0, 3);
    expect(graphEditDistance(graph1, graph2)).toBeCloseTo(2, 3);
    expect(graphEditDistance(graph1, graph3)).toBeCloseTo(18, 3);
    expect(graphEditDistance(graph2, graph3)).toBeCloseTo(20, 3);
    expect(graphEditDistance(graph3, graph3)).toBeCloseTo(0, 3);
  });
});

describe('cosineSimilarity', () => {
  it('calculates cosine similarity between graphs', () => {
    expect(cosineSimilarity(graph1, graph1)).toBeCloseTo(1, 3);
    expect(cosineSimilarity(graph2, graph2)).toBeCloseTo(1, 3);
    expect(cosineSimilarity(graph1, graph2)).toBeCloseTo(0.707107, 3);
  });
});