const Node = require('../models/NodeModel');
const Link = require('../models/LinkModel');
const Network = require('../models/NetworkModel');

async function createNetwork(nodes, links, userId) {
  const network = new Network({
    title: 'New Network',
    description: '',
    user_id: userId
  });
  await network.save();

  const nodeObjects = await Node.insertMany(
    nodes.map(nodeData => ({
      network_id: network._id,
      label: nodeData.name,
      data: nodeData.value
    }))
  );

  const linkObjects = await Link.insertMany(
    links.map(linkData => ({
      network_id: network._id,
      source: linkData.source,
      target: linkData.target,
      data: linkData.value 
    }))
  );

  network.nodes = nodeObjects.map(obj => obj._id);
  network.links = linkObjects.map(obj => obj._id);
  await network.save();

  return network; 
}

module.exports = createNetwork;
