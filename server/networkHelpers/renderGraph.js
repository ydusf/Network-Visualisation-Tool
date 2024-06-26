const Node = require('../models/NodeModel');
const Link = require('../models/LinkModel');
const Network = require('../models/NetworkModel');

async function renderNetwork(user, fetchLimit) {
  const userNetworks = await Network
    .find({ user_id: user._id })
    .sort({ createdAt: -1 })
    .limit(fetchLimit);

  let networksData = [];

  console.log(userNetworks);

  if (userNetworks.length > 0) {
    networksData = await Promise.all(
      userNetworks.map(async (network) => {
        const [nodes, links] = await Promise.all([
          Node.find({ _id: { $in: network.nodes } }),
          Link.find({ _id: { $in: network.links } })
        ]);
        
        console.log(nodes);
        return { nodes, links }; 
      })
    );      
  }

  return networksData;
}

module.exports = renderNetwork;
