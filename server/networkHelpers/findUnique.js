function findUnique(network) {
  // const networkKeys = Object.keys(network);
  // const nodes = network[networkKeys[0]];
  // const links = network[networkKeys[1]];
  // const nodeKeys = Object.keys(nodes[0]);
  // const linkKeys = Object.keys(links[0]);

  // return [linkKeys, nodeKeys];

  return [nodes, links];
}

const graph = {
  nodes: [
    {
      id: 2,
    },
    {
      id: 5,
    },
  ],
  links: [
    {
      source: 2,
      target: 5,
    },
  ],
};

console.log(findUnique(graph));
