const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const axios = require("axios").default;
const fs = require("fs");
const https = require("https");
const cloudinary = require("cloudinary").v2;
const { ComputerVisionClient } = require("@azure/cognitiveservices-computervision");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");


require("dotenv").config({ path: "./config.env" });

app.set("view engine", "ejs");
app.use(express.static("public"));

// Configure multer for file upload
const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
    } else {
      cb(null, true);
    }
  },
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": process.env.MS_COMPUTER_VISION_SUBSCRIPTION_KEY } }),
  process.env.MS_COMPUTER_VISION_ENDPOINT
);

app.get("/", (req, res) => {
  res.render("index");
});
function formatTags(tags) {
  return tags.map(tag => `${tag.name} (${tag.confidence.toFixed(2)} confidence)`).join(', ');
}


app.post("/", upload.single("file-to-upload"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const tagsURL = result.secure_url;
    const analysisResult = await computerVisionClient.analyzeImage(tagsURL, { visualFeatures: ['Tags'] });
    const tags = analysisResult.tags.map(tag => ({ name: tag.name, confidence: tag.confidence }));

    // Save tags to a JSON file
    fs.writeFile('tags.json', JSON.stringify(tags, null, 2), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).send("Failed to save tags");
      }

      const htmlTags = formatTags(analysisResult.tags);
      res.render("result", {
        image: tagsURL,
        tags: htmlTags
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});


app.listen(process.env.PORT || 8000);
