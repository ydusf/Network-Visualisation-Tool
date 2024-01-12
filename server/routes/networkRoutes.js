const express = require("express");
const router = express.Router();
const authValidator = require("../middleware/authValidator");
const User = require("../models/UserModel");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("network_files"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// GET - NETWORK VISUALISATION
router.get("/network", authValidator, async (req, res) => {
  res.render("network");
});

// POST - NETWORK UPLOAD
// router.post("/upload", async (req, res) => {
//   try {
//     if (req.files) {
//       const files = req.files;
//       const uploadedFile = files.file;
//       console.log(files);
//       console.log(uploadedFile.name);

//       try {
//         uploadedFile.mv("./network_files/" + uploadedFile.name);
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   } catch (error) {
//     console.error(error);
//   }

//   res.redirect("/network");
// });

router.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (req.file) {
      console.log(req.file);
    }
  } catch (error) {
    console.error(error);
  }

  res.redirect("/network");
});

module.exports = router;
