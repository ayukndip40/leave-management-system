const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// ===========================================
// Storage Configuration
// ===========================================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(
      null,
      "uploads/leave-attachments"
    );

  },

  filename: (req, file, cb) => {

    const extension = path.extname(
      file.originalname
    );

    const filename =
      `${uuidv4()}${extension}`;

    cb(null, filename);

  },

});

// ===========================================
// Allowed File Types
// ===========================================

const allowedMimeTypes = [

  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",

  // PDF
  "application/pdf",

  // Microsoft Word
  "application/msword",

  // DOCX
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

];

// ===========================================
// File Filter
// ===========================================

const fileFilter = (
  req,
  file,
  cb
) => {

  if (
    allowedMimeTypes.includes(
      file.mimetype
    )
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Only JPG, JPEG, PNG, PDF, DOC and DOCX files are allowed."
      ),
      false
    );

  }

};

// ===========================================
// Multer Configuration
// ===========================================

const upload = multer({

  storage,

  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB per file
},

});

module.exports = upload;