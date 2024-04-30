const express = require('express');
const router = express.Router();
const multer = require('multer');

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
    uploadCount = 0;

    res.status(200).render('network', { networksData: networksData });
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

      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      await Promise.all(files.map( async file => {
        uploadCount++;
        // Convert file data to JSON
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
      }));

      res.status(200).redirect('network')
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  }
);

// DELETE - DELETE ALL NETWORKS

module.exports = router;
