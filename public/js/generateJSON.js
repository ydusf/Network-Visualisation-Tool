function generate(node_size, link_size) {
  const graph = {
    "nodes": [],
    "links": []
  }

  // populate nodes
  for(let i=0; i<node_size; i++) {
    const node = {
      "name": (Math.random() * 0xfffff * 1000000).toString(16),
      "value": i
    }
    graph.nodes.push(node);
  }

  // populate links
  for(let i=0; i<link_size; i++) {
    // determine range for target
    const rd = Math.random();
    const source = i % node_size;
    const max = Math.floor((source * 1.1)) % node_size;
    const min = Math.floor((source * 0.9));
    let target = 0;
    
    if(rd < 0.95) { 
      target = Math.floor(Math.random() * (max  - min) + min);
    } else {
      target = Math.floor(Math.random() * node_size);
    }
    const link = {
      "source": source,
      "target": target === source ? target-1 === -1 ? target+1 : target-1 : target,
      "value": i
    }
    graph.links.push(link);
  }

  return graph;

};

const fs = require("fs");


for(let i = 1; i <= 15; i++) {
  const node_count = 190;
  const link_count = Math.pow(i, 2) * 10;
  const graph = generate(node_count, link_count);
  fs.writeFile(`../data/links_${i}.json`, JSON.stringify(graph), err => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
      console.log(graph);
    }
  });
}

for(let i = 1; i <= 15; i++) {
  const node_count = 10 * Math.pow(i, 2)
  const link_count = 400;
  const graph = generate(node_count, link_count);
  fs.writeFile(`../data/nodes_${i}.json`, JSON.stringify(graph), err => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
      console.log(graph);
    }
  });
}