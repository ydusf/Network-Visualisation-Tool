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


  /* output example:

  {
    "nodes": [
      { 
        "name": A,
        "value": 0, 
      },
      { 
        "name": B,
        "value": 1, 
      },
      etc...
    ],
    "links": [
      { 
        "source": 0,
        "target": 1,
        "value": 0,
      },
      etc...
    ]
  }
  */
}

const graph = generate(2000, 3500);

const fs = require("fs");

fs.writeFile('../data/xl_graph.json', JSON.stringify(graph), err => {
  if (err) {
    console.error(err);
  } else {
    // file written successfully
  }
});

console.log(graph);