const { parseString } = require('xml2js');

function parseGraphML(data) {
  return new Promise((resolve, reject) => {
    parseString(data, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      const nodes = result.graphml.graph[0].node.map(node => {
        return {
          value: node.$.id,
        };
      });

      const edges = result.graphml.graph[0].edge.map(edge => {
        return {
          source: edge.$.source,
          target: edge.$.target,
        };
      });

      const graphJSON = {
        nodes: nodes,
        links: edges,
      };

      resolve(graphJSON);
    });
  });
}

module.exports = parseGraphML;
