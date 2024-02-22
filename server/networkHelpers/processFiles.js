const Node = require('../models/NodeModel');
const Link = require('../models/LinkModel');
const Network = require('../models/NetworkModel');

async function createNetwork(nodes, links, userId) {
  const network = new Network({
    title: 'Test Network',
    description: 'Testing',
    user_id: userId,
    nodes: [],
    links: [],
  });

  // Create and save nodes in parallel
  const nodeObjects = await Promise.all(
    nodes.map(async nodeData => {
      const newNode = new Node({
        network_id: network._id,
        label: nodeData.name,
        data: nodeData.value,
      });
      await newNode.save();
      return newNode._id;
    })
  );

  const linkObjects = await Promise.all(
    links.map(async linkData => {
      const newLink = new Link({
        network_id: network._id,
        source: linkData.source,
        target: linkData.target,
        data: linkData.value,
      });
      await newLink.save();
      return newLink._id;
    })
  );

  // Assign node and link IDs to network and save network
  network.nodes = nodeObjects;
  network.links = linkObjects;
  await network.save();
}

module.exports = createNetwork;
