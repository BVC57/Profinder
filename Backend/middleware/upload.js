// 📁 server/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Sanitize filename to prevent security issues
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const ext = path.extname(sanitizedName);
    const nameWithoutExt = path.basename(sanitizedName, ext);
    cb(null, `${Date.now()}_${nameWithoutExt}${ext}`);
  },
});

// Enhanced file filter for identity documents
const fileFilter = (req, file, cb) => {
  // Define allowed MIME types
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'application/pdf'
  ];
  
  // Check if file type is allowed
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (increased from 5MB)
    files: 3, // Maximum 3 files (aadharCard, voterId, profilePhoto)
    fieldSize: 1024 * 1024 // 1MB limit for field names
  }
});

// Configure upload for multiple files
const uploadMultiple = upload.fields([
  { name: 'aadharCard', maxCount: 1 },
  { name: 'voterId', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 },
]);

// Configure upload for single file (profile photo)
const uploadSingle = upload.single('profilePhoto');

// Enhanced error handling middleware for multer errors
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({ 
          message: 'File too large. Maximum file size is 10MB.',
          error: 'FILE_TOO_LARGE',
          maxSize: '10MB'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({ 
          message: 'Too many files uploaded. Maximum 3 files allowed.',
          error: 'TOO_MANY_FILES',
          maxFiles: 3
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({ 
          message: 'Unexpected file field. Only aadharCard, voterId, and profilePhoto are allowed.',
          error: 'UNEXPECTED_FILE',
          allowedFields: ['aadharCard', 'voterId', 'profilePhoto']
        });
      case 'LIMIT_FIELD_COUNT':
        return res.status(400).json({ 
          message: 'Too many fields in form.',
          error: 'TOO_MANY_FIELDS'
        });
      case 'LIMIT_FIELD_SIZE':
        return res.status(400).json({ 
          message: 'Field name too large.',
          error: 'FIELD_NAME_TOO_LARGE'
        });
      default:
        return res.status(400).json({ 
          message: 'File upload error.',
          error: 'UPLOAD_ERROR'
        });
    }
  }
  
  // Handle file type errors
  if (error.message && error.message.includes('File type not allowed')) {
    return res.status(400).json({ 
      message: error.message,
      error: 'INVALID_FILE_TYPE',
      allowedTypes: ['JPEG', 'JPG', 'PNG', 'GIF', 'PDF']
    });
  }
  
  next(error);
};

module.exports = { upload, uploadMultiple, uploadSingle, handleUploadError };
