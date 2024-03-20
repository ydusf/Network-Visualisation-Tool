const express = require('express');
const router = express.Router();
const multer = require('multer');

const Network = require('../models/NetworkModel');
const Node = require('../models/NodeModel');
const Link = require('../models/LinkModel');

const authValidator = require('../middleware/authValidator');
const convertData = require('../networkHelpers/dataConverter');
const createNetwork = require('../networkHelpers/processFiles');
const renderNetwork = require('../networkHelpers/renderGraph');

const storage = multer.memoryStorage();

const upload = multer({ storage });

let uploadCount = 0;

// GET - NETWORK VISUALISATION
router.get('/network', authValidator, async (req, res) => {
  try {
    const user = req.user;

    const fetchLimit = uploadCount > 1 ? 2 : 1;
    
    const networksData = await renderNetwork(user, fetchLimit);

    console.log(networksData);

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

      await files.forEach(async file => {
        uploadCount++;
        // Convert file data to JSON
        console.log(file.originalname);
        const fileExt = file.originalname.split('.').pop().toLowerCase();
        const fileContent = await convertData(file.buffer.toString(), fileExt);

        // Validate file content
        if (!fileContent.nodes || !fileContent.links) {
          return res.status(400).json({ error: 'Invalid file content.' });
        }

        // Convert JSON to nodes & links
        const nodes = fileContent.nodes;
        const links = fileContent.links;

        await createNetwork(nodes, links, req.user._id);
      });

      res.redirect('network')
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  }
);

router.get('/analytics', authValidator, async (req, res) => {
  res.render('analytics')
});

// DELETE - DELETE ALL NETWORKS

module.exports = router;
