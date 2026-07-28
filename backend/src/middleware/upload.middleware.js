const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Absolute path to the profile upload directory
const uploadPath = path.join(__dirname, "../../uploads/profile");
console.log("Upload Path:", uploadPath);

// Create the directory automatically if it doesn't exist
fs.mkdirSync(uploadPath, { recursive: true });

// Configure where uploaded profile pictures are stored
const storage = multer.diskStorage({

  // Store uploaded images in uploads/profile
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  // Generate a unique filename using timestamp and user id
  filename: function (req, file, cb) {
    const uniqueName =
      `${Date.now()}-${req.user.id}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },

});

// Accept only supported image formats
const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, and WEBP images are allowed"), false);
  }

};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

module.exports = upload;