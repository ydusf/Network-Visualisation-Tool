const express = require('express');
const router = express.Router();
const multer = require('multer');

const Network = require('../models/NetworkModel');
const Node = require('../models/NodeModel');
const Link = require('../models/LinkModel');

const authValidator = require('../middleware/authValidator');
const convertData = require('../networkHelpers/dataConverter');
const createNetwork = require('../networkHelpers/processFiles');

const storage = multer.memoryStorage();

const upload = multer({ storage });

// GET - NETWORK VISUALISATION
router.get('/network', authValidator, async (req, res) => {
  try {
    const user = req.user;

    const userNetworks = await Network.find({ user_id: user._id });

    let networksData = [];

    if (userNetworks.length > 0) {
      for (const network of userNetworks) {
        const [nodes, links] = await Promise.all([
          Node.find({ _id: { $in: network.nodes } }),
          Link.find({ _id: { $in: network.links } })
        ]);
        networksData.push({ nodes, links });
      }
   }

    res.render('network', { networksData: networksData });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
    return;
  }
});

router.post(
  '/upload',
  upload.array('files', 2),
  authValidator,
  async (req, res) => {
    try {
      // Validate file upload
      const files = req.files;

      if (!files) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      await files.forEach(file => {
        // Convert file data to JSON
        console.log(file.originalname);
        const fileExt = file.originalname.split('.').pop().toLowerCase();
        const fileContent = convertData(file.buffer.toString(), fileExt);

        // Validate file content
        if (!fileContent.nodes || !fileContent.links) {
          return res.status(400).json({ error: 'Invalid file content.' });
        }

        // Convert JSON to nodes & links
        const nodes = fileContent.nodes;
        const links = fileContent.links;

        createNetwork(nodes, links, req.user._id);
      });

      res.redirect('/network');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  }
);

// DELETE - DELETE ALL NETWORKS

module.exports = router;
