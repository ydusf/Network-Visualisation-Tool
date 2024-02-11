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

    let nodes = [];
    let links = [];

    if (userNetwork) {
      nodes = await Node.find({ _id: { $in: userNetwork.nodes } });
      links = await Link.find({ _id: { $in: userNetwork.links } });
    }

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

      // Create network object
      const network = new Network({
        title: 'Test Network',
        description: 'Testing',
        user_id: req.user._id,
        nodes: [],
        links: [],
      });

      // Create and save nodes in parallel
      const nodeObjects = await Promise.all(
        fileContent.nodes.map(async nodeData => {
          const newNode = new Node({
            network_id: network._id,
            label: nodeData.name,
            data: nodeData.value,
          });
          await newNode.save();
          return newNode._id;
        })
      );

      // Create and save links in parallel
      const linkObjects = await Promise.all(
        fileContent.links.map(async linkData => {
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

      res.redirect('/network');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  }
);

// DELETE - DELETE ALL NETWORKS

module.exports = router;
