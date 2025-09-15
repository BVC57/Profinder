// 📁 src/utils/apiUtils.js

/**
 * Get the correct API URL for the current environment
 * This ensures consistency across the application
 */
export const getApiUrl = () => {
  return process.env.REACT_APP_API_URL || 'http:// 10.163.86.92:5000';
};

/**
 * Get the full URL for uploaded files (images, documents, etc.)
 * @param {string} filename - The filename from the uploads folder
 * @returns {string} The full URL to access the file
 */
export const getUploadUrl = (filename) => {
  if (!filename) return null;
  return `${getApiUrl()}/uploads/${filename}`;
};

/**
 * Get the profile photo URL for a user/admin
 * @param {string} profilePhoto - The profile photo filename
 * @returns {string|null} The full URL to the profile photo or null if no photo
 */
export const getProfilePhotoUrl = (profilePhoto) => {
  if (!profilePhoto) return null;
  return getUploadUrl(profilePhoto);
};

/**
 * Get the document URL (Aadhar, Voter ID, etc.)
 * @param {string} documentPath - The document filename
 * @returns {string|null} The full URL to the document or null if no document
 */
export const getDocumentUrl = (documentPath) => {
  if (!documentPath) return null;
  return getUploadUrl(documentPath);
}; 