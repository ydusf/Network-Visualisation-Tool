function generateGraphML(node_size, link_size) {
  let graphML = '<?xml version="1.0" encoding="UTF-8"?>\n';
  graphML += '<graphml xmlns="http://graphml.graphdrawing.org/xmlns" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n';
  graphML += '  <graph id="G" edgedefault="undirected">\n';

  // Populate nodes
  for (let i = 0; i < node_size; i++) {
    const nodeId = i;
    graphML += `    <node id="${nodeId}">\n`;
    graphML += `      <data key="value">${i}</data>\n`;
    graphML += '    </node>\n';
  }

  // Populate links
  for (let i = 0; i < link_size; i++) {
    const source = i % node_size;
    const rd = Math.random();
    const max = Math.floor((source * 1.1)) % node_size;
    const min = Math.floor((source * 0.9));
    let target = 0;

    if (rd < 0.95) {
      target = Math.floor(Math.random() * (max - min) + min);
    } else {
      target = Math.floor(Math.random() * node_size);
    }

    // Avoid self-loops
    if (source === target) {
      target = target === 0 ? 1 : target - 1;
    }

    graphML += `    <edge source="${source}" target="${target}" />\n`;
  }

  graphML += '  </graph>\n</graphml>';

  return graphML;
}


const fs = require("fs");

const node_count = 1500
const link_count = 7500;
const graphMLString = generateGraphML(node_count, link_count);
fs.writeFile(`../data/graphml/graph_${1}.graphml`, graphMLString, err => {
  if (err) {
    console.error(err);
  } else {
    console.log(graphMLString);
  }
});