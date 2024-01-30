const express = require('express');
const router = express.Router();
const authValidator = require('../middleware/authValidator');
const convertData = require('../networkHelpers/dataConverter');
const multer = require('multer');
const User = require('../models/UserModel');
const Network = require('../models/NetworkModel');
const Node = require('../models/NodeModel');
const Link = require('../models/LinkModel');

const storage = multer.memoryStorage();

const upload = multer({ storage });

// GET - NETWORK VISUALISATION
router.get('/network', authValidator, async (req, res) => {
  try {
    const user = req.user;

    const userNetwork = await Network.findOne({ user_id: user._id });

    const nodes = (await Node.find({ _id: { $in: userNetwork.nodes } })) || [];
    const links = (await Link.find({ _id: { $in: userNetwork.links } })) || [];

    res.render('network', { nodes, links });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
    return;
  }
});

router.post(
  '/upload',
  upload.single('file'),
  authValidator,
  async (req, res) => {
    try {
      // Validate file upload
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      // Convert file data to JSON
      const file = req.file;
      const fileExt = file.originalname.split('.').pop().toLowerCase();
      const fileContent = convertData(file.buffer.toString(), fileExt);

      // Validate file content
      if (!fileContent.nodes || !fileContent.links) {
        return res.status(400).json({ error: 'Invalid file content.' });
      }

      // Convert JSON to nodes & links
      const nodes = fileContent.nodes;
      const links = fileContent.links;

      const network = new Network({
        title: 'Test Network',
        description: 'Testing',
        user_id: req.user._id,
        nodes: [],
        links: [],
      });

      const nodeObjects = await Promise.all(
        nodes.map(async nodeData => {
          const newNode = new Node({
            network_id: network._id,
            label: nodeData.name,
            data: nodeData.value,
          });

          // Save the new node to the database
          await newNode.save();

          return newNode;
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

          // Save the new Link to the database
          await newLink.save();

          return newLink;
        })
      );

      // INSERT NODES AND LINKS INTO NEWLY CREATED NETWORK
      network.nodes = nodeObjects.map(node => node._id);
      network.links = linkObjects.map(link => link._id);
      await network.save();

      res.redirect('/network');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  }
);

// DELETE - DELETE ALL NETWORKS

module.exports = router;
