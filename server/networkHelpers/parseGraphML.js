const { parseString } = require('xml2js');

function parseGraphML(data) {
  return new Promise((resolve, reject) => {
    parseString(data, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      if (!result.graphml || !result.graphml.graph || !result.graphml.graph[0]) {
        reject(new Error('Invalid GraphML format: Missing graph element.'));
        return;
      }

      const graph = result.graphml.graph[0];

      const idMap = new Map();
      let idCounter = 0;

      const nodes = graph.node ? graph.node.map(node => {
        const id = node.$.id;
        let value;

        if (idMap.has(id)) {
          value = idMap.get(id);
        } else {
          value = idCounter++;
          idMap.set(id, value);
        }

        return { value };
      }) : [];

      const edges = graph.edge ? graph.edge.map(edge => ({
        source: idMap.get(edge.$.source),
        target: idMap.get(edge.$.target)
      })) : [];

      const graphJSON = {
        nodes: nodes,
        links: edges,
      };

      resolve(graphJSON);
    });
  });
}

module.exports = parseGraphML;
